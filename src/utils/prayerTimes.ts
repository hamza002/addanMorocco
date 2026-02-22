import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Prayer,
  Madhab,
  CalculationParameters,
} from 'adhan';

export interface PrayerTimesResult {
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

export function getPrayerTimes(
  lat: number,
  lng: number,
  date: Date,
): PrayerTimesResult {
  const coordinates = new Coordinates(lat, lng);

  // Muslim World League method - used for Morocco
  const params: CalculationParameters = CalculationMethod.MuslimWorldLeague();
  // Morocco follows Maliki madhab (Standard shadow length)
  params.madhab = Madhab.Shafi;

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
  };
}

export function getNextPrayer(
  prayerTimes: PrayerTimesResult,
  now: Date,
): {name: PrayerName; time: Date} | null {
  for (const name of PRAYER_NAMES) {
    if (prayerTimes[name] > now) {
      return {name, time: prayerTimes[name]};
    }
  }
  return null; // After isha — next is fajr tomorrow
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
