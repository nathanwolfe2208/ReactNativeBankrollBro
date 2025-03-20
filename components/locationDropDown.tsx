import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSessionsStore, { Location } from '@/state';


type LocationDropdownProps = {
  locations: Location[];
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  onAddLocation: (location: string) => void;
  tintColor: string;
};

export function LocationDropdown({
  locations,
  selectedLocation,
  onSelectLocation,
  onAddLocation,
  tintColor,
}: LocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [newLocationText, setNewLocationText] = useState('');
  const [loading, setLoading] = useState(false);
  const {Locs, fetchLocations, addLocation} = useSessionsStore();

  const fetchAndSetLocations = async () => {
    setLoading(true);
    await fetchLocations(); // Fetch sessions from Zustand store
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetLocations();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLocation = (location: string) => {
    onSelectLocation(location);
    setIsOpen(false);
  };

  const handleAddNewLocation = () => {
    if (newLocationText.trim() === '') {
      Alert.alert('Error', 'Location name cannot be empty');
      return;
    }
    
    onAddLocation(newLocationText);
    onSelectLocation(newLocationText);
    setNewLocationText('');
    setShowAddLocationModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity
            onPress={() => setShowAddLocationModal(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={20} color={tintColor} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.dropdown}
          onPress={toggleDropdown}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, !selectedLocation && styles.placeholderText]}>
            {selectedLocation || 'Select a location'}
          </Text>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
              {locations.length > 0 ? (
                locations.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => selectLocation(loc.name)}
                  >
                    <Text style={styles.dropdownItemText}>{loc.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyListText}>No locations found</Text>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Add new location modal */}
      <Modal
        visible={showAddLocationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowAddLocationModal(false)}
          activeOpacity={1}
        >
          <View style={styles.addLocationModal}>
            <Text style={styles.addLocationTitle}>Add New Location</Text>
            <TextInput
              style={styles.input}
              value={newLocationText}
              onChangeText={setNewLocationText}
              placeholder="Enter location name"
              autoFocus
            />
            <View style={styles.addLocationButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddLocationModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: tintColor }]}
                onPress={handleAddNewLocation}
              >
                <Text style={styles.addLocationButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#666',
  },
  addButton: {
    padding: 2,
  },
  dropdown: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyListText: {
    padding: 12,
    textAlign: 'center',
    color: '#666',
  },
  // Add location modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addLocationModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  addLocationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addLocationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  addLocationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});