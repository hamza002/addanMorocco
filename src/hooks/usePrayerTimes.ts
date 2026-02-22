import {useState, useEffect, useRef} from 'react';
import {
  getPrayerTimes,
  PrayerTimesResult,
  getNextPrayer,
  PrayerName,
} from '../utils/prayerTimes';

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimesResult | null;
  nextPrayer: {name: PrayerName; time: Date} | null;
  loading: boolean;
  refresh: () => void;
}

export function usePrayerTimes(
  lat: number | undefined,
  lng: number | undefined,
): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResult | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: PrayerName; time: Date} | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculate = () => {
    if (lat === undefined || lng === undefined) {
      return;
    }
    const now = new Date();
    const times = getPrayerTimes(lat, lng, now);
    setPrayerTimes(times);
    setNextPrayer(getNextPrayer(times, now));
    setLoading(false);
  };

  useEffect(() => {
    if (lat === undefined || lng === undefined) {
      return;
    }

    calculate();

    // Recalculate at midnight for next day
    const scheduleNextDay = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 30, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      return setTimeout(() => {
        calculate();
        scheduleNextDay();
      }, msUntilMidnight);
    };

    const midnightTimer = scheduleNextDay();

    // Update next prayer indicator every minute
    intervalRef.current = setInterval(() => {
      if (prayerTimes) {
        setNextPrayer(getNextPrayer(prayerTimes, new Date()));
      }
    }, 60 * 1000);

    return () => {
      clearTimeout(midnightTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return {prayerTimes, nextPrayer, loading, refresh: calculate};
}
