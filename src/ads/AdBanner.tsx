import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

interface AdBannerProps {
  unitId: string;
  size?: BannerAdSize;
}

const AdBanner: React.FC<AdBannerProps> = ({
  unitId,
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
}) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Defer mounting after launch to avoid blocking the UI thread
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <View style={[styles.container, !visible && styles.hidden]}>
      <BannerAd
        unitId={unitId}
        size={size}
        requestOptions={{requestNonPersonalizedAdsOnly: false}}
        onAdLoaded={() => setVisible(true)}
        onAdFailedToLoad={() => setVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});

export default AdBanner;
