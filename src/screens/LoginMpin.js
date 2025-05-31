import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard,
  Image,
  ToastAndroid
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithMpin } from '../redux/authActions';
import { useCurrentLocation } from '../../src/hooks/location';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';

const LoginWithMPIN = () => {

  const [mpinDigits, setMpinDigits] = useState(__DEV__ ? ['1', '2', '3', '4'] : ['', '', '', '']);
  const { themeMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const userdata = useSelector((state) => state.auth.user);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const item = route.params;

  const handleChange = (text, index) => {
    if (!/^\d?$/.test(text)) return;

    const newDigits = [...mpinDigits];
    newDigits[index] = text;
    setMpinDigits(newDigits);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !mpinDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    // alert(JSON.stringify(item?.response?.userid))
  }, [])

  const handleMovetoLogin = () => {
    navigation.navigate('MobileNumber')
  }

  const handleloginwithusername = () => {
    navigation.navigate('LoginScreen')
  }

  const handleMpinLogin = () => {
    const mpin = mpinDigits.join('');
    if (mpin.length !== 4) return;
    setIsLoading(true);
    const params = {
      userid: userdata?.data?.id || item?.response?.userid,
      mpin: mpinDigits.join('')
    };
    // alert(JSON.stringify(params))
    dispatch(loginWithMpin(params, (response) => {
      setIsLoading(false);
      if (response) {
        if (response.success) {
          // navigation.replace('HomeScreen');
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'HomeScreen',
              },
            ],
          });
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
        }
      }
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={[styles.container, {
            backgroundColor: THEMECOLORS[themeMode].background,
          }]}>
            {/* <ThemeToggle /> */}
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={require('../assets/animations/loginmpin.png')}
                style={{ width: wp(75), height: hp(45), margin: wp(2) }}
              />
            </View>
            <Text style={[Louis_George_Cafe.regular.h8, {
              alignSelf: "center",
              margin: wp(2),
              textAlign: 'center', color: THEMECOLORS[themeMode].textPrimary
            }]}>
              {t(`Your MPIN keeps your account safe 
                Never share it with anyone`)}
            </Text>

            <Text style={[Louis_George_Cafe.bold.h5, { alignSelf: "center", color: THEMECOLORS[themeMode].textPrimary }]}>
              {t('enterMpin')}
            </Text>

            {/* 4 Digit Square Boxes */}
            <View style={styles.mpinBoxContainer}>
              {mpinDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => inputRefs.current[index] = ref}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[Louis_George_Cafe.bold.h4, styles.mpinBox, isTamil && { fontSize: wp(6) }]}
                  // secureTextEntry
                  editable={!isLoading}
                />
              ))}
            </View>
            {
              isLoading ?
                <ActivityIndicator size={hp(4)} style={{ marginTop: hp(3) }} color={THEMECOLORS[themeMode].textPrimary} />
                :
                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: mpinDigits.join('').length == 4 ? COLORS.button_bg_color : COLORS.timestamp }]}
                  onPress={handleMpinLogin}
                  disabled={mpinDigits.join('').length !== 4}
                >
                  <Text style={[Louis_George_Cafe.bold.h5, styles.loginButtonText]}>
                    {t('login')}
                  </Text>
                </TouchableOpacity>
            }
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity
                onPress={() => handleloginwithusername()}
              >
                <Text style={[Louis_George_Cafe.regular.h7, { alignSelf: "center", marginVertical: hp(4), color: THEMECOLORS[themeMode].textPrimary, textDecorationLine: "underline" }]}>
                  {t('loginwithusername')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMovetoLogin()}
              >
                <Text style={[Louis_George_Cafe.regular.h7, { alignSelf: "center", marginVertical: hp(4), color: THEMECOLORS[themeMode].textPrimary, textDecorationLine: "underline" }]}>
                  {t('forget_mpin') + '?'}
                </Text>
              </TouchableOpacity>
            </View>



          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
    paddingTop: hp(5),
    paddingBottom: hp(10),
    paddingHorizontal: wp(5),
  },
  mpinBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(3),
    paddingHorizontal: wp(10),
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: wp(3),
  },
  mpinBox: {
    width: wp(14),
    height: wp(14),
    borderWidth: 1,
    borderColor: '#D7E3FF',
    borderRadius: wp(2),
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#D7E3FF',
  },
  loginButton: {
    width: '65%',
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
    borderRadius: wp(5),
    alignSelf: "center",
  },
  loginButtonText: {
    color: '#fff',
  },
});

export default LoginWithMPIN;
