import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';
import { wp, hp } from '../resources/dimensions';

const ProfileScreenLoader = () => {
  const { themeMode } = useTheme();
  const theme = THEMECOLORS[themeMode];

  const baseColor = theme.cardBackground || '#ccc';
  const highlightColor = theme.placeholderHighlight || '#999';

  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 2,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [flashAnim]);

  const animatedBackground = flashAnim.interpolate({
    inputRange: [0, 2],
    outputRange: [baseColor, highlightColor],
  });

  const animatedCardStyle = {
    backgroundColor: animatedBackground,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Row 1: Cover Image and Circular Profile Pic */}
      <View>
        <Animated.View style={[styles.coverImage, animatedCardStyle]} />
        <Animated.View style={[styles.profilePic, animatedCardStyle]} />
      </View>

      {/* Row 2: 5 Menu Items */}
      <View style={styles.menuList}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Animated.View
            key={index}
            style={[styles.menuItem, animatedCardStyle, { marginTop: hp(2) }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  coverImage: {
    width: '100%',
    height: hp(20),
    borderRadius: 12,
  },
  profilePic: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(6),
    position: 'absolute',
    bottom: -hp(6),
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  menuList: {
    marginTop: hp(8),
  },
  menuItem: {
    width: '100%',
    height: hp(7),
    borderRadius: 10,
  },
});

export default ProfileScreenLoader;
