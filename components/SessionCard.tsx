import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

export type Session = {
  id: string;
  date: string;
  location: string;
  buyIn: number;
  cashOut: number;
  duration: string;
  gameType: string;
  notes?: string;
};

type SessionCardProps = {
  session: Session;
  onPress: (session: Session) => void;
};

export function SessionCard({ session, onPress }: SessionCardProps) {
  const tintColor = useThemeColor('tint');
  const profit = session.cashOut - session.buyIn;
  const isProfit = profit >= 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(session)}>
      <View style={styles.header}>
        <Text style={styles.date}>{session.date}</Text>
        <Text style={styles.location}>{session.location}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameType}>{session.gameType}</Text>
          <Text style={styles.duration}>{session.duration}</Text>
        </View>
        <View style={styles.profitContainer}>
          <Text
            style={[
              styles.profit,
              { color: isProfit ? '#34C759' : '#FF3B30' },
            ]}>
            {isProfit ? '+' : '-'}${Math.abs(profit)}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Buy-in</Text>
          <Text style={styles.statValue}>${session.buyIn}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Cash-out</Text>
          <Text style={styles.statValue}>${session.cashOut}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameInfo: {},
  gameType: {
    fontSize: 14,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  profitContainer: {
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 8,
  },
  profit: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  stat: {},
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});