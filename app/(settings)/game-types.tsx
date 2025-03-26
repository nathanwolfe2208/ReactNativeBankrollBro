import { View, Text, StyleSheet } from 'react-native';
import { SettingsHeader } from '@/components/SettingsHeader';

export default function GameTypesScreen() {
  return (
    <View style={styles.container}>
      <SettingsHeader title="Game Types" />
      <View style={styles.content}>
        <Text>Game types settings content</Text>
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
