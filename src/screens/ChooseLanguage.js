import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/Language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrentLocation } from '../hooks/location';
import { useDispatch } from 'react-redux';
import { getLanguageList, getSiteSettingsFrom, setLanguageSelected } from '../redux/authActions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18n from '../resources/config/i18';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';

const ChooseLanguage = () => {

  const [imageData, setImageData] = useState(null); // <-- create state
  const [languagesList, setSelectedLanguageList] = useState([]);
  const { currency, langCode } = useCurrentLocation();
  const { themeMode } = useTheme();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState(langCode ? langCode : language);
  
  const isTamil = i18n.language === 'ta';
  const scaleFont = (style) => ({
    ...style,
    fontSize: style?.fontSize ? style.fontSize * (isTamil ? 0.80 : 1) : undefined,
  });
  function getSiteSettings() {
    setLoading(true)
    dispatch(getLanguageList((response) => {
      if (response.success) {
        setSelectedLanguageList(response.data)
        setLoading(false)
      }
    }));
  }

  useEffect(() => {
    dispatch(setLanguageSelected(language, (response) => {
      if (response.success && response.data) {
        const translations = response.data;
        i18n.addResourceBundle(
          language,          // e.g., 'fr'
          'translation',     // Namespace
          translations,      // JSON object with translations
          true,              // Deep merge
          true               // Overwrite existing
        );
        // Change the language
        i18n.changeLanguage(language);
        console.log(`Language switched to ${language}`);

      } else {
        console.warn('Translation response is invalid or missing data.');
      }
    }));
  }, [langCode])

  // Function to handle language selection
  const handleLanguageSelect = async (langCode) => {
    try {
      // Store language code locally
      await AsyncStorage.setItem('appLanguage', langCode);
      setSelectedLanguage(langCode);
      setLanguage(langCode); // Update context (if using Context API)
      // Fetch or dispatch to get translations
      dispatch(setLanguageSelected(langCode, (response) => {
        if (response.success && response.data) {
          const translations = response.data; // This should be a JSON object like { welcome: "Hello", ... }
          // Add the translations to i18n
          i18n.addResourceBundle(
            langCode,          // e.g., 'fr'
            'translation',     // Namespace
            translations,      // JSON object with translations
            true,              // Deep merge
            true               // Overwrite existing
          );
          // Change the language
          i18n.changeLanguage(langCode);
          console.log(`Language switched to ${langCode}`);

        } else {
          console.warn('Translation response is invalid or missing data.');
        }
      }));
    } catch (e) {
      console.error('Failed to set language', e);
    }
  };


  useEffect(() => {
    getSiteSettings();
    // const fetchImage = async () => {
    //   try {
    //     const langImage = await AsyncStorage.getItem('site_settings');
    //     if (langImage) {
    //       const parsedImage = JSON.parse(langImage); // parse the stored object
    //       console.log('Language Image:', parsedImage);
    //       setImageData(parsedImage?.language_image); // <-- store in state
    //       // alert(JSON.stringify(imageData.language_image))
    //     } else {
    //       alert('No language image stored yet.');
    //     }
    //   } catch (e) {
    //     console.error('Failed to read language image from AsyncStorage', e);
    //   }
    // };
    // fetchImage();
  }, []);

  return (
    <View style={[
      styles.container,
      { backgroundColor: THEMECOLORS[themeMode].background }
    ]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[
          scaleFont(Louis_George_Cafe.bold.h6),
          {
            marginHorizontal: wp(4),
            color: THEMECOLORS[themeMode].primary,
            marginVertical: wp(2), lineHeight: wp(5)
          }
        ]}>
          {t('choose_language')}
        </Text>
        <Text style={[
          scaleFont(Louis_George_Cafe.bold.h6),
          {
            marginHorizontal: wp(4),
            marginVertical: wp(2),
            color: THEMECOLORS[themeMode].primary
          }
        ]}>
          {language}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          source={require('../../src/assets/animations/chooseLnaguage.png')}
          style={{
            width: wp(90),
            height: hp(45),
          }}
        />
      </View>

      <View style={styles.languageContainer}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.button_bg_color} size={wp(10)} />
        ) : (
          languagesList.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageButton,
                selectedLanguage === language.code && styles.selectedButton
              ]}
              onPress={() => handleLanguageSelect(language.code)}
            >
              <Text style={[
                scaleFont(styles.languageText),
                { color: selectedLanguage === language.code ? '#FFF' : '#000' }
              ]}>
                {language?.nativeName}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      
      
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: COLORS.button_bg_color }]}
        onPress={() =>
          navigation.navigate('CarouselData')
          // navigation.navigate('ServiceSelection')
        }
      >
        <Text style={[
          scaleFont(Louis_George_Cafe.bold.h5),
          styles.continueButtonText
        ]}>
          {t('continue')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffffff',
    paddingTop: hp(2),
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: wp(3),
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: hp(2),
  },
  languageButton: {
    width: wp(40),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#fff',
    borderWidth: wp(0.4),
    borderColor: "#000"
  },
  selectedButton: {
    backgroundColor: COLORS.button_bg_color,
    borderColor: COLORS.button_bg_color,
    borderWidth: wp(0),


  },
  languageText: {
    fontSize: 16,
  },
  continueButton: {
    width: wp(90),
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(4),
    alignSelf: "center",
    position: "absolute",
    bottom: wp(4),
    borderRadius: wp(5),
  },
  continueButtonText: {
    color: '#fff',
  },
});

export default ChooseLanguage;
