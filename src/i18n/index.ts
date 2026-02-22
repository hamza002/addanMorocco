import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

export const LANGUAGES = {
  en: {label: 'English', nativeLabel: 'English', rtl: false},
  fr: {label: 'French', nativeLabel: 'Français', rtl: false},
  ar: {label: 'Arabic', nativeLabel: 'العربية', rtl: true},
};

export type LanguageCode = keyof typeof LANGUAGES;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    en: {translation: en},
    fr: {translation: fr},
    ar: {translation: ar},
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
