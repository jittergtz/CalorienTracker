
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }: any) => {
  const [db, setDb] = useState(null);
  const [streak, setStreak] = useState(35);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [calories, setCalories] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState('2250'); // Set a default value
  const [totalCalories, setTotalCalories] = useState(0);
  const [inputCalories, setInputCalories] = useState('');
  const [isIncrease, setIsIncrease] = useState(true);
  const [calorieWarning, setCalorieWarning] = useState('');
  const [perfectMonths, setPerfectMonths] = useState(0);

  const [completionStats, setCompletionStats] = useState({
    totalDays: 0,
    successfulDays: 0,
    completionRate: 0
  });

  useEffect(() => {
    async function initializeDatabase() {
      const database = await SQLite.openDatabaseAsync('calorieTracker.db');
      setDb(database);
      await createTable(database);
      await resetDailyData(database);
      await fetchHighestStreak(database); // Fetch highest streak on init
      await calculateCompletionStats(database);
      await calculatePerfectMonths(database);
    }
    initializeDatabase();
  }, []);


  const calculatePerfectMonths = async (dbInstance) => {
    try {
      // First, get all streaks that were 30 days or longer
      const streaksResult = await dbInstance.getAllAsync(
        'SELECT streak FROM calorie_data WHERE streak >= 30 GROUP BY date ORDER BY streak DESC'
      );
      
      let totalPerfectMonths = 0;
      
      // Calculate perfect months from each qualifying streak
      streaksResult.forEach(result => {
        const streakDays = result.streak;
        const monthsInStreak = Math.floor(streakDays / 30);
        totalPerfectMonths += monthsInStreak;
      });

      setPerfectMonths(totalPerfectMonths);
      console.log('Perfect months calculated:', totalPerfectMonths);
      
      return totalPerfectMonths;
    } catch (error) {
      console.error('Error calculating perfect months:', error);
      setPerfectMonths(0);
      return 0;
    }
  };


  const calculateCompletionStats = async (dbInstance) => {
    try {
      // Get all days except today (since it's not completed yet)
      const today = new Date().toISOString().slice(0, 10);
      
      // First, get total number of days recorded
      const totalDaysResult = await dbInstance.getAllAsync(
        'SELECT COUNT(*) as total FROM calorie_data WHERE date != ?',
        [today]
      );
      
      // Then, get number of successful days
      const successfulDaysResult = await dbInstance.getAllAsync(
        'SELECT COUNT(*) as successful FROM calorie_data WHERE calories >= calorie_goal AND date != ?',
        [today]
      );
      
      const totalDays = totalDaysResult[0].total;
      const successfulDays = successfulDaysResult[0].successful;
      const completionRate = totalDays > 0 
        ? ((successfulDays / totalDays) * 100).toFixed(1)
        : 0;

      setCompletionStats({
        totalDays,
        successfulDays,
        completionRate: parseFloat(completionRate)
      });

      console.log('Completion stats calculated:', {
        totalDays,
        successfulDays,
        completionRate
      });
    } catch (error) {
      console.error('Error calculating completion stats:', error);
      setCompletionStats({
        totalDays: 0,
        successfulDays: 0,
        completionRate: 0
      });
    }
  };

  
  const fetchHighestStreak = async (dbInstance) => {
    try {
      const result = await dbInstance.getAllAsync(
        'SELECT MAX(streak) as highest_streak FROM calorie_data'
      );
      
      if (result.length > 0 && result[0].highest_streak !== null) {
        setHighestStreak(result[0].highest_streak);
        console.log('Highest streak found:', result[0].highest_streak);
      } else {
        setHighestStreak(0);
        console.log('No streak records found, setting highest streak to 0');
      }
    } catch (error) {
      console.error('Error fetching highest streak:', error);
      setHighestStreak(0);
    }
  };

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
  
      if (newStreak > highestStreak) {
        setHighestStreak(newStreak);
      }

      // After updating the daily data, recalculate completion stats
      await calculateCompletionStats(dbInstance);
      await calculatePerfectMonths(dbInstance);
  
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
      highestStreak,
      completionStats,
      perfectMonths,
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
