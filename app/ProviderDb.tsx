
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }: any) => {
  const [db, setDb] = useState(null);
  const [streak, setStreak] = useState(35);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [calories, setCalories] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState('2250'); // Set a default value
  const [totalCalories, setTotalCalories] = useState(0);
  const [inputCalories, setInputCalories] = useState('');
  const [isIncrease, setIsIncrease] = useState(true);
  const [calorieWarning, setCalorieWarning] = useState('');

  useEffect(() => {
    async function initializeDatabase() {
      const database = await SQLite.openDatabaseAsync('calorieTracker.db');
      setDb(database);
      await createTable(database);
      await resetDailyData(database);
    }
    initializeDatabase();
  }, []);

  const resetDailyData = async (dbInstance) => {
    const today = new Date().toISOString().slice(0, 10);
    console.log("resetDailyData function called with date:", today);
  
    try {
      // Calculate yesterday's date string
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
  
      // Fetch yesterday's data
      const yesterdayResult = await dbInstance.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [yesterdayStr]
      );
      console.log("Yesterday's result:", yesterdayResult);
  
      // Determine if the streak should be reset
      let newStreak = 0;
      if (yesterdayResult.length > 0) {
        const { calories, calorie_goal, streak } = yesterdayResult[0];
  
        // If yesterday's calories did not meet the goal, reset streak
        if (calories < calorie_goal || null) {
          newStreak = 0;
          console.log("Yesterday's goal was NOT met. Resetting streak to 0.");
        } else {
          // If yesterday met the goal, keep the streak as is
          newStreak = streak;
          console.log("Yesterday's goal was met. Keeping streak as:", newStreak);
        }
      }












      // Check if there's an entry for today
      const todayResult = await dbInstance.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [today]
      );
  
      if (todayResult.length > 0) {
        // Update today's entry with reset calories and streak
        await dbInstance.runAsync(
          'UPDATE calorie_data SET calories = 0, streak = ? WHERE date = ?',
          [newStreak, today]
        );
        console.log("Updated existing entry for today with streak:", newStreak);
      } else {
        // Insert a new entry for today if it doesn't exist
        const lastGoal = yesterdayResult.length > 0 ? yesterdayResult[0].calorie_goal : 2250;
        await dbInstance.runAsync(
          'INSERT INTO calorie_data (calories, calorie_goal, date, streak) VALUES (?, ?, ?, ?)',
          [0, lastGoal, today, newStreak]
        );
        console.log("Inserted new entry for today with streak:", newStreak);
      }
  
      // Log the final streak to confirm
      console.log("Data reset for today completed. Final streak value for today:", newStreak);
  
      // Update the UI with the new values
      setTotalCalories(0);
      setStreak(newStreak);
    } catch (error) {
      console.error('Error resetting daily data:', error);
    }
  };
  
  
  

  const handleDailyReset = async (dbInstance, today) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
  
      // Check if the goal was met yesterday
      const yesterdayData = await dbInstance.getAllAsync(
        'SELECT * FROM calorie_data WHERE date = ?',
        [yesterdayStr]
      );
  
      let newStreak = streak;
      const lastGoal = yesterdayData.length > 0 ? yesterdayData[0].calorie_goal : calorieGoal;
      const goalMetYesterday = yesterdayData.length > 0 && yesterdayData[0].calories >= lastGoal;
  
      // Update streak based on goal met status
      if (goalMetYesterday) {
        newStreak += 1;
      } else {
        newStreak = 0;
      }
  
      // Insert today’s data with updated streak and reset calories
      await dbInstance.runAsync(
        'INSERT INTO calorie_data (calories, calorie_goal, date, streak) VALUES (?, ?, ?, ?)',
        [0, lastGoal, today, newStreak]
      );
  
      setCalorieGoal(lastGoal.toString());
      setTotalCalories(0);
      setStreak(newStreak);
    } catch (error) {
      console.error('Error in daily reset:', error);
    }
  };

  // Testing resetDailyData to simulate a new day without waiting
  const testDailyReset = async () => {
    console.log("testDailyReset button pressed");
    console.log("db state:", db); // Check if db is null or initialized
    const mockToday = new Date();
    mockToday.setDate(mockToday.getDate() - 1); // Set to "yesterday"
    setCurrentDate(mockToday.toISOString().slice(0, 10));
  
    if (db) {
      await resetDailyData(db);
    } else {
      console.log("Database is not initialized.");
    }
  };
  

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

  return (
    <DatabaseContext.Provider value={{ 
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
      currentDate,
      testDailyReset
      }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
