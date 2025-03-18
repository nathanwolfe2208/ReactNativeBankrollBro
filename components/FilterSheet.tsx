import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

type FilterSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  onFilterApplied: (filters: any) => void;
};

export type Filters = {
    location: string;
    gameType: string;
    dateRange: Date | string | null ;
}

export function FilterSheet({ isVisible, onClose, onFilterApplied }: FilterSheetProps) {
  const tintColor = useThemeColor('tint');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  
  const [filters, setFilters] = useState<Filters>({
    location: '',
    gameType: '',
    dateRange: 'All',
  });

  const snapPoints = ['50%'];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        bottomSheetRef.current?.expand();
      } else {
        bottomSheetRef.current?.close();
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [isVisible]);

  const getDateFromRange = (range: string) => {
    const currentDate = new Date();
    switch (range) {
      case '1 month':
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case '3 months':
        currentDate.setMonth(currentDate.getMonth() - 3);
        break;
      case '6 months':
        currentDate.setMonth(currentDate.getMonth() - 6);
        break;
      case '1 year':
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      case 'All':
        return null; // or a specific date if needed
      default:
        return null;
    }
    return currentDate;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'dateRange') {
      const dateObject = getDateFromRange(value);
      setFilters((prev) => ({ ...prev, [field]: dateObject }));
      setSelectedDateRange(value);
    } else {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleApplyFilters = () => {
    onFilterApplied(filters);
    onClose();
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      handleIndicatorStyle={{ backgroundColor: '#999' }}
      backgroundStyle={{ backgroundColor: '#fff' }}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={Platform.OS !== 'web'}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Sessions</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={filters.location}
            onChangeText={(value) => handleChange('location', value)}
            placeholder="e.g., Bellagio"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Game Type</Text>
          <TextInput
            style={styles.input}
            value={filters.gameType}
            onChangeText={(value) => handleChange('gameType', value)}
            placeholder="e.g., NL Hold'em 2/5"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date Range</Text>
          <View style={styles.dateRangeContainer}>
            {['1 month', '3 months', '6 months', '1 year', 'All'].map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.dateRangeButton,
                  selectedDateRange === range && styles.selectedDateRangeButton,
                ]}
                onPress={() => handleChange('dateRange', range)}
              >
                <Text
                  style={[
                    styles.dateRangeButtonText,
                    selectedDateRange === range && styles.selectedDateRangeButtonText,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: tintColor }]}
          onPress={handleApplyFilters}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Apply Filters</Text>
          )}
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#666',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateRangeButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedDateRangeButton: {
    backgroundColor: '#e1e1e1',
  },
  dateRangeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateRangeButtonText: {
    fontWeight: '600',
    color: '#665df5',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
