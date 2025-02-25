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

export default function DashboardScreen() {
  const tintColor = useThemeColor('tint');
  const screenWidth = Dimensions.get('window').width;

  const chartData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 1500 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 2100 },
    { name: 'Jun', value: 3000 },
  ];

  const nativeChartData = {
    labels: chartData.map(d => d.name),
    datasets: [
      {
        data: chartData.map(d => d.value),
      },
    ],
  };

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
                <CartesianGrid strokeDasharray="3 3" />
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
        <View style={styles.statCard}>
          <Text style={styles.statValue}>32</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>68%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4.2h</Text>
          <Text style={styles.statLabel}>Avg Session</Text>
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
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});