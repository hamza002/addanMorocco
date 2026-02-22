import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import {LANGUAGES, LanguageCode} from '../i18n';
import {loadSettings, saveSettings} from '../storage/settings';
import {cancelAllNotifications} from '../notifications';

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const SettingsScreen: React.FC = () => {
  const {colors, isDark, setDarkMode} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifPrayers, setNotifPrayers] = useState<Record<string, boolean>>({
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  useEffect(() => {
    loadSettings().then(s => {
      setNotificationsEnabled(s.notificationsEnabled !== false);
      if (s.notificationPrayers) {
        setNotifPrayers(s.notificationPrayers);
      }
      setDarkMode(s.darkMode === true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = useCallback(
    async (lang: LanguageCode) => {
      await i18n.changeLanguage(lang);
      await saveSettings({language: lang});
    },
    [i18n],
  );

  const handleDarkModeToggle = useCallback(
    (val: boolean) => {
      setDarkMode(val);
    },
    [setDarkMode],
  );

  const handleNotificationsToggle = useCallback(async (val: boolean) => {
    setNotificationsEnabled(val);
    await saveSettings({notificationsEnabled: val});
    if (!val) {
      await cancelAllNotifications();
    }
  }, []);

  const handlePrayerNotifToggle = useCallback(
    async (prayer: string, val: boolean) => {
      const updated = {...notifPrayers, [prayer]: val};
      setNotifPrayers(updated);
      await saveSettings({notificationPrayers: updated});
    },
    [notifPrayers],
  );

  const SectionHeader = ({title}: {title: string}) => (
    <Text
      style={[
        styles.sectionHeader,
        {
          color: colors.primary,
          textAlign: isRTL ? 'right' : 'left',
        },
      ]}>
      {title.toUpperCase()}
    </Text>
  );

  const SettingRow = ({
    label,
    right,
    subtitle,
  }: {
    label: string;
    right: React.ReactNode;
    subtitle?: string;
  }) => (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.separator,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}>
      <View style={[styles.rowLabel, {alignItems: isRTL ? 'flex-end' : 'flex-start'}]}>
        <Text style={[styles.rowLabelText, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.rowSubtitle, {color: colors.textMuted, textAlign: isRTL ? 'right' : 'left'}]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );

  return (
    <View style={[styles.flex, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Screen title */}
      <View
        style={[
          styles.screenHeader,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.separator,
          },
        ]}>
        <Text
          style={[
            styles.screenTitle,
            {color: colors.text, textAlign: isRTL ? 'right' : 'left'},
          ]}>
          {t('settings')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ─── APPEARANCE ─── */}
        <SectionHeader title={t('darkMode')} />
        <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.cardBorder}]}>
          <SettingRow
            label={t('darkMode')}
            right={
              <Switch
                value={isDark}
                onValueChange={handleDarkModeToggle}
                trackColor={{false: colors.switchTrack, true: colors.primaryLight}}
                thumbColor={colors.switchThumb}
              />
            }
          />
        </View>

        {/* ─── LANGUAGE ─── */}
        <SectionHeader title={t('language')} />
        <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.cardBorder}]}>
          {(Object.entries(LANGUAGES) as [LanguageCode, typeof LANGUAGES.en][]).map(
            ([code, lang], index) => {
              const isSelected = i18n.language === code;
              const isLast = index === Object.keys(LANGUAGES).length - 1;
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.row,
                    {
                      backgroundColor: isSelected ? colors.highlight : colors.card,
                      borderBottomColor: colors.separator,
                      borderBottomWidth: isLast ? 0 : 0.5,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                  onPress={() => handleLanguageChange(code)}>
                  <Text
                    style={[
                      styles.rowLabelText,
                      {
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? '700' : '400',
                        flex: 1,
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}>
                    {lang.nativeLabel}
                  </Text>
                  <Text
                    style={[
                      styles.rowLabelText,
                      {color: colors.textMuted},
                    ]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <Text
                      style={[styles.checkmark, {color: colors.primary}]}>
                      {' '}✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            },
          )}
        </View>

        {/* ─── NOTIFICATIONS ─── */}
        <SectionHeader title={t('notifications')} />
        <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.cardBorder}]}>
          <SettingRow
            label={t('notificationsEnabled')}
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{false: colors.switchTrack, true: colors.primaryLight}}
                thumbColor={colors.switchThumb}
              />
            }
          />

          {notificationsEnabled && (
            <>
              <View style={[styles.subDivider, {borderTopColor: colors.separator}]} />
              {PRAYER_KEYS.map((prayer, index) => {
                const isLast = index === PRAYER_KEYS.length - 1;
                return (
                  <View
                    key={prayer}
                    style={[
                      styles.row,
                      {
                        backgroundColor: colors.card,
                        borderBottomColor: colors.separator,
                        borderBottomWidth: isLast ? 0 : 0.5,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        paddingLeft: isRTL ? 16 : 32,
                        paddingRight: isRTL ? 32 : 16,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.rowLabelText,
                        {
                          color: colors.textSecondary,
                          flex: 1,
                          textAlign: isRTL ? 'right' : 'left',
                        },
                      ]}>
                      {t(`prayers.${prayer}`)}
                    </Text>
                    <Switch
                      value={notifPrayers[prayer] !== false}
                      onValueChange={val => handlePrayerNotifToggle(prayer, val)}
                      trackColor={{false: colors.switchTrack, true: colors.primaryLight}}
                      thumbColor={colors.switchThumb}
                    />
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* ─── ABOUT ─── */}
        <SectionHeader title={t('about')} />
        <View
          style={[
            styles.card,
            styles.aboutCard,
            {backgroundColor: colors.card, borderColor: colors.cardBorder},
          ]}>
          <Text style={[styles.aboutEmoji]}>🕌</Text>
          <Text style={[styles.aboutTitle, {color: colors.text}]}>
            {t('appName')}
          </Text>
          <Text style={[styles.aboutSub, {color: colors.textMuted}]}>
            {t('version')} 1.0.0
          </Text>
          <Text style={[styles.aboutMethod, {color: colors.textMuted}]}>
            Muslim World League Method
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  screenHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  rowLabel: {
    flex: 1,
  },
  rowLabelText: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rowRight: {
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
  },
  subDivider: {
    borderTopWidth: 0.5,
    marginHorizontal: 16,
  },
  aboutCard: {
    alignItems: 'center',
    padding: 24,
  },
  aboutEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  aboutSub: {
    fontSize: 13,
    marginBottom: 4,
  },
  aboutMethod: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
