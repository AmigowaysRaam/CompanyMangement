import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { hp, wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import LinearGradient from 'react-native-linear-gradient';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';


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

const PieChart = (data) => {

  const [chartData, setChartData] = useState([]);
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  useEffect(() => {
    // alert(JSON.stringify(data.data))
    const rawData = [
      { percentage: 30, colors: ['#004284', '#6BB0F6'], label: 'Completed Projects' },
      { percentage: 20, colors: ['#9747FF', '#D5B5FF'], label: 'Pending Projects' },
      { percentage: 50, colors: ['#FF4A36', '#CC4537'], label: 'Upcoming Projects' },
    ];

    // Compute rotation per slice
    let currentAngle = 0;
    const dataWithRotation = data?.data.map(item => {
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
        {t('project_overview')}
      </Text>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.map((item, index) => (
            <PieSlice key={index} rotation={item.rotation} colors={item.colors} />
          ))}
          <View style={[styles.centerCircle, {
            backgroundColor: THEMECOLORS[themeMode].cardBackground,
            top: wp(6),
            left: wp(6),
          }]} />
        </View>

        <View style={styles.legend}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.colors[0] }]} />
              <Text style={[{
                fontSize: wp(isTamil ? 2: 2.5)
              }]}>
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
    width: wp(35),
    height: wp(35),
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
    width: wp(18),
    height: wp(42),
    borderTopLeftRadius: wp(50),
    borderBottomLeftRadius: wp(50),
  },
  centerCircle: {
    width: wp(23),
    height: wp(23),
    borderRadius: wp(12),
    position: 'absolute',

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
