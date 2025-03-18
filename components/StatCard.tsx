import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

type StatCardProps = {
    label: string;
    value: string;
};

export function StateCard({label, value}: StatCardProps ) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
    )
}

const styles = StyleSheet.create({
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
        shadowRadius: 4,
        elevation: 5,
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