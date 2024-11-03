// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, Pressable } from 'react-native';
import * as SQLite from 'expo-sqlite';
import LevelBanner from "@/components/LevelUpCard"
import { useDatabase } from '../ProviderDb';
import { Prestige } from '@/components/Prestige/prestige';
import { LinearGradient } from 'expo-linear-gradient';
import  DonutChart from "@/components/DonutChart"
import NutritionDashboard from "@/components/AdvancedDashboard"

export default function HomeScreen() {

  const {    
    db,
    streak, 
    setStreak,
    calorieGoal, 
    setCalorieGoal,
    calories, 
    setCalories,
    setInputCalories, 
    inputCalories,
    totalCalories, 
    setTotalCalories,
    calorieWarning, 
    setCalorieWarning,
    isIncrease,
    setIsIncrease,
    testDailyReset,
    currentDate } = useDatabase();

  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [advancedDashboard, setAdvancedDashboard] = useState(false)


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
    if (streak >= 75) return ['#1B0B0B', '#1B281C' ];
    if (streak >= 60) return '#0B1D21';
    if (streak >= 50) return '#241212';
    if (streak >= 45) return '#241E12';
    if (streak >= 40) return '#1B281C';
    if (streak >= 35) return '#0F242B';
    if (streak >= 30) return '#1C0303';
    if (streak >= 25) return '#3F340C';
    if (streak >= 23) return ['#1B0B0B', '#1B281C' ];
    if (streak >= 20) return ['#1B0B0B', '#1B281C' ];
    if (streak >= 10) return ['#1B0B0B', '#1B281C' ];
    if (streak >= 3) return ['#1B0B0B', '#1B281C' ];
    return ['#1B0B0B', '#1B281C' ];
  };




  const getIcon = (streak: number) => {
    const prestige = Prestige.find((p) => p.streak <= streak);
    return prestige ? prestige.img : require('@/assets/images/pres1.png');
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
      setTimeout(() => setCalorieWarning(''), 2500);
      setInputCalories('');
      return;
    }




  
    const currentCalories = parseInt(inputCalories);
    const newTotal = isIncrease ? totalCalories + currentCalories : Math.max(0, totalCalories - currentCalories);
  
    // Check if newTotal exceeds calorie goal
    if (newTotal > parseInt(calorieGoal)) {
      setCalorieWarning(`Du überschreitest dein kalorienziel`);
      setInputCalories('');
      setTimeout(() => setCalorieWarning(''), 5500);
      return;
    }
  
    setCalorieWarning('');
    
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [currentDate]
      );
  
      // Only update streak if we've met or exceeded the goal
      let newStreak = streak;
      if (newTotal >= parseInt(calorieGoal)) {
        newStreak += 1;
      }
      // Don't reset streak if we haven't met the goal yet - this will be handled by resetDailyData
  
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
    if (currentStreak < 3) return 3;
    if (currentStreak < 7) return 7;
    if (currentStreak < 12) return 12;
    if (currentStreak < 18) return 18;
    if (currentStreak < 25) return 25;
    if (currentStreak < 30) return 30;
    if (currentStreak < 40) return 40;
    if (currentStreak < 50) return 50;
    if (currentStreak < 60) return 60;
    if (currentStreak < 70) return 70;
    if (currentStreak < 80) return 70;
    if (currentStreak < 90) return 70;
    if (currentStreak < 100) return 100;
    if (currentStreak < 115) return 115;
    if (currentStreak < 130) return 130;
    if (currentStreak < 150) return 150;
    if (currentStreak < 175) return 175;
    return currentStreak; // If already at or above 100
  };

  const PrestigePercentage = Math.min((streak / parseInt(getNextStreakMilestone(streak))) * 100, 100);


  return (
    <View style={styles.mainContainer}>
    <LevelBanner streak={streak} />
  
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
          <LinearGradient
             style={styles.leveltextPurple}  
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
             colors={['#1A0213', '#69198E', '#1A0213']}>
                <Text style={styles.streakText}>Streak {streak}</Text> 
            </LinearGradient>
            <View style={styles.leveltext}><Text style={styles.streakBarText} >
               Nächster Rang ab Streak <Text style={{color: "#B07D31"}}>{getNextStreakMilestone(streak)}</Text></Text></View>
          </View>

        </View>
                <Image 
              source={getIcon(getNextStreakMilestone(streak))}
              style={styles.streakImageBar}
              resizeMode="contain"/>

       </View>

       <View style={{ height: 23,}}>
        <Text style={{color: "#6B6B6B", fontWeight: "bold",fontSize: 15, }}>Tages Kalorien</Text>
        </View>
     
     
      {advancedDashboard ? (
      <NutritionDashboard
        calories={totalCalories}
        calorieTarget={calorieGoal}
        protein={{ current: 44, target: 120 }}
        carbs={{ current: 150, target: 200 }}
        fats={{ current: 90, target: 190 }}
      />
       ) : (
      <DonutChart 
        currentValue={totalCalories} 
        targetValue={calorieGoal} 
      />
        )}
        
     

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
        <LinearGradient
             style={styles.streakContainer}  
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
             colors={['#958A63',  getStreakBg(streak)]}>
             
             <View style={{display: "flex", flexDirection: "row", gap: 2,}}>  
             <Image 
              source={getIcon(streak)}
              style={styles.streakImage}
              resizeMode="contain"
            />
                <View >
              <Text style={[
                { color: getStreakColor(streak) },
                styles.streakNumber
              ]}>
               {streak}
                </Text>
              <Text style={styles.streakText}>Streak</Text>
            </View>
            </View>

            <View style={{ width: 150}}>
              <Text style={styles.QouteText}>Cant Stop, Wont Stop</Text>
            </View>


            </LinearGradient>
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
    backgroundColor: '#090909',
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
    gap: 10,
    marginTop: 10,
    
  },
  button: {
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
    justifyContent: "space-between",
    width: "100%",
    height: 95,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    flexDirection: "row",
    display: "flex",
    paddingHorizontal: 10,
   
  },
  streakText: {
    fontSize: 13,
    color: "#EAEAEA90",
    textAlign: "center",
    fontWeight: "bold",
  },
  streakNumber: {
    fontSize: 53,
    fontWeight: 'bold',
    lineHeight: 60,
    color: "#EAEAEA90",
    textAlign: "center",
    
  },
  streakNumberContainer: {
     
    alignItems: 'center',
    display: "flex",
    flexDirection: "column",
    gap: 0,
    height: "100%",

     
     
  },
  streakImage: {
    height: 80,
    width: 80,
  },

  QouteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EAEAEA90",
    width: "80%",
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
    borderColor: "#1C1C1C",
    borderWidth: 1,
    backgroundColor: "#131313",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 3,
   
  },

  leveltext: {
    color: "white",
    
    borderRadius: 12, 
    backgroundColor: "#1F1E1E",
    padding: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
   

  leveltextPurple: {
    color: "white",
    
    borderRadius: 12, 
    backgroundColor: "#1F1E1E",
    padding: 4,
    paddingHorizontal: 12,
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
      height: 25,
    },


  streakLevelContainer: {
     display: "flex",
     flex: 1,
     height: "full",
     padding:10,
     gap: 4,
     

  },

  streakLevelBar: {
    backgroundColor: "#252525",
    borderRadius: 20,
    width: "full",
    height: 12,
  },

  streakImageBar: {
    height: 52,
    width: 52,
  }, 


  streakBarText: {
    color: "#6A6A6A",
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 5,
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
    gap: 4,
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