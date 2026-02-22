import {useState, useEffect, useCallback} from 'react';
import {loadSettings, saveSettings, AppSettings} from '../storage/settings';
import i18n, {LanguageCode} from '../i18n';
import {I18nManager} from 'react-native';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'fr',
    darkMode: false,
    notificationsEnabled: true,
    useGPS: false,
    notificationPrayers: {
      fajr: true,
      sunrise: false,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    },
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      if (s.language) {
        i18n.changeLanguage(s.language);
        const isRTL = s.language === 'ar';
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.forceRTL(isRTL);
        }
      }
      setLoaded(true);
    });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const next = {...settings, ...updates};
    setSettings(next);
    await saveSettings(updates);

    if (updates.language) {
      await i18n.changeLanguage(updates.language);
      const isRTL = updates.language === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }
    }
  }, [settings]);

  return {settings, updateSettings, loaded};
}
