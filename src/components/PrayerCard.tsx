import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../theme';
import {formatTime24} from '../utils/prayerTimes';
import {PrayerName, PRAYER_ICONS} from '../utils/prayerTimes';
import {useTranslation} from 'react-i18next';

interface PrayerCardProps {
  name: PrayerName;
  time: Date;
  isNext: boolean;
  isActive: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({name, time, isNext, isActive}) => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';

  const prayerLabel = t(`prayers.${name}`);
  const icon = PRAYER_ICONS[name];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isNext
            ? colors.primary
            : isActive
            ? colors.highlight
            : colors.card,
          borderColor: isNext ? colors.accent : colors.cardBorder,
          borderWidth: isNext ? 1.5 : 1,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}>
      {/* Left: icon + name */}
      <View style={[styles.leftSection, {alignItems: isRTL ? 'flex-end' : 'flex-start'}]}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={{marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0}}>
          <Text
            style={[
              styles.prayerName,
              {
                color: isNext ? colors.textOnPrimary : colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {prayerLabel}
          </Text>
          {isNext && (
            <Text
              style={[
                styles.nextBadge,
                {
                  color: colors.accent,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              ● {t('nextPrayer')}
            </Text>
          )}
        </View>
      </View>

      {/* Right: time */}
      <Text
        style={[
          styles.timeText,
          {color: isNext ? colors.accentLight : colors.primary},
        ]}>
        {formatTime24(time)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  nextBadge: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default PrayerCard;
