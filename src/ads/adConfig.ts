import {TestIds} from 'react-native-google-mobile-ads';

/**
 * AdMob configuration
 * Replace TEST IDs with your real AdMob unit IDs before releasing.
 * App ID (AndroidManifest.xml meta-data) must also be replaced.
 */
const IS_TEST = __DEV__;

export const AD_UNITS = {
  // ------ BANNER ------
  HOME_BANNER: IS_TEST
    ? TestIds.BANNER
    : 'ca-app-pub-3631683061333555/9976054488', // ← replace

  SETTINGS_BANNER: IS_TEST
    ? TestIds.BANNER
    : 'ca-app-pub-3631683061333555/9976054488', // ← replace

  // ------ INTERSTITIAL ------
  INTERSTITIAL: IS_TEST
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-3631683061333555/6116700523', // ← replace
};
