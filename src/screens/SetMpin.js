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
  ActivityIndicator,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setMpinCall } from '../redux/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

const SetMpin = () => {

  const navigation = useNavigation();
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [confirmMpin, setConfirmMpin] = useState(['', '', '', '']);
  const { themeMode } = useTheme();
  const [isLoading, setisLoading] = useState(false);

  const route = useRoute();
  const lData = route?.params.data;
  useEffect(() => {
    // alert(JSON.stringify(lData.id))
    if (__DEV__) {
      const devMpin = ['1', '2', '3', '4']; // example dev mpin
      setMpin(devMpin);
      setConfirmMpin(devMpin);
    }
  }, []);



  const mpinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const confirmRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const dispatch = useDispatch();

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
      setisLoading(true)
      let params = {
        userid: lData?.id,
        mpin: mpin.join(''),
        confirm_mpin: mpin.join(''),
      }
      // alert(JSON.stringify(params))
      dispatch(setMpinCall(params, (response) => {
        if (response.success) {
        // AsyncStorage.setItem('user_data', JSON.stringify(response));
          setisLoading(false)
          setTimeout(() => {
            // navigation.replace('ServiceSelection');
            navigation.replace('HomeScreen');

          }, 1000);
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        }
        else {
          setisLoading(false)
        ToastAndroid.show(response.message, ToastAndroid.SHORT);

        }
      }));
      // Store securely or send to backend
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
            {
              isLoading ?
                <ActivityIndicator size={wp(10)} />
                :
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
            }

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
