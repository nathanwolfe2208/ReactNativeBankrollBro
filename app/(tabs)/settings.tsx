import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeStore } from '@/state/theme';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
};

function SettingItem({ icon, label, value, onPress }: SettingItemProps) {
  const backgroundColor = useThemeColor('surface');
  const textColor = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const borderColor = useThemeColor('border');

  return (
    <Pressable 
      style={[
        styles.settingItem, 
        { 
          backgroundColor,
          borderBottomColor: borderColor,
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={textSecondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: textColor }]}>{label}</Text>
        {value && <Text style={[styles.settingValue, { color: textSecondary }]}>{value}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={textSecondary} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      if (Platform.OS === 'ios') {
        Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              console.log('User  confirmed logout');
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error('Logout error:', error.message);
                Alert.alert('Error', error.message);
              } else {
                console.log('User  logged out successfully');
                // Optionally navigate to login screen here if not using auth state listener
                // router.replace('/login'); // Uncomment if needed
              }
            },
          },
        ]);
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error.message);
          Alert.alert('Error', error.message);
        } else {
          console.log('User  logged out successfully');
          // Optionally navigate to login screen here if not using auth state listener
          // router.replace('/login'); // Uncomment if needed
        }
      }
    } catch (error: any) {
      console.error('Error during logout:', error.message);
      Alert.alert('Error', error.message || 'Failed to log out');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: useThemeColor('background') }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: useThemeColor('text') }]}>Game Settings</Text>
        <SettingItem
          icon="cash-outline"
          label="Default Buy-in"
          value="$1,000"
          onPress={() => router.push('/(settings)/default-buyin')}
        />
        <SettingItem
          icon="game-controller-outline"
          label="Game Types"
          onPress={() => router.push('/(settings)/game-types')}
        />
        <SettingItem
          icon="location-outline"
          label="Locations"
          onPress={() => router.push('/(settings)/locations')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: useThemeColor('text') }]}>App Settings</Text>
        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => {}}
        />
        <SettingItem
          icon="color-palette-outline"
          label="Theme"
          value={useThemeStore((state) => state.theme)}
          onPress={() => router.push('/(settings)/theme')}
        />
        <SettingItem
          icon="cloud-upload-outline"
          label="Backup Data"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: useThemeColor('text') }]}>About</Text>
        <SettingItem
          icon="information-circle-outline"
          label="Version"
          value="1.0.0"
          onPress={() => {}}
        />
        <SettingItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: useThemeColor('text') }]}>Account</Text>
        <SettingItem
          icon="log-out-outline"
          label="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
});
