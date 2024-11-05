import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Svg, G, Rect, Line, Text as SvgText, Circle } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';

const RepeatCustomerRateChart = () => {
  const data = [
    { day: 'So', 'This week': 9.3, 'Last week': 8.0 },
    { day: 'Mo', 'This week': 8.5, 'Last week': 7.2 },
    { day: 'Di', 'This week': 8.6, 'Last week': 8.5 },
    { day: 'Mi', 'This week': 11.2, 'Last week': 9.7 },
    { day: 'Do', 'This week': 13.23, 'Last week': 8.08 },
    { day: 'Fr', 'This week': 9.1, 'Last week': 10.4 },
    { day: 'Sa', 'This week': 10.5, 'Last week': 9.7 },
  ];

  const chartWidth = 320;
  const chartHeight = 180;
  const padding = 20;

  const getXScale = () => (chartWidth - 2 * padding) / (data.length - 1);
  const getYScale = () => (chartHeight - 2 * padding) / 15;

  return (
    <View style={styles.container}>
      {/* Title and Legend */}
      <View style={styles.header}>
        <Text style={styles.title}>Tracking übersicht</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.legendText}>Diese Woche</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#B8860B' }]} />
            <Text style={styles.legendText}>Letzte Woche</Text>
          </View>
        </View>
      </View>

      <Svg width={chartWidth} height={chartHeight}>
        <G>
          {data.map((item, index) => (
            <G key={index} transform={`translate(${index * getXScale() + padding}, ${chartHeight - padding})`}>
              {/* "This week" Bar */}
              <Rect
                x={-10}
                y={-(item['This week'] * getYScale())}
                width={8}
                height={item['This week'] * getYScale()}
                fill="#FFD700"
                rx={3} // Rounded corners
              />
              {/* "Last week" Bar */}
              <Rect
                x={2}
                y={-(item['Last week'] * getYScale())}
                width={8}
                height={item['Last week'] * getYScale()}
                fill="#B8860B"
                rx={3} // Rounded corners
              />
              {/* Day label */}
              <SvgText x={0} y={20} fontSize={12} fill="#A9A9A9" textAnchor="middle">
                {item.day}
              </SvgText>
            </G>
          ))}
        </G>
      </Svg>

      {/* Percentage Summary */}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: 370,
  },
  header: {
    width: '100%',
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    color: '#929292',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    color: '#dcdcdc',
    fontSize: 12,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  summaryText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  percentageChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  percentageText: {
    color: '#00c853',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  percentageLabel: {
    color: '#dcdcdc',
    fontSize: 12,
  },
});

export default RepeatCustomerRateChart;
