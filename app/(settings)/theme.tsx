import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SettingsHeader } from '@/components/SettingsHeader';
import { useThemeStore } from '@/state/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ThemeScreen() {
  const { theme, setTheme } = useThemeStore();
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  const themes = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'System' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsHeader title="Theme" />
      <View style={styles.content}>
        {themes.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.option,
              {
                backgroundColor: useThemeColor('card'),
                borderColor: borderColor,
              },
              theme === item.id && { borderColor: tintColor },
            ]}
            onPress={() => setTheme(item.id)}
          >
            <Text style={[styles.optionText, { color: textColor }]}>
              {item.label}
            </Text>
            {theme === item.id && (
              <View style={[styles.checkmark, { backgroundColor: tintColor }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
