import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/state/theme';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorLight,
    card: '#fff',
    border: '#e1e1e1',
    input: '#f8f9fa',
    surface: '#ffffff',
    surfaceSecondary: '#f8f9fa',
    textSecondary: '#666666',
    success: '#34C759',
    error: '#FF3B30',
    divider: '#e1e1e1',
    placeholder: '#999999',
    shadow: '#000000',
    tabBar: '#ffffff',
    navBar: '#ffffff',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#8e8e93',
    tabIconSelected: tintColorDark,
    card: '#1c1c1e',
    border: '#2c2c2e',
    input: '#2c2c2e',
    surface: '#1c1c1e',
    surfaceSecondary: '#2c2c2e',
    textSecondary: '#8e8e93',
    success: '#32d74b',
    error: '#ff453a',
    divider: '#38383a',
    placeholder: '#666666',
    shadow: '#000000',
    tabBar: '#1c1c1e',
    navBar: '#1c1c1e',
  },
};

export function useThemeColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const systemTheme = useColorScheme() ?? 'light';
  const storedTheme = useThemeStore((state) => state.theme);
  
  const theme = storedTheme === 'system' ? systemTheme : storedTheme;
  return Colors[theme][colorName];
}

export function useActiveTheme() {
  const systemTheme = useColorScheme() ?? 'light';
  const storedTheme = useThemeStore((state) => state.theme);
  return storedTheme === 'system' ? systemTheme : storedTheme;
}
