import {useState, useEffect, useRef, useCallback} from 'react';
import {
  getPrayerTimes,
  getPrayerTimesWeek,
  PrayerTimesResult,
  getNextPrayer,
  PrayerName,
  DEFAULT_METHOD,
} from '../utils/prayerTimes';
import {
  loadCache,
  saveCache,
  isCacheValid,
  getCachedDay,
  buildCacheEntry,
  deserializeTimes,
  cacheDaysRemaining,
  CACHE_DAYS,
} from '../storage/prayerCache';

export interface CacheStatus {
  /** true = data came from local cache (offline safe) */
  fromCache: boolean;
  /** days remaining before cache expires (0 = expired/not cached) */
  daysRemaining: number;
  /** true = cache has expired and internet is needed */
  cacheExpired: boolean;
}

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimesResult | null;
  nextPrayer: {name: PrayerName; time: Date} | null;
  loading: boolean;
  error: string | null;
  cacheStatus: CacheStatus;
  refresh: () => void;
}

export function usePrayerTimes(
  lat: number | undefined,
  lng: number | undefined,
  method: number = DEFAULT_METHOD,
): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResult | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: PrayerName; time: Date} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    fromCache: false,
    daysRemaining: 0,
    cacheExpired: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prayerTimesRef = useRef<PrayerTimesResult | null>(null);

  const fetchTimes = useCallback(async () => {
    if (lat === undefined || lng === undefined) {return;}
    setLoading(true);
    setError(null);

    const now = new Date();

    // ── 1. Try cache first ─────────────────────────────────────────────────
    const cached = await loadCache(lat, lng);
    if (cached && isCacheValid(cached)) {
      const cachedDay = getCachedDay(cached, now);
      if (cachedDay) {
        const times = deserializeTimes(cachedDay, now);
        setPrayerTimes(times);
        prayerTimesRef.current = times;
        setNextPrayer(getNextPrayer(times, now));
        setCacheStatus({
          fromCache: true,
          daysRemaining: cacheDaysRemaining(cached),
          cacheExpired: false,
        });
        setLoading(false);
        // Silently refresh in background when only 1 day remains
        if (cacheDaysRemaining(cached) <= 1) {
          _fetchAndCacheWeek(lat, lng, method, now);
        }
        return;
      }
    }

    // ── 2. Cache expired / missing — need network ──────────────────────────
    if (cached && !isCacheValid(cached)) {
      setCacheStatus({fromCache: false, daysRemaining: 0, cacheExpired: true});
    }

    try {
      const times = await getPrayerTimes(lat, lng, now, method);
      setPrayerTimes(times);
      prayerTimesRef.current = times;
      setNextPrayer(getNextPrayer(times, now));
      setCacheStatus({fromCache: false, daysRemaining: CACHE_DAYS, cacheExpired: false});
      // Pre-fetch full 7 days and store them in cache
      _fetchAndCacheWeek(lat, lng, method, now);
    } catch (e: any) {
      // Network failed — show stale cache if any
      if (cached) {
        const cachedDay = getCachedDay(cached, now);
        if (cachedDay) {
          const times = deserializeTimes(cachedDay, now);
          setPrayerTimes(times);
          prayerTimesRef.current = times;
          setNextPrayer(getNextPrayer(times, now));
          setCacheStatus({fromCache: true, daysRemaining: 0, cacheExpired: true});
          setLoading(false);
          return;
        }
      }
      setError(e?.message ?? 'Failed to fetch prayer times');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, method]);

  useEffect(() => {
    if (lat === undefined || lng === undefined) {return;}
    fetchTimes();

    // Re-fetch at midnight for the new day
    const scheduleNextDay = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 30, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      return setTimeout(() => {
        fetchTimes();
        scheduleNextDay();
      }, msUntilMidnight);
    };

    const midnightTimer = scheduleNextDay();

    // Check every second if the active prayer changed (cheap, no API call)
    intervalRef.current = setInterval(() => {
      if (prayerTimesRef.current) {
        const computed = getNextPrayer(prayerTimesRef.current, new Date());
        setNextPrayer(prev => {
          if (prev?.name === computed?.name) {return prev;}
          return computed;
        });
      }
    }, 1000);

    return () => {
      clearTimeout(midnightTimer);
      if (intervalRef.current) {clearInterval(intervalRef.current);}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, method]);

  return {prayerTimes, nextPrayer, loading, error, cacheStatus, refresh: fetchTimes};
}

/** Background helper: fetch 7 days and save to cache */
async function _fetchAndCacheWeek(
  lat: number,
  lng: number,
  method: number,
  startDate: Date,
): Promise<void> {
  try {
    const week = await getPrayerTimesWeek(lat, lng, startDate, method);
    const entry = buildCacheEntry(lat, lng, method, week);
    await saveCache(entry);
  } catch {
    // Silently fail — cache is best-effort
  }
}
