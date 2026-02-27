import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import ar from './ar.json';

export const LANGUAGES = {
  ar: {label: 'Arabic', nativeLabel: 'العربية', rtl: true},
};

export type LanguageCode = keyof typeof LANGUAGES;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'ar',
  fallbackLng: 'ar',
  resources: {
    ar: {translation: ar},
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
