// Aladhan API — supports global calculation methods
const ALADHAN_BASE = 'https://api.aladhan.com/v1';
/** Default method (Muslim World League) used as fallback */
export const DEFAULT_METHOD = 3;

export interface PrayerTimesResult {
  imsak: Date;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_NAMES: PrayerName[] = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

export const PRAYER_ICONS: Record<PrayerName, string> = {
  fajr: '🌙',
  sunrise: '🌅',
  dhuhr: '☀️',
  asr: '🌤',
  maghrib: '🌆',
  isha: '🌃',
};

function formatDateForApi(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

function timeStrToDate(timeStr: string, refDate: Date): Date {
  // Remove timezone suffix if present (e.g. "05:44 (+01)" → "05:44")
  const clean = timeStr.split(' ')[0];
  const [h, min] = clean.split(':').map(Number);
  const d = new Date(refDate);
  d.setHours(h, min, 0, 0);
  return d;
}

export async function getPrayerTimes(
  lat: number,
  lng: number,
  date: Date,
  method: number = DEFAULT_METHOD,
): Promise<PrayerTimesResult> {
  const dateStr = formatDateForApi(date);
  const url =
    `${ALADHAN_BASE}/timings/${dateStr}` +
    `?latitude=${lat}&longitude=${lng}&method=${method}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Aladhan API error: ${resp.status}`);
  }
  const json = await resp.json();
  if (json.code !== 200) {
    throw new Error(json.status || 'Aladhan API error');
  }
  const t = json.data.timings;
  return {
    imsak: timeStrToDate(t.Imsak, date),
    fajr: timeStrToDate(t.Fajr, date),
    sunrise: timeStrToDate(t.Sunrise, date),
    dhuhr: timeStrToDate(t.Dhuhr, date),
    asr: timeStrToDate(t.Asr, date),
    maghrib: timeStrToDate(t.Maghrib, date),
    isha: timeStrToDate(t.Isha, date),
  };
}

/**
 * Fetch 7 consecutive days of prayer times starting from `startDate`.
 * Returns a Map of "DD-MM-YYYY" → PrayerTimesResult.
 */
export async function getPrayerTimesWeek(
  lat: number,
  lng: number,
  startDate: Date,
  method: number = DEFAULT_METHOD,
): Promise<Map<string, PrayerTimesResult>> {
  const results = new Map<string, PrayerTimesResult>();
  // Fetch each day individually (Aladhan free tier is generous per day)
  // We do them in parallel for speed
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = formatDateForApi(d);
    promises.push(
      getPrayerTimes(lat, lng, d, method).then(times => {
        results.set(dateStr, times);
      }),
    );
  }
  await Promise.all(promises);
  return results;
}

export function getNextPrayer(
  prayerTimes: PrayerTimesResult,
  now: Date,
): {name: PrayerName; time: Date} {
  for (const name of PRAYER_NAMES) {
    if (prayerTimes[name] > now) {
      return {name, time: prayerTimes[name]};
    }
  }
  // After Isha — estimate tomorrow's Fajr (today's Fajr + 24h)
  const tomorrowFajr = new Date(prayerTimes.fajr.getTime() + 24 * 60 * 60 * 1000);
  return {name: 'fajr', time: tomorrowFajr};
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function formatTime24(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getCountdown(targetTime: Date, now: Date): string {
  const diff = targetTime.getTime() - now.getTime();
  if (diff <= 0) {
    return '00:00:00';
  }
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

export function getPrayerGradientKey(
  prayerTimes: PrayerTimesResult,
  now: Date,
): 'gradientFajr' | 'gradientDay' | 'gradientAsr' | 'gradientMaghrib' | 'gradientIsha' {
  const {fajr, sunrise, dhuhr, asr, maghrib, isha} = prayerTimes;

  if (now < fajr) {
    return 'gradientIsha';
  } else if (now < sunrise) {
    return 'gradientFajr';
  } else if (now < dhuhr) {
    return 'gradientDay';
  } else if (now < asr) {
    return 'gradientDay';
  } else if (now < maghrib) {
    return 'gradientAsr';
  } else if (now < isha) {
    return 'gradientMaghrib';
  } else {
    return 'gradientIsha';
  }
}
