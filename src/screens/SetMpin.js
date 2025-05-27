import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { useNavigation } from '@react-navigation/native';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';

const SetMpin = () => {

  const navigation = useNavigation();
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [confirmMpin, setConfirmMpin] = useState(['', '', '', '']);
  const { themeMode } = useTheme();

  useEffect(() => {
    if (__DEV__) {
      const devMpin = ['1', '2', '3', '4']; // example dev mpin
      setMpin(devMpin);
      setConfirmMpin(devMpin);
    }
  }, []);

  const mpinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const confirmRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (text, index, isConfirm = false) => {
    if (text.length > 1) return;

    const pin = isConfirm ? [...confirmMpin] : [...mpin];
    pin[index] = text;
    isConfirm ? setConfirmMpin(pin) : setMpin(pin);

    const refs = isConfirm ? confirmRefs : mpinRefs;
    if (text && index < 3) {
      refs[index + 1].current.focus();
    }
    if (!text && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const isMpinComplete = mpin.every(d => d !== '');
  const isConfirmComplete = confirmMpin.every(d => d !== '');
  const isMatch = mpin.join('') === confirmMpin.join('');

  const handleSetMpin = () => {
    if (isMpinComplete && isConfirmComplete && isMatch) {
      // Store securely or send to backend
      navigation.replace('ServiceSelection');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, {
            backgroundColor: THEMECOLORS[themeMode].background
          }]}>
            <Text style={[Louis_George_Cafe.bold.h5, {
              alignSelf: "center",
              marginVertical: wp(3), color: THEMECOLORS[themeMode].primary
            }]}>
              Create Your MPIN
            </Text>

            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={require('../../src/assets/animations/Isolation_shield.png')}
                style={{ width: wp(75), height: hp(30), margin: wp(2) }}
              />
            </View>

            <Text style={[Louis_George_Cafe.regular.h8, {
              alignSelf: "center",
              margin: wp(3),
              textAlign: 'center', color: THEMECOLORS[themeMode].primary

            }]}>
              Create a 4-digit MPIN to secure your account
            </Text>

            {/* MPIN Input */}
            <Text style={[Louis_George_Cafe.bold.h8, { marginBottom: hp(1), alignSelf: "center", color: THEMECOLORS[themeMode].primary }]}>
              Enter Your MPIN
            </Text>
            <View style={styles.otpContainer}>
              {mpin.map((digit, index) => (
                <TextInput
                  key={`mpin-${index}`}
                  ref={mpinRefs[index]}
                  style={[styles.otpInput, {
                    color: THEMECOLORS[themeMode].primaryApp, backgroundColor: "#D7E3FF"
                  }]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  secureTextEntry={false}
                />
              ))}
            </View>
            {/* Confirm MPIN Input */}
            <Text style={[Louis_George_Cafe.bold.h8, { marginBottom: hp(1), alignSelf: "center", }]}>
              Confirm MPIN
            </Text>
            <View style={styles.otpContainer}>
              {confirmMpin.map((digit, index) => (
                <TextInput
                  key={`confirm-${index}`}
                  ref={confirmRefs[index]}
                  style={[styles.otpInput, {
                    color: THEMECOLORS[themeMode].primaryApp, backgroundColor: "#D7E3FF"
                  }]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index, true)}
                  secureTextEntry={false}
                />
              ))}
            </View>
            {/* Mismatch warning */}
            {isConfirmComplete && !isMatch && (
              <Text style={{
                color: 'red',
                alignSelf: 'center',
                marginTop: hp(1),
                fontSize: 14,
              }}>
                MPINs do not match
              </Text>
            )}

            {/* Set MPIN button */}
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: !isMpinComplete || !isConfirmComplete || !isMatch ? COLORS.input_background : COLORS.button_bg_color }]}
              onPress={handleSetMpin}
              disabled={!isMpinComplete || !isConfirmComplete || !isMatch}
            >
              <Text style={[Louis_George_Cafe.bold.h5, {
                color: !isMpinComplete || !isConfirmComplete || !isMatch ? COLORS.black : COLORS.background
              }]}>
                Set MPIN
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffffff',
    paddingTop: hp(2),
    paddingBottom: hp(10),
    paddingHorizontal: wp(5),
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: wp(3),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
    marginBottom: hp(2),
  },
  otpInput: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(2),
    fontSize: 20,
    textAlign: 'center',
  },
  continueButton: {
    width: '70%',
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    borderRadius: wp(5),
    alignSelf: "center",
  },
  continueButtonText: {
    // color: '#fff',
  },
});

export default SetMpin;
