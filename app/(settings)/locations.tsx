import { View, Text, StyleSheet } from 'react-native';
import { SettingsHeader } from '@/components/SettingsHeader';

export default function LocationsScreen() {
  return (
    <View style={styles.container}>
      <SettingsHeader title="Locations" />
      <View style={styles.content}>
        <Text>Locations settings content</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
});
