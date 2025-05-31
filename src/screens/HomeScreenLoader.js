import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';
import { wp, hp } from '../resources/dimensions';

const HomeScreenLoader = () => {
  const { themeMode } = useTheme();
  const theme = THEMECOLORS[themeMode];

  // Base and highlight colors for flashing
  const baseColor = themeMode == 'dark' ? '#111' : "#CCC";
  const highlightColor = themeMode == 'dark' ? '#999' : "#FFF";

  // Animated value for flashing effect
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping animation between 0 and 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [flashAnim]);

  // Interpolate the animated value to create flashing colors
  const animatedBackground = flashAnim.interpolate({
    inputRange: [0, 2],
    outputRange: [baseColor, highlightColor],
  });

  // Card style generator with animated background color
  const animatedCardStyle = {
    backgroundColor: animatedBackground,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Row 1 - Two horizontal cards */}
      <View style={styles.row}>
        <Animated.View style={[styles.rectCard, styles.halfWidth, animatedCardStyle, { marginRight: wp(2) }]} />
        <Animated.View style={[styles.rectCard, styles.halfWidth, animatedCardStyle, { marginLeft: wp(2) }]} />
      </View>

      {/* Row 2 - One full width card */}
      <Animated.View style={[styles.rectCard, styles.fullWidth, animatedCardStyle, { marginVertical: hp(2) }]} />

      {/* Row 3 - One square card */}
      <Animated.View style={[styles.squareCard, animatedCardStyle]} />

      {/* Extra full width card as per your existing layout */}
      <Animated.View style={[styles.rectCard, styles.fullWidth, animatedCardStyle, { marginVertical: hp(2) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rectCard: {
    height: hp(20),
    borderRadius: 12,
  },
  halfWidth: {
    width: wp(45),
    height: hp(14),
  },
  fullWidth: {
    width: wp(92), // full width with padding considered
  },
  squareCard: {
    width: wp(92),
    height: wp(60),
    borderRadius: 12,
  },
});

export default HomeScreenLoader;
