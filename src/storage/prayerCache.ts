/**
 * 7-day Prayer Cache System
 *
 * Stores up to 7 days of prayer times per location.
 * Shows a user-friendly warning when cache expires so the user understands
 * they need internet access to refresh data.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PrayerTimesResult} from '../utils/prayerTimes';

const CACHE_VERSION = 'v2';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const CACHE_DAYS = 7; // number of days to pre-fetch

export interface CachedDay {
  dateStr: string; // "DD-MM-YYYY"
  times: {
    imsak: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export interface PrayerCacheEntry {
  cachedAt: number;         // Unix timestamp (ms)
  lat: number;
  lng: number;
  method: number;
  days: CachedDay[];        // Array of up to 7 days
}

function cacheKey(lat: number, lng: number): string {
  return `@pray_cache_${CACHE_VERSION}_${lat.toFixed(4)}_${lng.toFixed(4)}`;
}

function dateToStr(d: Date): string {
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Serialize a PrayerTimesResult to storable strings */
function serializeTimes(times: PrayerTimesResult): CachedDay['times'] {
  const fmt = (d: Date) => `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  return {
    imsak: fmt(times.imsak),
    fajr: fmt(times.fajr),
    sunrise: fmt(times.sunrise),
    dhuhr: fmt(times.dhuhr),
    asr: fmt(times.asr),
    maghrib: fmt(times.maghrib),
    isha: fmt(times.isha),
  };
}

/** Deserialize stored strings back to a PrayerTimesResult */
export function deserializeTimes(cached: CachedDay, refDate: Date): PrayerTimesResult {
  const parse = (timeStr: string): Date => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(refDate);
    d.setHours(h, m, 0, 0);
    return d;
  };
  return {
    imsak: parse(cached.times.imsak),
    fajr: parse(cached.times.fajr),
    sunrise: parse(cached.times.sunrise),
    dhuhr: parse(cached.times.dhuhr),
    asr: parse(cached.times.asr),
    maghrib: parse(cached.times.maghrib),
    isha: parse(cached.times.isha),
  };
}

/** Load cache entry for a given location */
export async function loadCache(lat: number, lng: number): Promise<PrayerCacheEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(lat, lng));
    if (!raw) {return null;}
    return JSON.parse(raw) as PrayerCacheEntry;
  } catch {
    return null;
  }
}

/** Save cache entry for a given location */
export async function saveCache(entry: PrayerCacheEntry): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(entry.lat, entry.lng), JSON.stringify(entry));
  } catch (e) {
    console.warn('Failed to save prayer cache', e);
  }
}

/** Check whether a cache entry is still valid (< 7 days old) */
export function isCacheValid(entry: PrayerCacheEntry): boolean {
  return Date.now() - entry.cachedAt < CACHE_TTL_MS;
}

/** Get milliseconds remaining before cache expires */
export function cacheExpiresIn(entry: PrayerCacheEntry): number {
  return Math.max(0, entry.cachedAt + CACHE_TTL_MS - Date.now());
}

/** How many days are left in the cache */
export function cacheDaysRemaining(entry: PrayerCacheEntry): number {
  return Math.ceil(cacheExpiresIn(entry) / (24 * 60 * 60 * 1000));
}

/** Get cached prayer times for today if available */
export function getCachedDay(entry: PrayerCacheEntry, date: Date): CachedDay | null {
  const str = dateToStr(date);
  return entry.days.find(d => d.dateStr === str) || null;
}

/** Build a fresh cache entry from a map of date → PrayerTimesResult */
export function buildCacheEntry(
  lat: number,
  lng: number,
  method: number,
  results: Map<string, PrayerTimesResult>,
): PrayerCacheEntry {
  const days: CachedDay[] = [];
  results.forEach((times, dateStr) => {
    days.push({dateStr, times: serializeTimes(times)});
  });
  return {cachedAt: Date.now(), lat, lng, method, days};
}

/** Number of days to pre-fetch */
export {CACHE_DAYS};
