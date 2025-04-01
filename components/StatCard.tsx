import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

type StatCardProps = {
  label: string;
  value: string;
};

export function StateCard({ label, value }: StatCardProps) {
  const backgroundColor = useThemeColor('surface');
  const textColor = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const shadowColor = useThemeColor('shadow');

  return (
    <View 
      style={[
        styles.statCard, 
        { 
          backgroundColor,
          shadowColor,
          ...Platform.select({
            ios: {
              shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
            web: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }
          })
        }
      ]}
    >
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28, // Increased size for emphasis
    fontWeight: '600',
    marginBottom: 4,
    color: '#34495e', // Darker color for contrast
  },
  statLabel: {
    fontSize: 12,
    color: '#95a5a6', // Softer color for a modern feel
  },
});
