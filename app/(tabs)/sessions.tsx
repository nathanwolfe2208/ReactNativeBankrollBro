import { View, StyleSheet, FlatList } from 'react-native';
import { SessionCard, Session } from '../../components/SessionCard';
import { useRouter } from 'expo-router';

const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    date: '2024-02-20',
    location: 'Bellagio',
    buyIn: 1000,
    cashOut: 1450,
    duration: '4h 30m',
    gameType: 'NL Hold\'em 2/5',
  },
  {
    id: '2',
    date: '2024-02-18',
    location: 'Aria',
    buyIn: 500,
    cashOut: 850,
    duration: '3h 15m',
    gameType: 'NL Hold\'em 1/3',
  },
  {
    id: '3',
    date: '2024-02-15',
    location: 'Wynn',
    buyIn: 1000,
    cashOut: 800,
    duration: '5h 45m',
    gameType: 'NL Hold\'em 2/5',
  },
];

export default function SessionsScreen() {
  const router = useRouter();

  const handleSessionPress = (session: Session) => {
    // Navigate to session details (to be implemented)
    console.log('Session pressed:', session);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_SESSIONS}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={handleSessionPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingVertical: 16,
  },
});