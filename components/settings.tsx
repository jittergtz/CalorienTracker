// SettingsModal.js
import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsModal = ({ selectedTab, onTabSelect }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {/* Settings Icon Button */}
      <Pressable onPress={() => setModalVisible(true)}>
        <Ionicons name="settings" size={24} color="#464646" />
      </Pressable>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Header with close button */}
            <View style={styles.modalHeader}>
              <Text style={styles.headerText}>Wie möchtest du tracken?</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
            </View>

          

            {/* Tabs Component */}
            <View style={styles.tabContainer}>
              <Pressable
                style={[
                  styles.tab,
                  selectedTab === 'Einfach' && styles.selectedTab,
                ]}
                onPress={() => {
                  onTabSelect('Einfach');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'Einfach' && styles.selectedTabText,
                  ]}
                >
                  Einfach
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.tab,
                  selectedTab === 'Detaliert' && styles.selectedTab,
                ]}
                onPress={() => {
                  onTabSelect('Detaliert');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'Detaliert' && styles.selectedTabText,
                  ]}
                >
                  Detaliert
                </Text>
              </Pressable>
            </View>
         
         
              {/* Change Calories Button */}

              { selectedTab === 'Einfach' ? (
                   <View style={{gap:10, marginTop:15 , flexDirection: "column", padding: 8, borderRadius: 10, backgroundColor: "#303030",
                    justifyContent: "start", width:"100%",}}>
                 <Text style={{color:"#C0C0C0", fontWeight: "bold",fontSize:16}}>Kalorien Ziel</Text>
                 <Pressable style={styles.changeButton}>
                 <Text style={styles.buttonText}>Anpassen</Text>
               </Pressable>
             </View>
              ):(
                <>
              <View style={{gap:10, marginTop:15 , flexDirection: "column", padding: 8, borderRadius: 10, backgroundColor: "#303030",
                 justifyContent: "start", width:"100%",}}>
              <Text style={{color:"#C0C0C0", fontWeight: "bold",fontSize:16}}>Kalorien Ziel</Text>
              <Pressable style={styles.changeButton}>
              <Text style={styles.buttonText}>Anpassen</Text>
            </Pressable>
          </View>

          <View style={{gap:10, marginTop:10 , flexDirection: "column", padding: 8, borderRadius: 10, backgroundColor: "#303030",
                 justifyContent: "start", width:"100%",}}>
              <Text style={{color:"#C0C0C0", fontWeight: "bold",fontSize:16}}>Proteine Ziel in Gramm</Text>
              <Pressable style={styles.changeButton}>
              <Text style={styles.buttonText}>Anpassen</Text>
            </Pressable>
          </View>
          <View style={{gap:10, marginTop:10 , flexDirection: "column", padding: 8, borderRadius: 10, backgroundColor: "#303030",
                 justifyContent: "start", width:"100%",}}>
              <Text style={{color:"#C0C0C0", fontWeight: "bold",fontSize:16}}>Kohlenhydrate Ziel in Gramm</Text>
              <Pressable style={styles.changeButton}>
              <Text style={styles.buttonText}>Anpassen</Text>
            </Pressable>
          </View>
          <View style={{gap:10, marginTop:10 , flexDirection: "column", padding: 8, borderRadius: 10, backgroundColor: "#303030",
                 justifyContent: "start", width:"100%",}}>
              <Text style={{color:"#C0C0C0", fontWeight: "bold",fontSize:16}}>Fette Ziel in Gramm</Text>
              <Pressable style={styles.changeButton}>
              <Text style={styles.buttonText}>Anpassen</Text>
            </Pressable>
          </View>
          </>
          )}
          
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#B4B4B4',
    fontSize: 20,
    fontWeight: 'bold',
  },
  changeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2e',
    borderRadius: 15,
    padding: 4,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  selectedTab: {
    backgroundColor: '#3a3a3c',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedTabText: {
    color: 'white',
  },
});

export default SettingsModal;