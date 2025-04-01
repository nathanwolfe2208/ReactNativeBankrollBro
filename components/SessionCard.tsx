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
  const profit = session.cashOut - session.buyIn;
  const isProfit = profit >= 0;

  const backgroundColor = useThemeColor('surface');
  const textColor = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const dividerColor = useThemeColor('divider');
  const shadowColor = useThemeColor('shadow');
  const successColor = useThemeColor('success');
  const errorColor = useThemeColor('error');

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor,
          shadowColor,
        },
      ]}
      onPress={() => onPress(session)}
    >
      <View style={styles.header}>
        <Text style={[styles.date, { color: textColor }]}>{session.date}</Text>
        <Text style={[styles.location, { color: textSecondary }]}>{session.location}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.gameInfo}>
          <Text style={[styles.gameType, { color: textColor }]}>{session.gameType}</Text>
          <Text style={[styles.duration, { color: textSecondary }]}>{session.duration}</Text>
        </View>
        <View
          style={[
            styles.profitContainer,
            { backgroundColor: useThemeColor('surfaceSecondary') },
          ]}
        >
          <Text
            style={[
              styles.profit,
              { color: isProfit ? successColor : errorColor },
            ]}
          >
            {isProfit ? '+' : '-'}${Math.abs(profit)}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: dividerColor }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            Buy-in
          </Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            ${session.buyIn}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: textSecondary }]}>
            Cash-out
          </Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            ${session.cashOut}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
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
    marginTop: 4,
  },
  profitContainer: {
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
    paddingTop: 12,
  },
  stat: {},
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
