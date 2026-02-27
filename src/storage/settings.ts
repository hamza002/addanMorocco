import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageCode} from '../i18n';

const KEYS = {
  SELECTED_CITY: '@pray_selected_city',
  LANGUAGE: '@pray_language',
  DARK_MODE: '@pray_dark_mode',
  NOTIFICATIONS_ENABLED: '@pray_notifications',
  USE_GPS: '@pray_use_gps',
  NOTIFICATION_PRAYERS: '@pray_notif_prayers',
  HADITH_NOTIF_ENABLED: '@pray_hadith_notif',
  TASBIH_LAST: '@pray_tasbih_last',
  SELECTED_COUNTRY: '@pray_selected_country',
};

export interface AppSettings {
  cityName?: string;
  cityLat?: number;
  cityLng?: number;
  countryCode?: string;    // ISO 3166-1 alpha-2
  calculationMethod?: number; // Aladhan method for the selected country
  language?: LanguageCode;
  darkMode?: boolean;
  notificationsEnabled?: boolean;
  useGPS?: boolean;
  notificationPrayers?: Record<string, boolean>;
  hadithNotifEnabled?: boolean;
}

export interface TasbihState {
  dhikr: string;
  count: number;
  target: number;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const batch: [string, string][] = [];

    if (settings.cityName !== undefined) {batch.push([KEYS.SELECTED_CITY, JSON.stringify({name: settings.cityName, lat: settings.cityLat, lng: settings.cityLng, countryCode: settings.countryCode, method: settings.calculationMethod})]);}
    if (settings.language !== undefined) {batch.push([KEYS.LANGUAGE, settings.language]);}
    if (settings.darkMode !== undefined) {batch.push([KEYS.DARK_MODE, String(settings.darkMode)]);}
    if (settings.notificationsEnabled !== undefined) {batch.push([KEYS.NOTIFICATIONS_ENABLED, String(settings.notificationsEnabled)]);}
    if (settings.useGPS !== undefined) {batch.push([KEYS.USE_GPS, String(settings.useGPS)]);}
    if (settings.notificationPrayers !== undefined) {batch.push([KEYS.NOTIFICATION_PRAYERS, JSON.stringify(settings.notificationPrayers)]);}
    if (settings.hadithNotifEnabled !== undefined) {batch.push([KEYS.HADITH_NOTIF_ENABLED, String(settings.hadithNotifEnabled)]);}

    if (batch.length > 0) {
      await AsyncStorage.multiSet(batch);
    }
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const keys = Object.values(KEYS);
    const results = await AsyncStorage.multiGet(keys);
    const map: Record<string, string | null> = {};
    results.forEach(([key, value]) => {
      map[key] = value;
    });

    const cityData = map[KEYS.SELECTED_CITY] ? JSON.parse(map[KEYS.SELECTED_CITY]!) : null;
    const notifPrayers = map[KEYS.NOTIFICATION_PRAYERS] ? JSON.parse(map[KEYS.NOTIFICATION_PRAYERS]!) : {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
      sunrise: false,
    };

    return {
      cityName: cityData?.name,
      cityLat: cityData?.lat,
      cityLng: cityData?.lng,
      countryCode: cityData?.countryCode,
      calculationMethod: cityData?.method,
      language: (map[KEYS.LANGUAGE] as LanguageCode) || 'ar',
      darkMode: map[KEYS.DARK_MODE] === 'true',
      notificationsEnabled: map[KEYS.NOTIFICATIONS_ENABLED] !== 'false',
      useGPS: map[KEYS.USE_GPS] === 'true',
      notificationPrayers: notifPrayers,
      hadithNotifEnabled: map[KEYS.HADITH_NOTIF_ENABLED] !== 'false',
    };
  } catch (e) {
    console.warn('Failed to load settings', e);
    return {
      language: 'ar',
      darkMode: false,
      notificationsEnabled: true,
      useGPS: false,
      notificationPrayers: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        sunrise: false,
      },
      hadithNotifEnabled: true,
    };
  }
}

export async function clearSettings(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.warn('Failed to clear settings', e);
  }
}
