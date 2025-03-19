import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SessionCard, Session } from '../../components/SessionCard';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AddSessionSheet } from '@/components/AddSessionSheet';
import { FilterSheet } from '@/components/FilterSheet';
import useSessionsStore from '@/state'; // Import Zustand store
import { useThemeColor } from '../../hooks/useThemeColor';

export default function SessionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const tintColor = useThemeColor('tint');

  // Use Zustand store
  const { sessions, fetchSessions, addSession } = useSessionsStore();
  
  const [loading, setLoading] = useState(true);
  const [isAddSessionVisible, setIsAddSessionVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  const fetchAndSetSessions = async () => {
    setLoading(true);
    await fetchSessions(); // Fetch sessions from Zustand store
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetSessions();
  }, []);

  const handleSessionPress = (session: Session) => {
    console.log('Session pressed:', session);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAndSetSessions();
    setRefreshing(false);
  };

  const handleAddSession = () => {
    setIsAddSessionVisible(true);
  };

  const handleCloseAddSession = () => {
    setIsAddSessionVisible(false);
  };

  const handleSessionAdded = async (newSession: Session) => {
    await addSession(newSession); // Pass the new session to the store
    fetchAndSetSessions(); // Optionally refresh the sessions
  };

  const handleCloseFilterSession = () => {
    setIsFilterSheetVisible(false);
  };

  const filterSessions = (filters: any) => {
    // Implement filtering logic here
    // You can access sessions from Zustand store
    console.log('Filtering sessions with:', filters);
  };

  return (
    <View style={styles.container}>
      {loading ? (
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
        style={[styles.configButton, { backgroundColor: '#666666' }]}
        onPress={handleCloseFilterSession}
      >
        <Ionicons name="options" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#666666' }]}
        onPress={handleAddSession}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <AddSessionSheet
        isVisible={isAddSessionVisible}
        onClose={handleCloseAddSession}
        //onSessionAdded={handleSessionAdded} // Pass the handler to AddSessionSheet
      />

      <FilterSheet
        isVisible={isFilterSheetVisible}
        onClose={handleCloseFilterSession}
        onFilterApplied={filterSessions}
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
    paddingBottom: 80,
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
  configButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
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