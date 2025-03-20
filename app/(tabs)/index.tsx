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
import useSessionsStore from '@/state'; // Import Zustand store
import { useEffect } from 'react';
import { StateCard } from '@/components/StatCard';

export default function DashboardScreen() {
  const tintColor = useThemeColor('tint');
  const screenWidth = Dimensions.get('window').width;

  // Use Zustand store
  const { sessions, fetchSessions } = useSessionsStore();

  const chartData = sessions.map((session) => ({
    name: session.date,
    value: session.cashOut - session.buyIn,
  }));

  const nativeChartData = {
    labels: chartData.map((d) => d.name),
    datasets: [
      {
        data: chartData.map((d) => d.value),
        color: (opacity = 1) => tintColor, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  const totalBR = sessions.reduce((acc, session) => {
    return acc + (session.cashOut - session.buyIn);
  }, 0);
  const avgProfit = totalBR / sessions.length;

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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
              <WebLineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
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
        <View style={styles.statsRow}>
          <StateCard label="Total Sessions" value={sessions.length.toString()} />
          <StateCard label="Total Profit" value={totalBR.toString()} />
        </View>
        <View style={styles.statsRow}>
          <StateCard
            label="Avg. Profit"
            value={avgProfit.toFixed(1).toString()}
          />
          <StateCard 
            label="Win Rate" 
            value="50%" />
        </View>
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
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 4,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
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
    flexDirection: 'column',
    //justifyContent: 'space-between',
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  }
});
