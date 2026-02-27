import React, {useState, useMemo, useEffect, useRef} from 'react';
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
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {MOROCCAN_CITIES, City, getCityName} from '../utils/moroccanCities';

interface CitySelectorProps {
  visible: boolean;
  currentCityName?: string;
  onSelect: (city: City) => void;
  onClose: () => void;
}

// Search any city in Morocco via OpenStreetMap Nominatim
async function searchCitiesOnline(query: string, signal: AbortSignal): Promise<City[]> {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(query)}&countrycodes=ma&format=json&limit=8&addressdetails=1`;
  const resp = await fetch(url, {
    headers: {'User-Agent': 'PrayTimeMorocco/1.0'},
    signal,
  });
  if (!resp.ok) {return [];}
  const data: any[] = await resp.json();
  return data.map(item => {
    const addr = item.address || {};
    const cityName =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      item.name ||
      query;
    const region =
      addr.state || addr.county || addr.region || 'Maroc';
    return {
      name: cityName,
      nameAr: cityName,
      nameFr: cityName,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      region,
    } as City;
  });
}

const CitySelector: React.FC<CitySelectorProps> = ({
  visible,
  currentCityName,
  onSelect,
  onClose,
}) => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const [search, setSearch] = useState('');
  const [apiResults, setApiResults] = useState<City[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isRTL = i18n.language === 'ar';

  // Local filter
  const localFiltered = useMemo(() => {
    if (!search.trim()) {
      return MOROCCAN_CITIES;
    }
    const q = search.toLowerCase();
    return MOROCCAN_CITIES.filter(
      city =>
        city.name.toLowerCase().includes(q) ||
        city.nameAr.includes(search) ||
        city.nameFr.toLowerCase().includes(q) ||
        city.region.toLowerCase().includes(q),
    );
  }, [search]);

  // Debounced Nominatim search — triggers on every keystroke (min 1 char, 350ms delay)
  useEffect(() => {
    if (search.trim().length < 1) {
      setApiResults([]);
      setApiLoading(false);
      return;
    }

    // Cancel previous debounce + in-flight request
    if (debounceRef.current) {clearTimeout(debounceRef.current);}
    if (abortRef.current) {abortRef.current.abort();}

    // Show spinner immediately so user knows search is pending
    setApiLoading(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const results = await searchCitiesOnline(search.trim(), controller.signal);
        // De-dup: skip results that overlap with local list
        const unique = results.filter(
          r =>
            !MOROCCAN_CITIES.some(
              c =>
                Math.abs(c.lat - r.lat) < 0.05 &&
                Math.abs(c.lng - r.lng) < 0.05,
            ),
        );
        setApiResults(unique);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          setApiResults([]);
        }
      } finally {
        setApiLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) {clearTimeout(debounceRef.current);}
      if (abortRef.current) {abortRef.current.abort();}
    };
  }, [search]);

  // Combined list: local results first, then online results
  const combined: Array<City & {_online?: boolean}> = useMemo(() => {
    return [
      ...localFiltered,
      ...apiResults.map(c => ({...c, _online: true})),
    ];
  }, [localFiltered, apiResults]);

  const renderItem = ({item}: {item: City & {_online?: boolean}}) => {
    const isSelected = item.name === currentCityName;
    const displayName = getCityName(item, i18n.language);
    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          {
            backgroundColor: isSelected ? colors.highlight : colors.card,
            borderBottomColor: colors.separator,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
        onPress={() => {
          onSelect(item);
          setSearch('');
          setApiResults([]);
        }}>
        <View style={{flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Text style={[styles.cityName, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
              {displayName}
            </Text>
            {item._online && (
              <View style={[styles.onlineBadge, {backgroundColor: colors.primary + '22'}]}>
                <Text style={[styles.onlineBadgeText, {color: colors.primary}]}>🌐</Text>
              </View>
            )}
          </View>
          <Text style={[styles.regionName, {color: colors.textMuted, textAlign: isRTL ? 'right' : 'left'}]}>
            {item.region}
          </Text>
        </View>
        {isSelected && (
          <Text style={[styles.checkmark, {color: colors.primary}]}>✓</Text>
        )}
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
        {/* Header */}
        <View style={[styles.header, {borderBottomColor: colors.separator, backgroundColor: colors.card, flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
          <Text style={[styles.title, {color: colors.text}]}>
            {t('selectCity')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeBtnText, {color: colors.primary}]}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, {backgroundColor: colors.card, borderColor: colors.inputBorder}]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, {color: colors.text}]}
            placeholder={t('searchCity')}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            textAlign={isRTL ? 'right' : 'left'}
          />
          {apiLoading && (
            <ActivityIndicator size="small" color={colors.primary} style={{marginRight: 4}} />
          )}
          {search.length > 0 && !apiLoading && (
            <TouchableOpacity onPress={() => {setSearch(''); setApiResults([]);}}>
              <Text style={{color: colors.textMuted, fontSize: 18}}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        <FlatList
          data={combined}
          keyExtractor={(item, idx) => `${item.name}-${item.lat}-${idx}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  regionName: {
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  onlineBadge: {
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  onlineBadgeText: {
    fontSize: 11,
  },
});

export default CitySelector;
