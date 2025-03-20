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
import useSessionsStore, { gameType } from '@/state';

type StakeDropdownProps = {
  stakes: gameType[];
  selectedStake: string;
  onSelectStake: (gameType: string) => void;
  onAddStake: (stake: gameType) => void;
  tintColor: string;
};

export function StakeDropdown({
  stakes,
  selectedStake,
  onSelectStake,
  onAddStake,
  tintColor,
}: StakeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddStakeModal, setShowAddStakeModal] = useState(false);
  const [newStake, setNewStake] = useState({
    sb: '',
    bb: '',
    str: '',
  });
  const [loading, setLoading] = useState(false);
  const {gTypes, addGameType, fetchGameTypes} = useSessionsStore();

  const fetchandSetGameTypes = async () => {
      setLoading(true);
      await fetchGameTypes(); // Fetch sessions from Zustand store
      setLoading(false);
    };
  
    useEffect(() => {
      fetchandSetGameTypes();
    }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const formatStake = (stake: gameType): string => {
    return stake.str ? `${stake.sb}/${stake.bb}/${stake.str}` : `${stake.sb}/${stake.bb}`;
  };

  const selectStake = (stake: gameType) => {
    onSelectStake(formatStake(stake));
    setIsOpen(false);
  };

  const handleAddNewStake = () => {
    if (newStake.sb.trim() === '' || newStake.bb.trim() === '') {
      Alert.alert('Error', 'Small blind and big blind are required');
      return;
    }
    
    const stake: gameType = {
        id: '0',
      sb: parseFloat(newStake.sb),
      bb: parseFloat(newStake.bb),
    };
    
    if (newStake.str.trim() !== '') {
      stake.str = parseFloat(newStake.str);
    }
    
    onAddStake(stake);
    onSelectStake(formatStake(stake));
    setNewStake({ sb: '', bb: '', str: '' });
    setShowAddStakeModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <View style={[styles.container, { marginBottom: isOpen ? 150 : 16 }]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Game Stakes</Text>
          <TouchableOpacity
            onPress={() => setShowAddStakeModal(true)}
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
          <Text style={[styles.dropdownText, !selectedStake && styles.placeholderText]}>
            {selectedStake || 'Select stakes'}
          </Text>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
              {stakes.length > 0 ? (
                stakes.map((stake, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => selectStake(stake)}
                  >
                    <Text style={styles.dropdownItemText}>
                      {formatStake(stake)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyListText}>No stakes found</Text>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Add new stake modal */}
      <Modal
        visible={showAddStakeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddStakeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => {}}
          activeOpacity={1}
        >
          <View style={styles.addStakeModal}>
            <Text style={styles.addStakeTitle}>Add New Stakes</Text>
            
            <View style={styles.stakeInputRow}>
              <View style={styles.stakeInputItem}>
                <Text style={styles.stakeInputLabel}>Small Blind</Text>
                <TextInput
                  style={styles.input}
                  value={newStake.sb}
                  onChangeText={(text) => setNewStake(prev => ({ ...prev, sb: text }))}
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.stakeInputItem}>
                <Text style={styles.stakeInputLabel}>Big Blind</Text>
                <TextInput
                  style={styles.input}
                  value={newStake.bb}
                  onChangeText={(text) => setNewStake(prev => ({ ...prev, bb: text }))}
                  placeholder="2"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.stakeInputRow}>
              <View style={styles.stakeInputItem}>
                <Text style={styles.stakeInputLabel}>Straddle (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={newStake.str}
                  onChangeText={(text) => setNewStake(prev => ({ ...prev, str: text }))}
                  placeholder="4"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.addStakeButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddStakeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: tintColor }]}
                onPress={handleAddNewStake}
              >
                <Text style={styles.addStakeButtonText}>Add</Text>
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
  // Add stake modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStakeModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  addStakeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  stakeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stakeInputItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  stakeInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
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
  addStakeButtonsContainer: {
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
  addStakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});