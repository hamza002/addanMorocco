import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';

const TASBIH_STORAGE_KEY = '@pray_tasbih_last';

interface TasbihPreset {
  key: string;
  ar: string;
  label: string;
  target: number;
}

const PRESETS: TasbihPreset[] = [
  {key: 'subhanallah', ar: 'سبحان الله', label: 'Subhan Allah', target: 33},
  {key: 'alhamdulillah', ar: 'الحمد لله', label: 'Alhamdulillah', target: 33},
  {key: 'allahuakbar', ar: 'الله أكبر', label: 'Allahu Akbar', target: 34},
  {key: 'custom', ar: '...', label: 'Custom', target: 33},
];

const TasbihScreen: React.FC = () => {
  const {colors, isDark} = useTheme();
  const {t, i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [selectedPreset, setSelectedPreset] = useState<TasbihPreset>(PRESETS[0]);
  const [count, setCount] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customTarget, setCustomTarget] = useState(33);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [customInputTarget, setCustomInputTarget] = useState('33');

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Load last state
  useEffect(() => {
    AsyncStorage.getItem(TASBIH_STORAGE_KEY)
      .then(val => {
        if (val) {
          const saved = JSON.parse(val);
          const preset = PRESETS.find(p => p.key === saved.presetKey) || PRESETS[0];
          setSelectedPreset(preset);
          setCount(saved.count || 0);
          if (saved.customText) {setCustomText(saved.customText);}
          if (saved.customTarget) {setCustomTarget(saved.customTarget);}
        }
      })
      .catch(() => {});
  }, []);

  const save = useCallback(
    (newCount: number, preset: TasbihPreset) => {
      AsyncStorage.setItem(
        TASBIH_STORAGE_KEY,
        JSON.stringify({
          presetKey: preset.key,
          count: newCount,
          customText,
          customTarget,
        }),
      ).catch(() => {});
    },
    [customText, customTarget],
  );

  const handleTap = useCallback(() => {
    const target = selectedPreset.key === 'custom' ? customTarget : selectedPreset.target;
    const newCount = count + 1;

    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, {toValue: 0.92, duration: 80, useNativeDriver: true}),
      Animated.timing(scaleAnim, {toValue: 1, duration: 120, useNativeDriver: true}),
    ]).start();

    Vibration.vibrate(30);

    if (newCount >= target) {
      setCount(newCount);
      setShowCompleted(true);
      save(newCount, selectedPreset);
    } else {
      setCount(newCount);
      save(newCount, selectedPreset);
    }
  }, [count, selectedPreset, customTarget, scaleAnim, save]);

  const handleReset = useCallback(() => {
    setCount(0);
    setShowCompleted(false);
    save(0, selectedPreset);
  }, [selectedPreset, save]);

  const handleSelectPreset = useCallback(
    (preset: TasbihPreset) => {
      if (preset.key === 'custom') {
        setCustomModalVisible(true);
        return;
      }
      setSelectedPreset(preset);
      setCount(0);
      setShowCompleted(false);
      save(0, preset);
    },
    [save],
  );

  const handleCustomConfirm = useCallback(() => {
    const text = customInputText.trim() || '...';
    const target = parseInt(customInputTarget, 10) || 33;
    setCustomText(text);
    setCustomTarget(target);
    const customPreset = {...PRESETS[3], ar: text, target};
    setSelectedPreset(customPreset);
    setCount(0);
    setShowCompleted(false);
    setCustomModalVisible(false);
    save(0, customPreset);
  }, [customInputText, customInputTarget, save]);

  const target = selectedPreset.key === 'custom' ? customTarget : selectedPreset.target;
  const progress = Math.min(count / target, 1);
  const displayAr =
    selectedPreset.key === 'custom' ? customText || '...' : selectedPreset.ar;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: colors.card, borderBottomColor: colors.separator}]}>
        <Text style={[styles.headerTitle, {color: colors.text, textAlign: isRTL ? 'right' : 'left'}]}>
          {t('tasbih')} 📿
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Preset selector */}
        <View style={styles.presetsRow}>
          {PRESETS.map(preset => {
            const isSelected = preset.key === selectedPreset.key;
            const displayLabel =
              preset.key === 'subhanallah'
                ? t('subhanallah')
                : preset.key === 'alhamdulillah'
                ? t('alhamdulillah')
                : preset.key === 'allahuakbar'
                ? t('allahuAkbar')
                : t('custom');
            return (
              <TouchableOpacity
                key={preset.key}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => handleSelectPreset(preset)}>
                <Text
                  style={[
                    styles.presetLabel,
                    {color: isSelected ? colors.textOnPrimary : colors.text},
                  ]}
                  numberOfLines={2}>
                  {displayLabel}
                </Text>
                <Text style={[styles.presetTarget, {color: isSelected ? colors.textOnPrimary : colors.textMuted}]}>
                  ×{preset.key === 'custom' ? customTarget : preset.target}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Arabic dhikr text */}
        <Text style={[styles.dhikrText, {color: colors.primary}]}>
          {displayAr}
        </Text>

        {/* Counter display */}
        <Text style={[styles.countText, {color: colors.text}]}>
          {count}
          <Text style={[styles.targetText, {color: colors.textMuted}]}> / {target}</Text>
        </Text>

        {/* Progress bar */}
        <View style={[styles.progressBg, {backgroundColor: colors.separator}]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: showCompleted ? colors.accent : colors.primary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>

        {showCompleted && (
          <Text style={[styles.completedText, {color: colors.accent}]}>
            {t('completed')}
          </Text>
        )}

        {/* Big tap button */}
        <Animated.View style={[styles.tapButtonWrapper, {transform: [{scale: scaleAnim}]}]}>
          <TouchableOpacity
            style={[
              styles.tapButton,
              {
                backgroundColor: showCompleted ? colors.accent : colors.primary,
                shadowColor: showCompleted ? colors.accent : colors.primary,
              },
            ]}
            onPress={handleTap}
            activeOpacity={0.85}>
            <Text style={[styles.tapButtonEmoji]}>📿</Text>
            <Text style={[styles.tapButtonText, {color: colors.textOnPrimary}]}>
              {t('tapToCount')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Reset button */}
        <TouchableOpacity
          style={[styles.resetBtn, {borderColor: colors.cardBorder, backgroundColor: colors.card}]}
          onPress={handleReset}>
          <Text style={[styles.resetText, {color: colors.textSecondary}]}>
            🔄 {t('resetCounter')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom dhikr modal */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: colors.card}]}>
            <Text style={[styles.modalTitle, {color: colors.text}]}>
              {t('custom')}
            </Text>
            <TextInput
              style={[styles.modalInput, {color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBg}]}
              placeholder="ذكر..."
              placeholderTextColor={colors.textMuted}
              value={customInputText}
              onChangeText={setCustomInputText}
              textAlign="right"
            />
            <TextInput
              style={[styles.modalInput, {color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBg}]}
              placeholder={t('target')}
              placeholderTextColor={colors.textMuted}
              value={customInputTarget}
              onChangeText={setCustomInputTarget}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: colors.separator}]}
                onPress={() => setCustomModalVisible(false)}>
                <Text style={[{color: colors.textSecondary}]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: colors.primary}]}
                onPress={handleCustomConfirm}>
                <Text style={[{color: colors.textOnPrimary, fontWeight: '700'}]}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
    width: '100%',
  },
  presetBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  presetTarget: {
    fontSize: 10,
  },
  dhikrText: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 32,
    textAlign: 'center',
    fontFamily: 'System',
  },
  countText: {
    fontSize: 64,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  targetText: {
    fontSize: 28,
    fontWeight: '400',
  },
  progressBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  tapButtonWrapper: {
    marginTop: 32,
  },
  tapButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    gap: 6,
  },
  tapButtonEmoji: {
    fontSize: 40,
  },
  tapButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetBtn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
});

export default TasbihScreen;
