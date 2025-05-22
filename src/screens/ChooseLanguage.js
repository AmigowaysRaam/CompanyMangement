import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/Language';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage();
  // Array of languages with native names
  const languages = [
    { name: 'English', nativeName: 'English', code: 'en' },
    { name: 'Tamil', nativeName: 'தமிழ்', code: 'ta' },
    { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
    { name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn' },
    { name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml' },
    { name: 'Marathi', nativeName: 'मराठी', code: 'mr' }
  ];

  // Function to handle language selection
  const handleLanguageSelect = async (langCode) => {
    try {
      await AsyncStorage.setItem('appLanguage', langCode); // Save code instead of name
      setSelectedLanguage(langCode);
      setLanguage(langCode); // Update context
    } catch (e) {
      console.error('Failed to save the language to AsyncStorage', e);
    }
  };


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[Louis_George_Cafe.bold.h6, { marginHorizontal: wp(4), marginVertical: wp(2) }]}>
          Choose Language
        </Text>
        <Text style={[Louis_George_Cafe.bold.h6, { marginHorizontal: wp(4), marginVertical: wp(2) }]}>{language}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          source={require('../../src/assets/animations/chooseLnaguage.png')}
          style={{
            width: wp(90), height: hp(45),
          }}
        />
      </View>
      <View style={styles.languageContainer}>
        {/* Render language buttons */}
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code} // ✅ Unique key added
            style={[styles.languageButton, selectedLanguage === language.code && styles.selectedButton]}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <Text style={[styles.languageText, {
              color: selectedLanguage === language.code ? '#FFF' : '#000'
            }]}>
              {language.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: COLORS.button_bg_color }]}
        onPress={() =>
          navigation.navigate('CarouselData')
        }>
        <Text style={[Louis_George_Cafe.bold.h5, styles.continueButtonText]}>Continue</Text>
      </TouchableOpacity>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
