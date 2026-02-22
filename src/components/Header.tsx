import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {formatGregorianDate, formatHijriDate} from '../utils/hijriDate';

interface HeaderProps {
  cityName: string | undefined;
  onCityPress: () => void;
}

const Header: React.FC<HeaderProps> = ({cityName, onCityPress}) => {
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const isRTL = i18n.language === 'ar';

  const today = new Date();
  const gregorianDate = formatGregorianDate(today, i18n.language);
  const hijriDate = formatHijriDate(today, i18n.language);

  return (
    <View style={[styles.container, {alignItems: isRTL ? 'flex-end' : 'flex-start'}]}>
      {/* App name */}
      <Text style={[styles.appName, {color: 'rgba(255,255,255,0.75)', textAlign: isRTL ? 'right' : 'left'}]}>
        {t('appName')}
      </Text>

      {/* City selector */}
      <TouchableOpacity
        style={[styles.cityButton, {flexDirection: isRTL ? 'row-reverse' : 'row'}]}
        onPress={onCityPress}
        activeOpacity={0.8}>
        <Text style={styles.locationPin}>📍</Text>
        <Text
          style={[
            styles.cityName,
            {
              color: '#FFFFFF',
              marginLeft: isRTL ? 0 : 6,
              marginRight: isRTL ? 6 : 0,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}>
          {cityName || t('selectCity')}
        </Text>
        <Text style={[styles.chevron, {color: 'rgba(255,255,255,0.7)', marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0}]}>
          {isRTL ? '‹' : '›'}
        </Text>
      </TouchableOpacity>

      {/* Gregorian date */}
      <Text style={[styles.gregorianDate, {color: 'rgba(255,255,255,0.85)', textAlign: isRTL ? 'right' : 'left'}]}>
        {gregorianDate}
      </Text>

      {/* Hijri date */}
      <Text style={[styles.hijriDate, {color: colors.accentLight, textAlign: isRTL ? 'right' : 'left'}]}>
        {hijriDate}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  appName: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationPin: {
    fontSize: 16,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
  gregorianDate: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 3,
  },
  hijriDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default Header;
