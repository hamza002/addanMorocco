import React, {useState, useEffect, useCallback} from 'react';
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
import CitySelector from '../components/CitySelector';
import {MOROCCAN_CITIES, City, getCityName} from '../utils/moroccanCities';
import {saveSettings, loadSettings} from '../storage/settings';
import {
  getPrayerGradientKey,
  PRAYER_NAMES,
  PrayerName,
} from '../utils/prayerTimes';
import {
  schedulePrayerNotifications,
  createNotificationChannel,
  requestNotificationPermission,
} from '../notifications';

const DEFAULT_CITY = MOROCCAN_CITIES.find(c => c.name === 'Casablanca')!;

const HomeScreen: React.FC = () => {
  const {colors, isDark} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cityLat, setCityLat] = useState<number | undefined>(DEFAULT_CITY.lat);
  const [cityLng, setCityLng] = useState<number | undefined>(DEFAULT_CITY.lng);
  const [cityDisplayName, setCityDisplayName] = useState<string>(DEFAULT_CITY.nameFr);
  const [citySelectorVisible, setCitySelectorVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const {prayerTimes, nextPrayer, loading, refresh} = usePrayerTimes(cityLat, cityLng);

  // Determine sky gradient based on current time
  const gradientKey = prayerTimes
    ? getPrayerGradientKey(prayerTimes, new Date())
    : 'gradientDay';
  const gradientColors = (colors as any)[gradientKey] as string[];

  // Load saved city on mount
  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      if (s.cityName && s.cityLat && s.cityLng) {
        setCityLat(s.cityLat);
        setCityLng(s.cityLng);
        const savedCity = MOROCCAN_CITIES.find(c => c.name === s.cityName);
        if (savedCity) {
          setCityDisplayName(getCityName(savedCity, i18n.language));
        } else {
          setCityDisplayName(s.cityName);
        }
      }
    });
    createNotificationChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update city display name when language changes
  useEffect(() => {
    const city = MOROCCAN_CITIES.find(c => c.lat === cityLat && c.lng === cityLng);
    if (city) {
      setCityDisplayName(getCityName(city, i18n.language));
    }
  }, [i18n.language, cityLat, cityLng]);

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
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayerTimes, settings]);

  const handleCitySelect = useCallback(
    (city: City) => {
      setCityLat(city.lat);
      setCityLng(city.lng);
      setCityDisplayName(getCityName(city, i18n.language));
      setCitySelectorVisible(false);
      saveSettings({
        cityName: city.name,
        cityLat: city.lat,
        cityLng: city.lng,
      });
    },
    [i18n.language],
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
        // Find closest city
        let closest = DEFAULT_CITY;
        let minDist = Infinity;
        for (const city of MOROCCAN_CITIES) {
          const dist = Math.sqrt(
            Math.pow(city.lat - latitude, 2) + Math.pow(city.lng - longitude, 2),
          );
          if (dist < minDist) {
            minDist = dist;
            closest = city;
          }
        }
        setCityLat(latitude);
        setCityLng(longitude);
        setCityDisplayName(getCityName(closest, i18n.language) + ' (GPS)');
        saveSettings({
          cityName: closest.name,
          cityLat: latitude,
          cityLng: longitude,
          useGPS: true,
        });
      },
      error => {
        console.warn('Geolocation error', error);
        Alert.alert(t('locationPermission'), t('locationError'));
      },
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 60000},
    );
  }, [t, i18n.language]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refresh]);

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={gradientColors[0]}
        translucent={false}
      />

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
          onCityPress={() => setCitySelectorVisible(true)}
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
        ) : (
          <NextPrayerBanner
            name={nextPrayer?.name ?? null}
            time={nextPrayer?.time ?? null}
          />
        )}
      </LinearGradient>

      {/* Prayer times list */}
      <ScrollView
        style={[styles.listContainer, {backgroundColor: colors.background}]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }>
        {PRAYER_NAMES.map(name => {
          if (!prayerTimes) {
            return null;
          }
          const isNext = nextPrayer?.name === name;
          const now = new Date();
          const isActive = prayerTimes[name] <= now && (!nextPrayer || PRAYER_NAMES.indexOf(name) < PRAYER_NAMES.indexOf(nextPrayer.name));
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: colors.textMuted}]}>
            {'☪'} {t('appName')}
          </Text>
          <Text style={[styles.methodText, {color: colors.textMuted}]}>
            Muslim World League Method
          </Text>
        </View>
      </ScrollView>

      {/* City Selector Modal */}
      <CitySelector
        visible={citySelectorVisible}
        currentCityName={MOROCCAN_CITIES.find(c => c.lat === cityLat && c.lng === cityLng)?.name}
        onSelect={handleCitySelect}
        onClose={() => setCitySelectorVisible(false)}
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
    right: 20,
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  methodText: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default HomeScreen;
