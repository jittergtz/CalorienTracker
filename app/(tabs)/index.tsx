// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function HomeScreen() {
  const [db, setDb] = useState(null);
  const [calories, setCalories] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('2250'); // Set a default value
  const [totalCalories, setTotalCalories] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [inputCalories, setInputCalories] = useState('');
  const [isIncrease, setIsIncrease] = useState(true);
  const [calorieWarning, setCalorieWarning] = useState('');

  useEffect(() => {
    async function initializeDatabase() {
      const database = await SQLite.openDatabaseAsync('calorieTracker.db');
      setDb(database);
      await createTable(database);
      await fetchTodayData(database);
    }
    initializeDatabase();
  }, []);

  const createTable = async (dbInstance) => {
    try {
      await dbInstance.execAsync(
        `CREATE TABLE IF NOT EXISTS calorie_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          calories INTEGER DEFAULT 0,
          calorie_goal INTEGER DEFAULT 2250,
          date TEXT UNIQUE,
          streak INTEGER DEFAULT 0
        );`
      );
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const fetchTodayData = async (dbInstance) => {
    try {
      // First, try to get today's data
      const result = await dbInstance.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [currentDate]
      );

      if (result.length > 0) {
        // Today's data exists
        const todayData = result[0];
        setTotalCalories(todayData.calories || 0);
        setCalorieGoal(todayData.calorie_goal.toString());
        setStreak(todayData.streak || 0);
      } else {
        // If no data for today, get the most recent calorie goal
        const lastGoalResult = await dbInstance.getAllAsync(
          'SELECT calorie_goal FROM calorie_data ORDER BY date DESC LIMIT 1'
        );

        const defaultGoal = lastGoalResult.length > 0 ? lastGoalResult[0].calorie_goal : 2250;
        
        // Create today's entry with the last known goal
        await dbInstance.runAsync(
          'INSERT INTO calorie_data (calories, calorie_goal, date, streak) VALUES (?, ?, ?, ?)',
          [0, defaultGoal, currentDate, streak]
        );
        
        setCalorieGoal(defaultGoal.toString());
        setTotalCalories(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const checkStreak = async (dbInstance) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const result = await dbInstance.getAllAsync(
        'SELECT streak FROM calorie_data WHERE date = ?',
        [yesterdayStr]
      );

      if (result.length > 0) {
        setStreak(result[0].streak);
      }
    } catch (error) {
      console.error('Error checking streak:', error);
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 75) return '#C17011';
    if (streak >= 50) return '#CAAD77';
    if (streak >= 35) return '#836B47';
    if (streak >= 30) return '#AB6532';
    if (streak >= 25) return '#776440';
    if (streak >= 20) return '#886352';
    if (streak >= 10) return '#7D7D7D';
    if (streak >= 3) return '#7D7D7D';
    return '#7D7D7D';
  };

  const getStreakBg = (streak) => {
    if (streak >= 75) return '#1B0B0B';
    if (streak >= 60) return '#0B1D21';
    if (streak >= 50) return '#241212';
    if (streak >= 45) return '#241E12';
    if (streak >= 40) return '#1B281C';
    if (streak >= 35) return '#0F242B';
    if (streak >= 30) return '#1C0303';
    if (streak >= 25) return '#3F340C';
    if (streak >= 23) return '#112529';
    if (streak >= 20) return '#112529';
    if (streak >= 10) return '#011D31';
    if (streak >= 3) return '#021323';
    return '#141414';
  };

  const getStreakImage = (streak: number) => {
    if (streak >= 100) return require('@/assets/images/pres10a.png');
    if (streak >= 75) return require('@/assets/images/pres10.png');
    if (streak >= 60) return require('@/assets/images/pres9.png');
    if (streak >= 50) return require('@/assets/images/pres8.png');
    if (streak >= 45) return require('@/assets/images/pres7.png');
    if (streak >= 40) return require('@/assets/images/pres6.png');
    if (streak >= 35) return require('@/assets/images/pres5.png');
    if (streak >= 30) return require('@/assets/images/nuke.png');
    if (streak >= 20) return require('@/assets/images/pres4.png');
    if (streak >= 10) return require('@/assets/images/pres3.png');
    if (streak >= 3) return require('@/assets/images/pres2.png');
    return require('@/assets/images/pres1.png');
  };

  const openModal = (increase) => {
    setIsIncrease(increase);
    setModalVisible(true);
  };

  const handleSetGoal = async () => {
    if (!calorieGoal) {
      Alert.alert('Error', 'Please enter a calorie goal.');
      return;
    }

    try {
      const goal = parseInt(calorieGoal);
      
      // Update or insert the calorie goal for today's entry
      const result = await db.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [currentDate]
      );

      if (result.length > 0) {
        // Update existing entry
        await db.runAsync(
          'UPDATE calorie_data SET calorie_goal = ? WHERE date = ?',
          [goal, currentDate]
        );
      } else {
        // Insert new entry
        await db.runAsync(
          'INSERT INTO calorie_data (calories, calorie_goal, date, streak) VALUES (?, ?, ?, ?)',
          [0, goal, currentDate, streak]
        );
      }

      setCalorieGoal(goal.toString());
      setGoalModalVisible(false);
      console.log('Calorie goal set successfully');
      
      // Verify the goal was set by re-fetching the data
      await fetchTodayData(db);
    } catch (error) {
      console.error('Error setting calorie goal:', error);
      Alert.alert('Error', 'Failed to set calorie goal. Please try again.');
    }
  };

  const handleModalCalories = async () => {
    // Check if inputCalories exists and is a valid number
    if (!inputCalories || isNaN(parseInt(inputCalories))) {
      setCalorieWarning('Please enter a valid number.');
      setTimeout(() => setCalorieWarning(''), 2500); // Hide warning after 2.5 seconds
      setInputCalories(''); // Clear input field
      return;
    }
  
    const currentCalories = parseInt(inputCalories);
    const newTotal = isIncrease ? totalCalories + currentCalories : Math.max(0, totalCalories - currentCalories);
  
    // Check if newTotal exceeds calorie goal
    if (newTotal > parseInt(calorieGoal)) {
      setCalorieWarning(`Du überschreitest dein kalorienziel`); // Set warning message
      setInputCalories(''); // Clear input field
  
      // Set a timeout to clear the warning after 2.5 seconds
      setTimeout(() => setCalorieWarning(''), 5500);
      return; // Exit function
    }
  
    // Clear any existing warning if within the goal
    setCalorieWarning('');
    
    let newStreak = streak;
  
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [currentDate]
      );
  
      if (newTotal >= parseInt(calorieGoal)) {
        newStreak += 1; // Increase streak if goal is met
      } else if (result.length > 0 && newTotal < parseInt(calorieGoal)) {
        newStreak = 0; // Reset streak if goal not met
      }
  
      if (result.length > 0) {
        await db.runAsync(
          'UPDATE calorie_data SET calories = ?, streak = ? WHERE date = ?',
          [newTotal, newStreak, currentDate]
        );
      } else {
        await db.runAsync(
          'INSERT INTO calorie_data (calories, calorie_goal, date, streak) VALUES (?, ?, ?, ?)',
          [newTotal, calorieGoal, currentDate, newStreak]
        );
      }
  
      setTotalCalories(newTotal);
      setStreak(newStreak);
      setInputCalories('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating calories:', error);
    }
  };
  
  
  
  

  const progressPercentage = Math.min((totalCalories / parseInt(calorieGoal)) * 100, 100);



  const getNextStreakMilestone = (currentStreak) => {
    if (currentStreak < 3) return 10;
    if (currentStreak < 10) return 10;
    if (currentStreak < 20) return 20;
    if (currentStreak < 30) return 30;
    if (currentStreak < 35) return 35;
    if (currentStreak < 40) return 40;
    if (currentStreak < 45) return 45;
    if (currentStreak < 50) return 50;
    if (currentStreak < 60) return 60;
    if (currentStreak < 75) return 75;
    if (currentStreak < 100) return 100;
    return currentStreak; // If already at or above 100
  };

  const PrestigePercentage = Math.min((streak / parseInt(getNextStreakMilestone(streak))) * 100, 100);


  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
      <View style={styles.topButtonContainer}>
  <TouchableOpacity 
    style={styles.goalButton}
    onPress={() => setGoalModalVisible(true)}
  >
    <Text style={styles.goalButtonText}>Ziel kalorien</Text>
  </TouchableOpacity>
