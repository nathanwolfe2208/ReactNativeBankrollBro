import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SessionCard, Session } from '../../components/SessionCard';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AddSessionSheet } from '../../components/AddSessionSheet';
import { supabase } from '../../lib/supabase';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function SessionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const tintColor = useThemeColor('tint');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSessionVisible, setIsAddSessionVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedSessions: Session[] = data.map(session => ({
          id: session.id,
          date: session.date,
          location: session.location,
          buyIn: session.buy_in,
          cashOut: session.cash_out,
          duration: session.duration,
          gameType: session.game_type,
        }));
        setSessions(formattedSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionPress = (session: Session) => {
    // Navigate to session details (to be implemented)
    console.log('Session pressed:', session);
  };
  const handleRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  const handleAddSession = () => {
    setIsAddSessionVisible(true);
  };

  const handleCloseAddSession = () => {
    setIsAddSessionVisible(false);
  };

  const handleSessionAdded = () => {
    fetchSessions();
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={handleSessionPress}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No sessions yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first poker session to start tracking
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: tintColor }]}
        onPress={handleAddSession}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <AddSessionSheet
        isVisible={isAddSessionVisible}
        onClose={handleCloseAddSession}
        onSessionAdded={handleSessionAdded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 80, // Extra padding for FAB
    minHeight: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});