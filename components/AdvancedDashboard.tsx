import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import DonutChart from './DonutChart';


interface NutritionDashboardProps {
  calories: number;
  calorieTarget: number;
  proteinCurrent: number,
  proteinGoal: number,
  carbsCurrent: number,
  carbsGoal: number,
  fatsCurrent: number,
  fatsGoal: number,
}

const ProgressBar = ({ 
  label, 
  current, 
  target = 90, 
  color, 
  delay = 0 
}: { 
  label: string; 
  current: number; 
  target: number; 
  color: string; 
  delay?: number;
}) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(current / target, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
 
    });
  }, [current, target]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, progress.value * 100)}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valuesContainer}>
          <Text style={styles.currentValue}>{current}G</Text>
          <Text style={styles.targetValue}>{target}G</Text>
        </View>
      </View>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { backgroundColor: color },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const NutritionDashboard: React.FC<NutritionDashboardProps> = ({
  calories,
  calorieTarget,
  proteinCurrent,
  proteinGoal,
  carbsCurrent,
  carbsGoal,
  fatsCurrent,
  fatsGoal,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.donutContainer}>
          <DonutChart
            currentValue={calories || 0}
            targetValue={calorieTarget || 0}
            size={140}
            color="#8B5CF6"
          />
        </View>
        <View style={styles.progressBarsContainer}>
          <ProgressBar
            label="Protein"
            current={proteinCurrent || 0}
            target={proteinGoal || 0}
            color="#D4AF37" // Gold color
            delay={200}
          />
          <ProgressBar
            label="Kohlenhydrate"
            current={carbsCurrent || 0}
            target={carbsGoal || 0}
            color="#60A5FA" // Blue color
            delay={400}
          />
          <ProgressBar
            label="Fette"
            current={fatsCurrent || 0}
            target={fatsGoal || 0}
            color="#F97316" // Orange color
            delay={600}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: "#1E1E1E",
    borderRadius: 16,
    padding: 5,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: 13,

  },
  donutContainer: {
    borderRadius: 16,
    backgroundColor: "#101010",
    
    flex: 1,
    padding: 5,
  },
  progressBarsContainer: {
    gap: 18,  
  },
  progressContainer: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  currentValue: {
    color: '#999999',
    fontSize: 14,
  },
  targetValue: {
    color: '#666666',
    fontSize: 14,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default NutritionDashboard;