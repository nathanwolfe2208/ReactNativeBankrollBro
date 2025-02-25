import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  const tintColor = useThemeColor('tint');
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
          },
          default: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            height: 65,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: Platform.OS === 'ios' ? -10 : 0 }}>
              <Ionicons name="stats-chart" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: Platform.OS === 'ios' ? -10 : 0 }}>
              <Ionicons name="calendar" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: Platform.OS === 'ios' ? -10 : 0 }}>
              <Ionicons name="settings-outline" size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}