</View>




  <View style={styles.streakBarContainer}>
          <Image 
              source={getStreakImage(streak)}
              style={styles.streakImageBar}
              resizeMode="contain"
            />
        <View  style={styles.streakLevelContainer}>
          <View style={styles.streakLevelBar}>
          <View 
            style={[
              styles.progressBarPrestige, 
              { width: `${PrestigePercentage}%` }
            ]} 
          />
          </View>
         
          <View style={styles.streakLevelTextContainer}>
            <View style={styles.leveltext}><Text style={styles.streakBarText}>
              Streak: {streak}</Text>
              </View>
            <View style={styles.leveltext}><Text style={styles.streakBarText} >
               Ziel: {getNextStreakMilestone(streak)}</Text></View>
          </View>

        </View>
        <Image 
              source={getStreakImage(getNextStreakMilestone(streak))}
              style={styles.streakImageBar}
              resizeMode="contain"
            />
  </View>
        <Text style={styles.calorieText}>
          {totalCalories} / {calorieGoal} kcal
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>

        {/* Add/Subtract Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => openModal(false)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => openModal(true)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Display */}
        <View style={styles.streakWrapper}>
          <View style={[
            styles.streakContainer, 
            { backgroundColor: getStreakBg(streak) }
          ]}>
             <Image 
              source={getStreakImage(streak)}
              style={styles.streakImage}
              resizeMode="contain"
            />
            <Text style={styles.streakText}>Streak</Text>
            <View style={styles.streakNumberContainer}>
              <Text style={[
                { color: getStreakColor(streak) },
                styles.streakNumber
              ]}>
                {streak}
              </Text>
            </View>
          </View>
        </View>

        {/* Calorie Input Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Kalorien {isIncrease ? 'hinzufügen' : 'abziehen'}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={inputCalories}
                onChangeText={setInputCalories}
                placeholder="Kalorien eingeben"
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonTextModal}>Abbrechen</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleModalCalories}
                >
                  <Text style={styles.buttonTextModal}>
                    {isIncrease ? 'Hinzufügen' : 'Abziehen'}
                  </Text>
                </TouchableOpacity>
             
              </View>
            </View>
            {calorieWarning ? (
        <Text style={styles.warningText}>{calorieWarning}</Text>
      ) : null}
          </View>
        </Modal>

        {/* Goal Setting Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={goalModalVisible}
          onRequestClose={() => setGoalModalVisible(false)}
        >
          
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Ziel Kalorien setzen</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={calorieGoal.toString()}
                onChangeText={value => setCalorieGoal(value)}
                placeholder="Ziel Kalorien eingeben"
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setGoalModalVisible(false)}
                >
                  <Text style={styles.buttonTextModal}>Abbrechen</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleSetGoal}
                >
                  <Text style={styles.buttonTextModal}>Hinzufügen</Text>
                </TouchableOpacity>
               
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    padding: 10,
    borderRadius: 10,
    marginTop: 50,
  },
  calorieText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: "#7D7D7D",
  },
  
  progressBarContainer: {
    height: 50,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#9570FF',
    borderRadius: 30,
  },

  progressBarPrestige: {
    height: '100%',
    backgroundColor: '#B07D31',
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    
  },
  button: {
    backgroundColor: '#141414',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#1E1E1E",
    paddingHorizontal: 80,
    borderRadius: 16,
  },
  buttonText: {
    color: '#999999',
    fontSize: 24,
  },
  buttonTextModal: {
    color: '#fff',
    fontSize: 17,
    textAlign: "center",
  },
  streakWrapper: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  streakContainer: {
    alignItems: 'center',
    width: 170,
    height: 200,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
  },
  streakText: {
    marginTop: 5,
    fontSize: 20,
    color: "#7D7D7D",
  },
  streakNumber: {
    fontSize: 33,
    fontWeight: 'bold',
  },
  streakNumberContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 64,
    marginTop: 'auto',
  },
  streakImage: {
    height: 90,
    
  },

  warningText: {
    fontSize: 16,
    color: "red",
    position: "absolute",
    zIndex: 999,
    top: 350,
    left: "25%",
  },

  

  streakBarContainer : {      
    width: "full",
    height: 70,
    borderRadius: 20,
    marginBottom: 15,
    borderColor: "#313131",
    borderWidth: 1,
    backgroundColor: "#141414",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 3,
   
  },

  leveltext: {
    color: "white",
    width: 90,
    borderRadius: 5, 
    backgroundColor: "#1F1E1E",
    padding: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
   

    streakLevelTextContainer: {
      display: "flex",
      width: "full",
      justifyContent: "space-between",
      flexDirection: 'row',
      gap: 10,
      height: 30,
    },


  streakLevelContainer: {
     display: "flex",
     width: 260,
     height: "full",
     padding:10,
     gap: 4,

  },

  streakLevelBar: {
    backgroundColor: "#252525",
    borderRadius: 20,
    width: "full",
    height: 20,
  },

  streakImageBar: {
    height: 52,
    width: 52,
  }, 


  streakBarText: {
    color: "#6A6A6A",
    fontWeight: "bold",
  },

 


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 350,
    height: 270,
    backgroundColor: '#2B2B2B',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: "center",
    shadowColor: '#404040',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    color: "#929292",
  },
  input: {
    height: 56,
    color: "#A2A2A2",
    borderColor: '#212121',
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#111111",
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#0068E1',
    paddingVertical: 14,
    borderRadius: 16,
    height: 50,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E10051',
    paddingVertical: 14,
    borderRadius: 16,
    height: 50,
  },

  // Add to your StyleSheet
topButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 50,
  marginBottom: 20,
},
goalButton: {
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: "#1E1E1E",
  backgroundColor: "#141414",
  borderRadius: 15,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

},
goalButtonText: {
  color: "#7D7D7D",
  fontSize: 16,
  
},
});