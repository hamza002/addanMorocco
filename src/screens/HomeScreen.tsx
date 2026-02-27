import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {usePrayerTimes} from '../hooks/usePrayerTimes';
import Header from '../components/Header';
import PrayerCard from '../components/PrayerCard';
import NextPrayerBanner from '../components/NextPrayerBanner';
import CountryCitySelector, {SelectedLocation} from '../components/CountryCitySelector';
import {DEFAULT_COUNTRY, getCountryByCode} from '../utils/worldCities';
import {detectCountryFromIp} from '../utils/locationDetect';
import {saveSettings, loadSettings} from '../storage/settings';
import {
  getPrayerGradientKey,
  PRAYER_NAMES,
  PrayerName,
  formatTime24,
} from '../utils/prayerTimes';
import {
  schedulePrayerNotifications,
  createNotificationChannel,
  requestNotificationPermission,
  scheduleDailyHadithNotification,
} from '../notifications';
import duas from '../data/duas.json';

const HomeScreen: React.FC = () => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cityLat, setCityLat] = useState<number | undefined>(DEFAULT_COUNTRY.cities[0].lat);
  const [cityLng, setCityLng] = useState<number | undefined>(DEFAULT_COUNTRY.cities[0].lng);
  const [cityDisplayName, setCityDisplayName] = useState<string>(DEFAULT_COUNTRY.cities[0].name);
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY.code);
  const [calcMethod, setCalcMethod] = useState<number>(DEFAULT_COUNTRY.method);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const cacheAlertShownRef = useRef(false);

  const {prayerTimes, nextPrayer, loading, error, cacheStatus, refresh} = usePrayerTimes(
    cityLat,
    cityLng,
    calcMethod,
  );

  // Determine sky gradient based on current time
  const gradientKey = prayerTimes
    ? getPrayerGradientKey(prayerTimes, new Date())
    : 'gradientDay';
  const gradientColors = (colors as any)[gradientKey] as string[];

  // Load saved city on mount, detect from IP if none saved
  useEffect(() => {
    loadSettings().then(async s => {
      setSettings(s);
      if (s.cityName && s.cityLat && s.cityLng) {
        setCityLat(s.cityLat);
        setCityLng(s.cityLng);
        setCityDisplayName(s.cityName);
        if (s.countryCode) {setCountryCode(s.countryCode);}
        if (s.calculationMethod) {setCalcMethod(s.calculationMethod);}
      } else {
        // Detect user's country from IP for the first run
        const detected = await detectCountryFromIp();
        if (detected) {
          const country = getCountryByCode(detected.countryCode) ?? DEFAULT_COUNTRY;
          const defaultCity = country.cities[0];
          setCityLat(defaultCity.lat);
          setCityLng(defaultCity.lng);
          setCityDisplayName(defaultCity.name);
          setCountryCode(country.code);
          setCalcMethod(country.method);
          saveSettings({
            cityName: defaultCity.name,
            cityLat: defaultCity.lat,
            cityLng: defaultCity.lng,
            countryCode: country.code,
            calculationMethod: country.method,
          });
        }
      }
    });
    createNotificationChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show cache-expired alert once per session
  useEffect(() => {
    if (cacheStatus.cacheExpired && !cacheAlertShownRef.current && prayerTimes) {
      cacheAlertShownRef.current = true;
      Alert.alert(
        t('cacheExpiredTitle'),
        t('cacheExpiredMsg'),
        [{text: t('confirm'), style: 'default'}],
      );
    }
  }, [cacheStatus.cacheExpired, prayerTimes, t]);

  // Schedule notifications when prayer times change
  useEffect(() => {
    if (prayerTimes && settings?.notificationsEnabled !== false) {
      requestNotificationPermission().then(granted => {
        if (granted) {
          const labels: Record<PrayerName, string> = {
            fajr: t('prayers.fajr'),
            sunrise: t('prayers.sunrise'),
            dhuhr: t('prayers.dhuhr'),
            asr: t('prayers.asr'),
            maghrib: t('prayers.maghrib'),
            isha: t('prayers.isha'),
          };
          const enabledPrayers = settings?.notificationPrayers || {
            fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true,
          };
          schedulePrayerNotifications(
            prayerTimes,
            enabledPrayers,
            labels,
            t('prayerNotificationBody'),
          );
          if (settings?.hadithNotifEnabled !== false) {
            scheduleDailyHadithNotification(i18n.language);
          }
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayerTimes, settings]);

  const handleLocationSelect = useCallback(
    (location: SelectedLocation) => {
      setCityLat(location.lat);
      setCityLng(location.lng);
      setCityDisplayName(location.cityName);
      setCountryCode(location.countryCode);
      setCalcMethod(location.calculationMethod);
      setSelectorVisible(false);
      cacheAlertShownRef.current = false; // reset alert for new location
      saveSettings({
        cityName: location.cityName,
        cityLat: location.lat,
        cityLng: location.lng,
        countryCode: location.countryCode,
        calculationMethod: location.calculationMethod,
      });
    },
    [],
  );

  const handleUseGPS = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t('locationPermission'),
          message: t('locationError'),
          buttonNeutral: 'Ask Me Later',
          buttonNegative: t('cancel'),
          buttonPositive: t('confirm'),
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(t('locationPermission'), t('locationError'));
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // Find closest country city for display name
        const country = getCountryByCode(countryCode) ?? DEFAULT_COUNTRY;
        let closest = country.cities[0];
        let minDist = Infinity;
        for (const city of country.cities) {
          const dist = Math.sqrt(
            Math.pow(city.lat - latitude, 2) + Math.pow(city.lng - longitude, 2),
          );
          if (dist < minDist) {minDist = dist; closest = city;}
        }
        setCityLat(latitude);
        setCityLng(longitude);
        setCityDisplayName(closest.name + ' (GPS)');
        cacheAlertShownRef.current = false;
        saveSettings({
          cityName: closest.name,
          cityLat: latitude,
          cityLng: longitude,
          countryCode: country.code,
          calculationMethod: country.method,
          useGPS: true,
        });
      },
      _err => {
        Alert.alert(t('locationPermission'), t('locationError'));
      },
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 60000},
    );
  }, [t, countryCode]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    cacheAlertShownRef.current = false;
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={gradientColors[0]}
        translucent={false}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={{backgroundColor: colors.background}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }>
        {/* ── Gradient top section ── */}
        <LinearGradient
          colors={gradientColors}
          style={styles.topSection}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          {/* Islamic Geometric Pattern overlay */}
          <View style={styles.patternOverlay} pointerEvents="none">
            <Text style={styles.patternText}>{'☪'}</Text>
          </View>

          <Header
            cityName={cityDisplayName}
            onCityPress={() => setSelectorVisible(true)}
          />

          {/* GPS button */}
          <TouchableOpacity
            style={[styles.gpsButton, {backgroundColor: 'rgba(255,255,255,0.15)'}]}
            onPress={handleUseGPS}>
            <Text style={styles.gpsIcon}>📡</Text>
            <Text style={[styles.gpsText, {textAlign: isRTL ? 'right' : 'left'}]}>
              {t('useLocation')}
            </Text>
          </TouchableOpacity>

          {/* Next prayer banner */}
          {loading ? (
            <ActivityIndicator
              color="#FFFFFF"
              size="large"
              style={styles.loader}
            />
          ) : error ? (
            <TouchableOpacity onPress={refresh} style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <Text style={styles.retryText}>{t('retry') || 'Réessayer'}</Text>
            </TouchableOpacity>
          ) : (
            <NextPrayerBanner
              name={nextPrayer?.name ?? null}
              time={nextPrayer?.time ?? null}
            />
          )}
        </LinearGradient>

        {/* ── Prayer cards ── */}
        <View style={styles.listContent}>
          {/* Imsak card (shown when prayerTimes available) */}
          {prayerTimes?.imsak && (
            <View style={[styles.imsakCard, {backgroundColor: colors.card, borderColor: colors.cardBorder}]}>
              <Text style={[styles.imsakIcon]}>🌙</Text>
              <View style={styles.imsakInfo}>
                <Text style={[styles.imsakLabel, {color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left'}]}>
                  {t('imsak')}
                </Text>
                <Text style={[styles.imsakTime, {color: colors.primary}]}>
                  {formatTime24(prayerTimes.imsak)}
                </Text>
              </View>
            </View>
          )}

          {PRAYER_NAMES.map(name => {
            if (!prayerTimes) {
              return null;
            }
            const isNext = nextPrayer?.name === name;
            const now = new Date();
            const isActive =
              prayerTimes[name] <= now &&
              (!nextPrayer ||
                PRAYER_NAMES.indexOf(name) <
                  PRAYER_NAMES.indexOf(nextPrayer.name));
            return (
              <PrayerCard
                key={name}
                name={name}
                time={prayerTimes[name]}
                isNext={isNext}
                isActive={isActive}
              />
            );
          })}

          {/* Dua du Jour */}
          {(() => {
            const dayOfYear = Math.floor(
              (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
                (1000 * 60 * 60 * 24),
            );
            const dua = (duas as any[])[dayOfYear % duas.length];
            const duaText: string = dua[i18n.language as 'ar' | 'fr' | 'en'] ?? dua.fr;
            return (
              <View style={[styles.duaCard, {backgroundColor: colors.card, borderColor: colors.cardBorder}]}>
                <Text style={[styles.duaTitle, {color: colors.primary, textAlign: isRTL ? 'right' : 'left'}]}>
                  🤲 {t('duaOfDay')}
                </Text>
                <Text style={[styles.duaAr, {color: colors.text}]}>{dua.ar}</Text>
                {i18n.language !== 'ar' && (
                  <Text style={[styles.duaTrans, {color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left'}]}>
                    {duaText}
                  </Text>
                )}
              </View>
            );
          })()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: colors.textMuted}]}>
              {'☪'} {t('appName')}
            </Text>
            {/* Cache status */}
            {cacheStatus.fromCache && !cacheStatus.cacheExpired && (
              <View style={[styles.cacheBadge, {backgroundColor: colors.primary + '22'}]}>
                <Text style={[styles.cacheBadgeText, {color: colors.primary}]}>
                  📥 {t('cacheOfflineDays', {days: cacheStatus.daysRemaining})}
                </Text>
              </View>
            )}
            {cacheStatus.cacheExpired && (
              <View style={[styles.cacheBadge, {backgroundColor: '#FF6B6B22'}]}>
                <Text style={[styles.cacheBadgeText, {color: '#FF6B6B'}]}>
                  ⚠️ {t('refreshNeeded')}
                </Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      {/* Country & City Selector Modal */}
      <CountryCitySelector
        visible={selectorVisible}
        currentCityName={cityDisplayName}
        currentCountryCode={countryCode}
        onSelect={handleLocationSelect}
        onClose={() => setSelectorVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  topSection: {
    paddingBottom: 16,
  },
  patternOverlay: {
    position: 'absolute',
    top: 10,
    left: 20,
    opacity: 0.07,
  },
  patternText: {
    fontSize: 120,
    color: '#FFFFFF',
  },
  loader: {
    marginVertical: 40,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 6,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  gpsIcon: {fontSize: 14},
  gpsText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cacheBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  cacheBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorBox: {
    margin: 16,
    padding: 12,
    backgroundColor: 'rgba(255,80,80,0.18)',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  retryText: {
    color: '#FFE066',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  imsakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  imsakIcon: {fontSize: 22},
  imsakInfo: {flex: 1},
  imsakLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  imsakTime: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 1,
  },
  duaCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  duaTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  duaAr: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
    lineHeight: 30,
    fontFamily: 'System',
  },
  duaTrans: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
