import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DonutChartProps {
  currentValue: number;
  targetValue: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  currentValue ,
  targetValue ,
  size = 160,
  strokeWidth = 12,
  duration = 1000,
  color = '#8B5CF6',
}) => {
  // Calculate radiuses and center point
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Animation value
  const progress = useSharedValue(0);
  
  // Calculate percentage
  const percentage = Math.min(100, (currentValue / targetValue) * 100);
  
  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [percentage]);

  // Animate the stroke dash offset
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center},${center}`}>
            {/* Background circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#333333"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated progress circle */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.textContainer}>
          <Text style={styles.valueText}>{currentValue}</Text>
          <Text style={styles.unitText}>kcal</Text>
        </View>
      </View>
      <View style={styles.targetContainer}>
        <Text style={styles.targetValue}>{targetValue}</Text>
        <Text style={styles.targetLabel}>Ziel</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  unitText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 2,
  },
  targetContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  targetValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  targetLabel: {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
  },
});

export default DonutChart;