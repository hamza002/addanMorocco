/**
 * AdContext
 * - showInterstitialOnNav(): show interstitial on tab navigation with 40s cooldown
 * - App Open Ad when app comes back to foreground
 * - Initializes MobileAds SDK once on mount
 */
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import {
  useInterstitialAd,
} from 'react-native-google-mobile-ads';
import {AD_UNITS} from './adConfig';

const INTERSTITIAL_COOLDOWN_MS = 40_000; // 40 seconds

interface AdContextValue {
  /** Call on every tab navigation to show interstitial (respects 40s cooldown) */
  showInterstitialOnNav: () => void;
}

const AdContext = createContext<AdContextValue>({showInterstitialOnNav: () => {}});

export const useAdNav = () => useContext(AdContext).showInterstitialOnNav;

export const AdProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const lastShownRef = useRef<number>(0);

  // ── Interstitial ──────────────────────────────────────────────────────────
  const {
    isLoaded: interLoaded,
    load: loadInter,
    show: showInter,
    isClosed: interClosed,
  } = useInterstitialAd(AD_UNITS.INTERSTITIAL);

  // Keep refs so showInterstitialOnNav never has a stale closure
  const interLoadedRef = useRef(false);
  const showInterRef = useRef(showInter);
  const loadInterRef = useRef(loadInter);

  useEffect(() => { interLoadedRef.current = interLoaded; }, [interLoaded]);
  useEffect(() => { showInterRef.current = showInter; }, [showInter]);
  useEffect(() => { loadInterRef.current = loadInter; }, [loadInter]);

  // Initialize SDK then pre-load
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => loadInterRef.current())
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload after closed
  useEffect(() => {
    if (interClosed) {
      loadInterRef.current();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interClosed]);

  // Stable function — reads latest state from refs, no stale closure
  const showInterstitialOnNav = useCallback(() => {
    const now = Date.now();
    if (now - lastShownRef.current < INTERSTITIAL_COOLDOWN_MS) {
      return; // still in cooldown
    }
    if (interLoadedRef.current) {
      lastShownRef.current = now;
      showInterRef.current();
    } else {
      // Ad not ready yet — trigger a load for next time
      loadInterRef.current();
    }
  // No deps — always reads from refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdContext.Provider value={{showInterstitialOnNav}}>
      {children}
    </AdContext.Provider>
  );
};
