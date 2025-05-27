import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { hp, wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import LinearGradient from 'react-native-linear-gradient';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
const PieSlice = ({ rotation, colors }) => (

  <View style={[styles.sliceContainer, { transform: [{ rotate: `${rotation}deg` }] }]}>
    <LinearGradient
      colors={colors}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.slice}
    />
  </View>
);

const PieChart = () => {
  const [chartData, setChartData] = useState([]);
  const { themeMode } = useTheme();

  useEffect(() => {
    const rawData = [
      { percentage: 30, colors: ['#004284', '#6BB0F6'], label: 'Completed Projects' },
      { percentage: 20, colors: ['#9747FF', '#D5B5FF'], label: 'Pending Projects' },
      { percentage: 50, colors: ['#FF4A36', '#CC4537'], label: 'Upcoming Projects' },
    ];

    // Compute rotation per slice
    let currentAngle = 0;
    const dataWithRotation = rawData.map(item => {
      const rotation = currentAngle;
      currentAngle += (item.percentage / 100) * 360;
      return { ...item, rotation };
    });

    setChartData(dataWithRotation);
  }, []);

  return (
    <View style={[styles.card, {
      backgroundColor: THEMECOLORS[themeMode].cardBackground,
    }]}>
      <Text style={[Louis_George_Cafe.bold.h6, { alignSelf: "flex-start", marginBottom: wp(5) }]}>
        Project Overview
      </Text>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.map((item, index) => (
            <PieSlice key={index} rotation={item.rotation} colors={item.colors} />
          ))}
          <View style={[styles.centerCircle, {
            backgroundColor: THEMECOLORS[themeMode].cardBackground,
          }]} />
        </View>

        <View style={styles.legend}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.colors[0] }]} />
              <Text style={[Louis_George_Cafe.regular.h8, styles.legendText]}>
                {item.label}

              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: wp(3),
    padding: wp(4),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    height: hp(28),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(2),
    marginVertical: wp(2),
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    overflow: 'hidden',
    position: 'relative',
  },
  sliceContainer: {
    position: 'absolute',
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  slice: {
    width: wp(20),
    height: wp(45),
    borderTopLeftRadius: wp(50),
    borderBottomLeftRadius: wp(50),
  },
  centerCircle: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    position: 'absolute',
    top: wp(8),
    left: wp(8),
  },
  legend: {
    marginLeft: wp(5),
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(2),
  },
  legendColor: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(2),
    marginRight: wp(2),
  },
  legendText: {
  },
});

export default PieChart;
