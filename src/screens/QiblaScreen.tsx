import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import {magnetometer, SensorTypes, setUpdateIntervalForType} from 'react-native-sensors';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {loadSettings} from '../storage/settings';
import {calculateQiblaBearing, getDistanceToMecca} from '../utils/qibla';

const DEFAULT_LAT = 33.5731; // Casablanca
const DEFAULT_LNG = -7.5898;

const QiblaScreen: React.FC = () => {
  const {colors, isDark} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cityLat, setCityLat] = useState(DEFAULT_LAT);
  const [cityLng, setCityLng] = useState(DEFAULT_LNG);
  const [cityName, setCityName] = useState('Casablanca');
  const [qiblaBearing, setQiblaBearing] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [heading, setHeading] = useState(0);
  const [sensorAvailable, setSensorAvailable] = useState(true);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const subscriptionRef = useRef<any>(null);
  const lastHeadingRef = useRef(0);

  // Load city from settings
  useEffect(() => {
    loadSettings().then(s => {
      const lat = s.cityLat ?? DEFAULT_LAT;
      const lng = s.cityLng ?? DEFAULT_LNG;
      setCityLat(lat);
      setCityLng(lng);
      if (s.cityName) {setCityName(s.cityName);}
      setQiblaBearing(calculateQiblaBearing(lat, lng));
      setDistanceKm(getDistanceToMecca(lat, lng));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQiblaBearing(calculateQiblaBearing(cityLat, cityLng));
    setDistanceKm(getDistanceToMecca(cityLat, cityLng));
  }, [cityLat, cityLng]);

  // Subscribe to magnetometer
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);

    subscriptionRef.current = magnetometer.subscribe(
      ({x, y}: {x: number; y: number; z: number}) => {
        // Calculate heading from magnetometer x/y
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        // Normalize to 0–360, adjusting for device orientation
        angle = (angle + 360) % 360;
        // Smooth: interpolate 15% toward new value
        const smoothed = lastHeadingRef.current + 0.15 * ((angle - lastHeadingRef.current + 540) % 360 - 180);
        lastHeadingRef.current = smoothed;
        setHeading(smoothed);
      },
      (error: any) => {
        console.warn('Magnetometer error', error);
        setSensorAvailable(false);
      },
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe?.();
      }
    };
  }, []);

  // Animate needle rotation
  useEffect(() => {
    // Needle should point toward Qibla:
    // needle rotation = qiblaBearing - heading
    const needleAngle = (qiblaBearing - heading + 360) % 360;
    Animated.spring(rotateAnim, {
      toValue: needleAngle,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [qiblaBearing, heading, rotateAnim]);

  const interpolatedRotation = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Degree offset from Qibla (for "aligned" indicator)
  const currentNeedleAngle = (qiblaBearing - heading + 360) % 360;
  const angleDiff = Math.min(currentNeedleAngle, 360 - currentNeedleAngle);
  const isAligned = angleDiff < 5;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: colors.card, borderBottomColor: colors.separator}]}>
        <Text style={[styles.headerTitle, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
          {t('qibla')} 🧭
        </Text>
      </View>

      <View style={styles.content}>
        {/* City & distance */}
        <View style={[styles.infoCard, {backgroundColor: colors.card, borderColor: colors.cardBorder}]}>
          <Text style={[styles.infoCity, {color: colors.text}]}>📍 {cityName}</Text>
          <Text style={[styles.infoDistance, {color: colors.textMuted}]}>
            {t('distanceToMecca')}: {distanceKm.toLocaleString()} {t('km')}
          </Text>
          <Text style={[styles.infoBearing, {color: colors.textSecondary}]}>
            {t('qiblaDirection')}: {Math.round(qiblaBearing)}°
          </Text>
        </View>

        {/* Compass */}
        <View style={styles.compassWrapper}>
          {/* Compass rose (static background) */}
          <View style={[styles.compassRose, {borderColor: isAligned ? colors.accent : colors.cardBorder, backgroundColor: colors.card}]}>
            {/* Cardinal directions */}
            <Text style={[styles.compassN, {color: colors.textSecondary}]}>N</Text>
            <Text style={[styles.compassS, {color: colors.textSecondary}]}>S</Text>
            <Text style={[styles.compassE, {color: colors.textSecondary}]}>E</Text>
            <Text style={[styles.compassW, {color: colors.textSecondary}]}>W</Text>

            {/* Tick marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <View
                key={deg}
                style={[
                  styles.tick,
                  {
                    backgroundColor: deg % 90 === 0 ? colors.primary : colors.separator,
                    transform: [
                      {rotate: `${deg}deg`},
                      {translateY: -88},
                    ],
                  },
                ]}
              />
            ))}

            {/* Animated needle */}
            <Animated.View
              style={[
                styles.needle,
                {transform: [{rotate: interpolatedRotation}]},
              ]}>
              {/* North part (red) */}
              <View style={[styles.needleUp, {backgroundColor: colors.primary}]} />
              {/* South part */}
              <View style={[styles.needleDown, {backgroundColor: colors.separator}]} />
              {/* Kaaba icon at tip */}
              <Text style={styles.kaabaIcon}>🕋</Text>
            </Animated.View>

            {/* Center dot */}
            <View style={[styles.centerDot, {backgroundColor: colors.primary}]} />
          </View>
        </View>

        {/* Aligned indicator */}
        {isAligned ? (
          <View style={[styles.alignedBadge, {backgroundColor: colors.accent + '22', borderColor: colors.accent}]}>
            <Text style={[styles.alignedText, {color: colors.accent}]}>
              ✓ {t('pointingToMecca')}
            </Text>
          </View>
        ) : sensorAvailable ? (
          <Text style={[styles.calibrationText, {color: colors.textMuted}]}>
            {t('compassCalibration')}
          </Text>
        ) : (
          <Text style={[styles.calibrationText, {color: colors.textMuted}]}>
            ⚠️ Capteur magnétique non disponible
          </Text>
        )}
      </View>
    </View>
  );
};

const COMPASS_SIZE = 240;
const NEEDLE_WIDTH = 8;
const NEEDLE_HEIGHT = 90;

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    marginBottom: 32,
  },
  infoCity: {
    fontSize: 17,
    fontWeight: '700',
  },
  infoDistance: {
    fontSize: 14,
  },
  infoBearing: {
    fontSize: 14,
  },
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  compassRose: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassN: {
    position: 'absolute',
    top: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  compassS: {
    position: 'absolute',
    bottom: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  compassE: {
    position: 'absolute',
    right: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  compassW: {
    position: 'absolute',
    left: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  tick: {
    position: 'absolute',
    width: 2,
    height: 10,
    top: '50%',
    left: '50%',
    marginLeft: -1,
    marginTop: -5,
  },
  needle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: NEEDLE_WIDTH,
    height: NEEDLE_HEIGHT * 2,
  },
  needleUp: {
    width: NEEDLE_WIDTH,
    height: NEEDLE_HEIGHT,
    borderTopLeftRadius: NEEDLE_WIDTH / 2,
    borderTopRightRadius: NEEDLE_WIDTH / 2,
  },
  needleDown: {
    width: NEEDLE_WIDTH,
    height: NEEDLE_HEIGHT,
    borderBottomLeftRadius: NEEDLE_WIDTH / 2,
    borderBottomRightRadius: NEEDLE_WIDTH / 2,
  },
  kaabaIcon: {
    position: 'absolute',
    top: -22,
    fontSize: 18,
  },
  centerDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  alignedBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  alignedText: {
    fontSize: 15,
    fontWeight: '700',
  },
  calibrationText: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default QiblaScreen;
