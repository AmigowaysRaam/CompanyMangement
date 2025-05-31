import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native'; // 👈 Import navigation hook
import { hp, wp } from '../resources/dimensions';
import { COLORS } from '../resources/Colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from '../resources/config/i18';

const CarouselData = () => {
  const [currrentIndexz, setcurrrentIndexz] = useState(0);
  const [currentImageName, setCurrentImageName] = useState('carousel_1');
  const carouselRef = useRef(null);
  const navigation = useNavigation(); // 👈 Get navigation instance
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();

  const data = [
    {
      image: require('../../src/assets/animations/carousel_1.png'),
      title: 'Welcome to Amigoways HRMS',
      description: `Your Trusted Partner for Seamless Workforce Management Empower your team streamline your processes, and achieve more together`,
      imageName: 'carousel_1'
    },
    {
      image: require('../../src/assets/animations/carousel_2.png'),
      title: 'Simplify Your Payroll Process',
      description: `Accurate, timely, and hassle-free 
salary management at your fingertips
Ensure compliance and keep your team motivated`,
      imageName: 'carousel_2'
    },
    {
      image: require('../../src/assets/animations/carousel_3.png'),
      title: 'Effortless Employee Management',
      description: `Organize, monitor, and support your workforce with ease
From onboarding to performance, 
manage  everything in one place
`,
      imageName: 'carousel_3'
    },
  ];

  const handleSkip = () => {
    if (currrentIndexz < data.length - 1) {
      const nextIndex = currrentIndexz + 1;
      setcurrrentIndexz(nextIndex);
      setCurrentImageName(data[nextIndex].imageName);
      carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
    } else {
      navigation.replace('LoginScreen')
    }
  };

  const handleSnapToItem = (index) => {
    setcurrrentIndexz(index);
    setCurrentImageName(data[index]?.imageName);
    if (index === data.length - 1) {
      // Automatically navigate when last item is reached via swipe
      navigation.replace('LoginScreen')
    }
  };

  return (
    <View style={[styles.container, {
      backgroundColor: THEMECOLORS[themeMode].background,
    }]}>
      {/* Skip button at top right */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => handleSkip()}
      >
        <Text style={[styles.skipButtonText, {
          color: THEMECOLORS[themeMode].primary
        }]}>
          {currrentIndexz < data.length - 1 ? t('skip') : t('get_started')}
        </Text>
      </TouchableOpacity>
      <Carousel
        ref={carouselRef}
        pagingEnabled={true}

        style={{ zIndex: 0 }}
        width={wp(90)}
        height={hp(80)}
        data={data}
        scrollAnimationDuration={10}
        currentIndex={currrentIndexz}
        onSnapToItem={handleSnapToItem}
        renderItem={({ index }) => (
          <View style={styles.carouselItem}>
            <Image
              source={data[index].image}
              style={styles.carouselImage}
              resizeMode="contain" // Optional: keep aspect ratio
            />
            <Text style={[Louis_George_Cafe.bold.h5, styles.title, {
              color: THEMECOLORS[themeMode].primary
            }]}>{data[index].title}</Text>
            <Text style={[Louis_George_Cafe.bold.h7, styles.description, {
              color: THEMECOLORS[themeMode].primary
            }]}>{data[index].description}</Text>
          </View>
        )}
        loop={false}
      />

      {/* Carousel Indicator */}
      <View style={styles.indicatorContainer}>
        {data.map((item, index) => (
          <View
            key={item.imageName}
            style={[
              styles.indicator,
              currentImageName === item.imageName && { backgroundColor: THEMECOLORS[themeMode].primaryApp }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,

  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselItem: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    height: hp(65), // Increased height
    marginBottom: 30, // Extra gap between items and indicators (if needed)
  },
  carouselImage: {
    width: wp(85),
    height: hp(40), // Increased image height
    marginBottom: 20, // Gap between image and title
  },

  title: {
    color: '#333',
    marginBottom: hp(5), // More space below title
    textAlign: 'center',
  },

  description: {
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: wp(4),
    lineHeight: wp(6)
  },

  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },

  indicator: {
    width: wp(2.5),
    height: wp(2.5),
    margin: wp(1),
    borderRadius: 5,
    backgroundColor: '#DDD',
  },

  activeIndicator: {
  },
});

export default CarouselData;
