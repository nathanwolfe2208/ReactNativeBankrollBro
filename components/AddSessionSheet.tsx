import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useThemeColor } from '../hooks/useThemeColor';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Session } from './SessionCard';

type AddSessionSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  onSessionAdded: () => void;
};

export function AddSessionSheet({ isVisible, onClose, onSessionAdded }: AddSessionSheetProps) {
  const tintColor = useThemeColor('tint');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    gameType: '',
    buyIn: '',
    cashOut: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const snapPoints = ['75%'];

  useEffect(() => {
    // Use a timeout to avoid the findDOMNode warning
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
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('sessions').insert({
        user_id: userData.user.id,
        location: formData.location,
        game_type: formData.gameType,
        buy_in: parseInt(formData.buyIn),
        cash_out: parseInt(formData.cashOut),
        duration: formData.duration,
        date: formData.date,
        notes: formData.notes || '',
      });

      if (error) throw error;

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
      
      onSessionAdded();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add session');
    } finally {
      setLoading(false);

    }
  };

  // Custom backdrop component to avoid findDOMNode warnings
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
          <Text style={styles.title}>Add New Session</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(value) => handleChange('date', value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => handleChange('location', value)}
            placeholder="e.g., Bellagio"
          />
        </View>

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
});