// Simple Gregorian to Hijri date conversion
export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const HIJRI_MONTHS_AR = [
  'مُحَرَّم', 'صَفَر', 'ربيع الأول', 'ربيع الثاني',
  'جُمَادَى الأولى', 'جُمَادَى الآخرة', 'رَجَب', 'شَعْبَان',
  'رَمَضَان', 'شَوَّال', 'ذو القعدة', 'ذو الحجة',
];

const HIJRI_MONTHS_FR = [
  'Mouharram', 'Safar', 'Rabi Al-Awwal', 'Rabi Al-Thani',
  'Joumada Al-Awwal', 'Joumada Al-Thani', 'Rajab', 'Chaban',
  'Ramadan', 'Chawwal', "Dhoul Qi'da", 'Dhoul Hijja',
];

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qi'dah", 'Dhul Hijjah',
];

function getHijriMonths(lang: string): string[] {
  switch (lang) {
    case 'ar': return HIJRI_MONTHS_AR;
    case 'fr': return HIJRI_MONTHS_FR;
    default: return HIJRI_MONTHS_EN;
  }
}

export function toHijri(date: Date, lang = 'en'): HijriDate {
  // Julian Day Number from Gregorian date
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Convert JD to Hijri
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const ll = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - ll) / 5316) * Math.floor((50 * ll) / 17719) +
    Math.floor(ll / 5670) * Math.floor((43 * ll) / 15238);
  const lll = ll - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hMonth = Math.floor((24 * lll) / 709);
  const hDay = lll - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  const months = getHijriMonths(lang);
  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthName: months[hMonth - 1] || '',
  };
}

export function formatHijriDate(date: Date, lang = 'en'): string {
  const h = toHijri(date, lang);
  if (lang === 'ar') {
    return `${h.day} ${h.monthName} ${h.year} هـ`;
  }
  return `${h.day} ${h.monthName} ${h.year} AH`;
}

const GREGORIAN_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const GREGORIAN_MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const GREGORIAN_MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const GREGORIAN_DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const GREGORIAN_DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const GREGORIAN_DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function formatGregorianDate(date: Date, lang = 'en'): string {
  const months = lang === 'fr' ? GREGORIAN_MONTHS_FR : lang === 'ar' ? GREGORIAN_MONTHS_AR : GREGORIAN_MONTHS_EN;
  const days = lang === 'fr' ? GREGORIAN_DAYS_FR : lang === 'ar' ? GREGORIAN_DAYS_AR : GREGORIAN_DAYS_EN;
  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  return `${dayName}, ${date.getDate()} ${month} ${date.getFullYear()}`;
}
