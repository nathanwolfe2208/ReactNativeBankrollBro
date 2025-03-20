import React, { useState, useRef, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import useSessionsStore from '@/state'; // Import Zustand store
import { LocationDropdown } from './locationDropDown'; // Import our new component

type AddSessionSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function AddSessionSheet({
  isVisible,
  onClose,
}: AddSessionSheetProps) {
  const tintColor = useThemeColor('tint');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);
  const { Locs, addLocation } = useSessionsStore(); // Get locations from Zustand store

  const [formData, setFormData] = useState({
    location: '',
    gameType: '',
    buyIn: '',
    cashOut: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const snapPoints = ['75%'];

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.location.trim() !== '' &&
      formData.gameType.trim() !== '' &&
      formData.buyIn.trim() !== '' &&
      formData.cashOut.trim() !== '' &&
      formData.duration.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Use Zustand's addSession function
      const newSession = {
        id: '0',
        location: formData.location,
        gameType: formData.gameType,
        buyIn: parseInt(formData.buyIn),
        cashOut: parseInt(formData.cashOut),
        duration: formData.duration,
        date: formData.date,
        notes: formData.notes,
      };

      // Call the addSession function from Zustand store
      await useSessionsStore.getState().addSession(newSession);

      // Reset form and close sheet
      setFormData({
        location: '',
        gameType: '',
        buyIn: '',
        cashOut: '',
        duration: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });

      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add session');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewLocation = (locationName: string) => {
    if (locationName.trim() === '') {
      return;
    }
    
    addLocation({id: '0', name: locationName});
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(formData.date);

    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      const isoDate = currentDate.toISOString().split('T')[0];
      handleChange('date', isoDate);
    }
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <>
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
            <Text style={styles.title}>Add New Session</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <TextInput
                style={styles.input}
                value={formData.date}
                placeholder="YYYY-MM-DD"
                editable={false}
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#666"
                style={styles.calendarIcon}
              />
            </TouchableOpacity>

            {Platform.OS === 'ios' && showDatePicker && (
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.iosDoneButton}
                  >
                    <Text
                      style={[styles.iosDoneButtonText, { color: tintColor }]}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={new Date(formData.date || Date.now())}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={onDateChange}
                  style={styles.iosPicker}
                />
              </View>
            )}

            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={new Date(formData.date || Date.now())}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Use our new LocationDropdown component */}
          <LocationDropdown
            locations={Locs}
            selectedLocation={formData.location}
            onSelectLocation={(location) => handleChange('location', location)}
            onAddLocation={handleAddNewLocation}
            tintColor={tintColor}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Game Type</Text>
            <TextInput
              style={styles.input}
              value={formData.gameType}
              onChangeText={(value) => handleChange('gameType', value)}
              placeholder="e.g., NL Hold'em 2/5"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Buy-in ($)</Text>
              <TextInput
                style={styles.input}
                value={formData.buyIn}
                onChangeText={(value) => handleChange('buyIn', value)}
                placeholder="1000"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Cash-out ($)</Text>
              <TextInput
                style={styles.input}
                value={formData.cashOut}
                onChangeText={(value) => handleChange('cashOut', value)}
                placeholder="1450"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(value) => handleChange('duration', value)}
              placeholder="e.g., 4h 30m"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleChange('notes', value)}
              placeholder="Any notes about this session..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: tintColor },
              !isFormValid() && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Session</Text>
            )}
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
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
  textArea: {
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerButton: {
    position: 'relative',
    width: '100%',
  },
  calendarIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  iosPickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    overflow: 'hidden',
    width: '100%',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#fff',
    width: '100%',
  },
  iosDoneButton: {
    padding: 4,
  },
  iosDoneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    backgroundColor: '#fff',
    width: '100%',
    height: 200,
  },
});