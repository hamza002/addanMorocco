import React, {useState} from 'react';
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
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.container, !loaded && styles.hidden]}>
      <BannerAd
        unitId={unitId}
        size={size}
        requestOptions={{requestNonPersonalizedAdsOnly: false}}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => setLoaded(false)}
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
