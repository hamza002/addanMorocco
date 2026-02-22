import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageCode} from '../i18n';

const KEYS = {
  SELECTED_CITY: '@pray_selected_city',
  LANGUAGE: '@pray_language',
  DARK_MODE: '@pray_dark_mode',
  NOTIFICATIONS_ENABLED: '@pray_notifications',
  USE_GPS: '@pray_use_gps',
  NOTIFICATION_PRAYERS: '@pray_notif_prayers',
};

export interface AppSettings {
  cityName?: string;
  cityLat?: number;
  cityLng?: number;
  language?: LanguageCode;
  darkMode?: boolean;
  notificationsEnabled?: boolean;
  useGPS?: boolean;
  notificationPrayers?: Record<string, boolean>;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const batch: [string, string][] = [];

    if (settings.cityName !== undefined) {batch.push([KEYS.SELECTED_CITY, JSON.stringify({name: settings.cityName, lat: settings.cityLat, lng: settings.cityLng})]);}
    if (settings.language !== undefined) {batch.push([KEYS.LANGUAGE, settings.language]);}
    if (settings.darkMode !== undefined) {batch.push([KEYS.DARK_MODE, String(settings.darkMode)]);}
    if (settings.notificationsEnabled !== undefined) {batch.push([KEYS.NOTIFICATIONS_ENABLED, String(settings.notificationsEnabled)]);}
    if (settings.useGPS !== undefined) {batch.push([KEYS.USE_GPS, String(settings.useGPS)]);}
    if (settings.notificationPrayers !== undefined) {batch.push([KEYS.NOTIFICATION_PRAYERS, JSON.stringify(settings.notificationPrayers)]);}

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
      language: (map[KEYS.LANGUAGE] as LanguageCode) || 'fr',
      darkMode: map[KEYS.DARK_MODE] === 'true',
      notificationsEnabled: map[KEYS.NOTIFICATIONS_ENABLED] !== 'false',
      useGPS: map[KEYS.USE_GPS] === 'true',
      notificationPrayers: notifPrayers,
    };
  } catch (e) {
    console.warn('Failed to load settings', e);
    return {
      language: 'fr',
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
