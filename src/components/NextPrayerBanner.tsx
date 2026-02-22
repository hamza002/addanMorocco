import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {useCountdown} from '../hooks/useCountdown';
import {PrayerName, PRAYER_ICONS} from '../utils/prayerTimes';

interface NextPrayerBannerProps {
  name: PrayerName | null;
  time: Date | null;
}

const NextPrayerBanner: React.FC<NextPrayerBannerProps> = ({name, time}) => {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const countdown = useCountdown(time);
  const isRTL = i18n.language === 'ar';

  const prayerLabel = name ? t(`prayers.${name}`) : '--';
  const icon = name ? PRAYER_ICONS[name] : '🕌';

  return (
    <View style={[styles.container, {backgroundColor: 'rgba(255,255,255,0.12)'}]}>
      {/* Title */}
      <Text style={[styles.label, {color: 'rgba(255,255,255,0.8)', textAlign: isRTL ? 'right' : 'left'}]}>
        {t('nextPrayerIn')}
      </Text>

      {/* Prayer name row */}
      <View style={[styles.prayerRow, {flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
        <Text style={styles.prayerIcon}>{icon}</Text>
        <Text style={[styles.prayerName, {marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0, textAlign: isRTL ? 'right' : 'left'}]}>
          {prayerLabel}
        </Text>
      </View>

      {/* Countdown */}
      <View style={styles.countdownContainer}>
        {countdown.split(':').map((segment, index) => (
          <React.Fragment key={index}>
            <View style={[styles.timeBlock, {backgroundColor: 'rgba(255,255,255,0.15)'}]}>
              <Text style={styles.timeSegment}>{segment}</Text>
            </View>
            {index < 2 && (
              <Text style={styles.separator}>:</Text>
            )}
          </React.Fragment>
        ))}
      </View>

      {/* HH MM SS labels */}
      <View style={[styles.labelsRow, {flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
        {['HH', 'MM', 'SS'].map((lbl, i) => (
          <Text key={lbl} style={[styles.timeLabel, i < 2 && styles.timeLabelSpaced]}>
            {lbl}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prayerIcon: {
    fontSize: 30,
  },
  prayerName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeBlock: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  timeSegment: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  separator: {
    fontSize: 28,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  timeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    minWidth: 60,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '600',
  },
  timeLabelSpaced: {
    marginRight: 18,
  },
});

export default NextPrayerBanner;
