import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const AdvancedDashboardModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const handleAdd = () => {
    console.log("Kalorien:", calories);
    console.log("Protein:", protein);
    console.log("Kohlenhydrate:", carbs);
    console.log("Fette:", fats);
    setModalVisible(false); // Close modal after adding
  };

  return (
    <View style={{flex: 1,}}>
      {/* Button to Open Modal */}
    
      <TouchableOpacity 
            style={styles.buttonTriggerModal}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Kalorien Eingabe */}
            <Text style={styles.label}>Kalorien eintragen</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Kalorien"
              placeholderTextColor="#888"
              value={calories}
              onChangeText={setCalories}
            />

            {/* Protein Eingabe */}
            <Text style={styles.label}>Protein in Gramm</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Protein"
              placeholderTextColor="#888"
              value={protein}
              onChangeText={setProtein}
            />

            {/* Kohlenhydrate Eingabe */}
            <Text style={styles.label}>Kohlenhydrate in Gramm</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Kohlenhydrate"
              placeholderTextColor="#888"
              value={carbs}
              onChangeText={setCarbs}
            />

            {/* Fette Eingabe */}
            <Text style={styles.label}>Fette in Gramm</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Fette"
              placeholderTextColor="#888"
              value={fats}
              onChangeText={setFats}
            />

            {/* Button-Leiste */}
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Abbrechen</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.addButton]} onPress={handleAdd}>
                <Text style={styles.buttonText}>hinzufügen</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  openButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#3e3e3e',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 18,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    
  },
  buttonTriggerModal: {
    backgroundColor: '#141414',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1E1E1E",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },

  buttonText: {
    color: '#999999',
    fontSize: 24,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
  },
  addButton: {
    backgroundColor: '#4d79ff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedDashboardModal;
