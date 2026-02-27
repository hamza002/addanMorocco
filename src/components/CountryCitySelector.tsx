import React, {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {
  COUNTRIES,
  Country,
  WorldCity,
  getCountryName,
  DEFAULT_COUNTRY,
} from '../utils/worldCities';

export interface SelectedLocation {
  cityName: string;
  lat: number;
  lng: number;
  countryCode: string;
  countryName: string;
  calculationMethod: number;
}

interface Props {
  visible: boolean;
  currentCityName?: string;
  currentCountryCode?: string;
  onSelect: (location: SelectedLocation) => void;
  onClose: () => void;
}

/** Search cities in a given country via Nominatim */
async function searchCitiesOnline(
  query: string,
  countryCode: string,
  signal: AbortSignal,
): Promise<WorldCity[]> {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(query)}&countrycodes=${countryCode.toLowerCase()}` +
    `&format=json&limit=8&addressdetails=1`;
  try {
    const resp = await fetch(url, {
      headers: {'User-Agent': 'PrayTimesWorld/2.0'},
      signal,
    });
    if (!resp.ok) {return [];}
    const data: any[] = await resp.json();
    return data.map(item => {
      const addr = item.address || {};
      const name =
        addr.city || addr.town || addr.village || addr.county || item.name || query;
      return {
        name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      } as WorldCity;
    });
  } catch {
    return [];
  }
}

type Step = 'country' | 'city';

const CountryCitySelector: React.FC<Props> = ({
  visible,
  currentCityName,
  currentCountryCode,
  onSelect,
  onClose,
}) => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';
  const lang = i18n.language;

  const [step, setStep] = useState<Step>('country');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.code === (currentCountryCode ?? 'MA')) ?? DEFAULT_COUNTRY,
  );

  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [onlineCities, setOnlineCities] = useState<WorldCity[]>([]);
  const [onlineLoading, setOnlineLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset step & searches when modal opens
  useEffect(() => {
    if (visible) {
      setStep('country');
      setCountrySearch('');
      setCitySearch('');
      setOnlineCities([]);
      setSelectedCountry(
        COUNTRIES.find(c => c.code === (currentCountryCode ?? 'MA')) ?? DEFAULT_COUNTRY,
      );
    }
  }, [visible, currentCountryCode]);

  // Filtered country list
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) {return COUNTRIES;}
    const q = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      c =>
        c.nameEn.toLowerCase().includes(q) ||
        c.nameFr.toLowerCase().includes(q) ||
        c.nameAr.includes(countrySearch) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countrySearch]);

  // Filtered local cities
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) {return selectedCountry.cities;}
    const q = citySearch.toLowerCase();
    return selectedCountry.cities.filter(c => c.name.toLowerCase().includes(q));
  }, [citySearch, selectedCountry]);

  // Debounced Nominatim city search
  useEffect(() => {
    if (step !== 'city') {return;}
    if (citySearch.trim().length < 2) {
      setOnlineCities([]);
      setOnlineLoading(false);
      return;
    }
    if (debounceRef.current) {clearTimeout(debounceRef.current);}
    if (abortRef.current) {abortRef.current.abort();}
    setOnlineLoading(true);

    debounceRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const results = await searchCitiesOnline(citySearch, selectedCountry.code, ctrl.signal);
      // De-dup with local list
      const unique = results.filter(
        r => !selectedCountry.cities.some(c => Math.abs(c.lat - r.lat) < 0.05 && Math.abs(c.lng - r.lng) < 0.05),
      );
      setOnlineCities(unique);
      setOnlineLoading(false);
    }, 350);

    return () => {
      if (debounceRef.current) {clearTimeout(debounceRef.current);}
      if (abortRef.current) {abortRef.current.abort();}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citySearch, step, selectedCountry]);

  const handleSelectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
    setCitySearch('');
    setOnlineCities([]);
    setStep('city');
  }, []);

  const handleSelectCity = useCallback(
    (city: WorldCity) => {
      onSelect({
        cityName: city.name,
        lat: city.lat,
        lng: city.lng,
        countryCode: selectedCountry.code,
        countryName: getCountryName(selectedCountry, lang),
        calculationMethod: selectedCountry.method,
      });
      setCitySearch('');
      setOnlineCities([]);
    },
    [selectedCountry, lang, onSelect],
  );

  const combinedCities: Array<WorldCity & {_online?: boolean}> = useMemo(() => [
    ...filteredCities,
    ...onlineCities.map(c => ({...c, _online: true as boolean})),
  ], [filteredCities, onlineCities]);

  const renderCountryItem = ({item}: {item: Country}) => {
    const isSelected = item.code === selectedCountry.code;
    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          {
            backgroundColor: isSelected ? colors.highlight : colors.card,
            borderBottomColor: colors.separator,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
        onPress={() => handleSelectCountry(item)}>
        <View style={{flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start'}}>
          <Text style={[styles.itemName, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
            {getCountryName(item, lang)}
          </Text>
          <Text style={[styles.itemSub, {color: colors.textMuted, textAlign: isRTL ? 'right' : 'left'}]}>
            {item.nameEn !== getCountryName(item, lang) ? item.nameEn : item.code}
          </Text>
        </View>
        {isSelected && <Text style={[styles.check, {color: colors.primary}]}>✓</Text>}
        {!isRTL && <Text style={[styles.arrow, {color: colors.textMuted}]}>›</Text>}
        {isRTL && <Text style={[styles.arrow, {color: colors.textMuted, transform: [{scaleX: -1}]}]}>›</Text>}
      </TouchableOpacity>
    );
  };

  const renderCityItem = ({item}: {item: WorldCity & {_online?: boolean}}) => {
    const isSelected = item.name === currentCityName;
    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          {
            backgroundColor: isSelected ? colors.highlight : colors.card,
            borderBottomColor: colors.separator,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
        onPress={() => handleSelectCity(item)}>
        <View style={{flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Text style={[styles.itemName, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
              {item.name}
            </Text>
            {item._online && (
              <View style={[styles.badge, {backgroundColor: colors.primary + '22'}]}>
                <Text style={[styles.badgeText, {color: colors.primary}]}>🌐</Text>
              </View>
            )}
          </View>
        </View>
        {isSelected && <Text style={[styles.check, {color: colors.primary}]}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, {backgroundColor: colors.background}]}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.separator,
              backgroundColor: colors.card,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}>
          {step === 'city' ? (
            <TouchableOpacity onPress={() => setStep('country')} style={styles.backBtn}>
              <Text style={[styles.backText, {color: colors.primary}]}>
                {isRTL ? '›' : '‹'} {getCountryName(selectedCountry, lang)}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.headerTitle, {color: colors.text}]}>
              {t('selectCountry')}
            </Text>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeTxt, {color: colors.primary}]}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>

        {/* Step title */}
        {step === 'city' && (
          <View style={[styles.stepBanner, {backgroundColor: colors.primary + '18'}]}>
            <Text style={[styles.stepText, {color: colors.primary, textAlign: isRTL ? 'right' : 'left'}]}>
              {t('selectCity')}
            </Text>
          </View>
        )}

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <View style={[styles.searchWrapper, {backgroundColor: colors.card, borderBottomColor: colors.separator}]}>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.text,
                backgroundColor: colors.background,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            placeholder={step === 'country' ? t('searchCountry') : t('searchCity')}
            placeholderTextColor={colors.textMuted}
            value={step === 'country' ? countrySearch : citySearch}
            onChangeText={step === 'country' ? setCountrySearch : setCitySearch}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {step === 'city' && onlineLoading && (
            <ActivityIndicator size="small" color={colors.primary} style={{marginRight: 8}} />
          )}
        </View>

        {/* ── List ────────────────────────────────────────────────────────── */}
        {step === 'country' ? (
          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            renderItem={renderCountryItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={combinedCities}
            keyExtractor={(item, idx) => `${item.name}_${idx}`}
            renderItem={renderCityItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !onlineLoading ? (
                <Text style={[styles.emptyText, {color: colors.textMuted}]}>
                  {t('noCitiesFound')}
                </Text>
              ) : null
            }
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    ...Platform.select({ios: {paddingTop: 50}}),
  },
  headerTitle: {fontSize: 17, fontWeight: '600'},
  backBtn: {flex: 1},
  backText: {fontSize: 16, fontWeight: '600'},
  closeBtn: {paddingLeft: 12},
  closeTxt: {fontSize: 16},
  stepBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepText: {fontSize: 13, fontWeight: '600'},
  searchWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  list: {paddingBottom: 20},
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  itemName: {fontSize: 16, fontWeight: '500'},
  itemSub: {fontSize: 12, marginTop: 2},
  check: {fontSize: 18, marginLeft: 8},
  arrow: {fontSize: 22, marginLeft: 4},
  badge: {borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1},
  badgeText: {fontSize: 11},
  emptyText: {textAlign: 'center', marginTop: 30, fontSize: 14},
});

export default CountryCitySelector;
