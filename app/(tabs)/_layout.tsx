import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Platform, View, Text, StyleSheet } from 'react-native';
export default function TabLayout() {
  //const tintColor = useThemeColor('tint');

  return (
    
    <View style={{ flex: 1 }}>
      {/* Persistent Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BB</Text>
      </View>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#cccccc',
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
            tabBarIcon: ({ color, focused }) => (
              <View style={{ marginBottom: Platform.OS === 'ios' ? -10 : 0 }}>
                <Ionicons name="stats-chart" size={28} color={color} style={{ transform: focused ? [{ scale: 1.2 }] : [{ scale: 1 }] }} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="sessions"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ marginBottom: Platform.OS === 'ios' ? -10 : 0 }}>
                <Ionicons name="calendar" size={28} color={color} style={{ transform: focused ? [{ scale: 1.2 }] : [{ scale: 1 }] }} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ marginBottom: Platform.OS === 'ios' ? -10 : 0 }}>
                <Ionicons name="settings" size={28} color={color} style={{ transform: focused ? [{ scale: 1.2 }] : [{ scale: 1 }] }} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa', // Change this to your desired header color
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Change this to your desired text color
  },
});