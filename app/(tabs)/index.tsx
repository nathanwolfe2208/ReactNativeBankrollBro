import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Dimensions } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { LineChart as NativeLineChart } from 'react-native-chart-kit';
import {
  LineChart as WebLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { Session } from '@/components/SessionCard';
import { useEffect, useState } from 'react';
import { StateCard } from '@/components/StatCard';

export default function DashboardScreen() {
  const tintColor = useThemeColor('tint');
  const screenWidth = Dimensions.get('window').width;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // const chartData = [
  //   { name: 'Jan', value: 1200 },
  //   { name: 'Feb', value: 1900 },
  //   { name: 'Mar', value: 1500 },
  //   { name: 'Apr', value: 2800 },
  //   { name: 'May', value: 2100 },
  //   { name: 'Jun', value: 3000 },
  // ];

  // const nativeChartData = {
  //   labels: chartData.map(d => d.name),
  //   datasets: [
  //     {
  //       data: chartData.map(d => d.value),
  //     },
  //   ],
  // };

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

    const chartData = sessions.map(session => ({
      name: session.date,
      value: session.cashOut - session.buyIn,
    }));
    
    const nativeChartData = {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          data: chartData.map(d => d.value),
          color: (opacity = 1) => tintColor, // optional
          strokeWidth: 2, // optional
        },
      ],
    };

    useEffect(() => {
      fetchSessions();
    }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bankroll Overview</Text>
        <Text style={styles.balance}>$3,000</Text>
        <Text style={styles.subtitle}>Total Profit</Text>
      </View>

      <View style={styles.chartContainer}>
        {Platform.OS === 'web' ? (
          <View style={{ height: 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <WebLineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={tintColor}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </WebLineChart>
            </ResponsiveContainer>
          </View>
        ) : (
          <NativeLineChart
            data={nativeChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => tintColor,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
      </View>

      <View style={styles.statsContainer}>
        <StateCard label="Total Sessions" value="32" />
        <StateCard label="Total Profit" value="$3,000" />
        <StateCard label="Avg. Profit" value="$94" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18, // Increased size for better visibility
    fontWeight: '500', // Lighter weight for a modern look
    color: '#333', // Darker color for contrast
    marginBottom: 8,
    letterSpacing: 0.5, // Added letter spacing
  },
  balance: {
    fontSize: 40, // Increased size for emphasis
    fontWeight: '700',
    marginBottom: 4,
    color: '#2c3e50', // Darker color for a modern touch
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d', // Softer color for a modern feel
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    borderRadius: 12, // Added border radius for a softer look
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  }
});