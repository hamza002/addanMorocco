import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  StatusBar,
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

const CitySelector: React.FC<CitySelectorProps> = ({
  visible,
  currentCityName,
  onSelect,
  onClose,
}) => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const [search, setSearch] = useState('');
  const isRTL = i18n.language === 'ar';

  const filtered = useMemo(() => {
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

  const renderItem = ({item}: {item: City}) => {
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
        }}>
        <View style={{flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start'}}>
          <Text style={[styles.cityName, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
            {displayName}
          </Text>
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
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{color: colors.textMuted, fontSize: 18}}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.name}
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
});

export default CitySelector;
