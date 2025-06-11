import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";
import TextInputComponent from "../../components/TextInput/TextInput";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { THEMECOLORS } from "../../resources/colors/colors";
import { useTheme } from "../../context/ThemeContext";
import { loginUser } from "../../redux/authActions";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../../context/Language";
import i18n from "../../resources/config/i18";
import { useCurrentLocation } from "../../hooks/location";


const LoginScreen = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { dialCode, location } = useCurrentLocation();
  const { themeMode } = useTheme();
  const { language } = useLanguage();
  const [username, setUsername] = useState(__DEV__ ? "ram@gmail.com" : "");
  const [password, setPassword] = useState(__DEV__ ? "123456" : "");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, lerror } = useSelector((state) => state.auth);
  const [fcmtoken, setfcmTorkn] = useState(null);
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const { t } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const scaleFont = (style) => ({
    ...style,
    fontSize: style?.fontSize ? style.fontSize * (isTamil ? 0.65 : 1) : undefined,
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {

    setUsernameErr('');
    setPasswordErr('');
    let hasError = false;

    if (!username) {
      setUsernameErr('user_name_must_not_be_empty');
      Toast.show({ text1: t('pls_enter_user_name'), type: 'error' });
      hasError = true;
    }

    if (!password) {
      setPasswordErr('pls_enter_password');
      Toast.show({ text1: t('pls_enter_password'), type: 'error' });
      hasError = true;
    }
    if (hasError) return;
    setIsLoading(true);
    const credentials = {
      email: username, password,

      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude
    };
    // alert(JSON.stringify(credentials))
    dispatch(loginUser(credentials, (response) => {
      setIsLoading(false); 
      if (response.success) {
        AsyncStorage.setItem('user_data', JSON.stringify(response));
        Toast.show({
          type: 'success',
          text1: 'Login successful!',
        });
        
        // alert(JSON.stringify(response.data.mpin))
        if (response.data.mpin) {
          setTimeout(() => {
            // navigation.replace('ServiceSelection', response)
            navigation.replace('HomeScreen', response)

          }, 1000);
        }
        else {
          setTimeout(() => {
            navigation.replace('SetMpin', response)
          }, 1000);
        }

      } else {
        Toast.show({
          type: 'error',
          text1: 'Login failed. Please check your credentials.',
        });
      }
    }));
  };

  useEffect(() => {

    // console.log(location?.coords?.latitude,"location")
    // console.log(location?.coords?.longitude,"longitude")

    if (lerror) {
      setIsLoading(false);
      Toast.show({
        text1: lerror,
        type: 'error',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }, [lerror]);

  const handleForgot = () => {
    navigation.navigate("MobileNumber");
  };

  // useEffect(() => {
  //   const onBackPress = () => true; // disable hardware back
  //   BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //   return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  // }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: hp(0) }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            {/* <ThemeToggle /> */}

            <Image
              resizeMode="contain"
              source={require('../../../src/assets/animations/logo_hrms.png')}
              style={{ width: wp(20), height: wp(20) }}
            />

            <View style={{ margin: wp(3) }}>
              <Text
                style={[
                  scaleFont(Louis_George_Cafe.regular.h2),
                  { fontFamily: "Louis_George_Cafe_Bold", marginVertical: wp(2), color: THEMECOLORS[themeMode].primary }
                ]}
              >
                {t('hey')}
              </Text>

              <Text
                style={[
                  scaleFont(Louis_George_Cafe.regular.h2),
                  { fontFamily: "Louis_George_Cafe_Bold", marginVertical: wp(1), color: THEMECOLORS[themeMode].primary }
                ]}
              >
                {t('welcome')}
              </Text>

              <Text
                style={[
                  scaleFont(Louis_George_Cafe.regular.h8),
                  {
                    fontFamily: "Louis_George_Cafe_Bold",
                    color: THEMECOLORS[themeMode].primary,
                    marginVertical: wp(1),
                  }
                ]}
              >
                {t('hey_there_login_to_continue')}
              </Text>
            </View>

            <View style={{ alignSelf: "center" }}>
              <TextInput
                editable={!isLoading}
                style={[styles.input, {
                  backgroundColor: THEMECOLORS[themeMode].viewBackground, borderColor: THEMECOLORS[themeMode].textPrimary,
                  color: THEMECOLORS[themeMode].textPrimary
                }]}
                title={t('enter_username_or_email')}
                value={username}
                onChangeText={setUsername}
                placeholder={t('enter_username_or_email')}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
              />
              {usernameErr && (
                <Text
                  style={[
                    scaleFont(Louis_George_Cafe.regular.h8),
                    { color: "red", fontFamily: "Louis_George_Cafe_Bold" }
                  ]}
                >
                  {t(usernameErr)}
                </Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  editable={!isLoading}
                  style={[styles.input, {
                    backgroundColor: THEMECOLORS[themeMode].viewBackground, borderColor: THEMECOLORS[themeMode].textPrimary,
                    color: THEMECOLORS[themeMode].textPrimary
                  }]}
                  placeholder={t('password')}
                  value={password}
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={setPassword}
                  placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={wp(6)} color={THEMECOLORS[themeMode].textPrimary} />
                </TouchableOpacity>
              </View>
              {passwordErr && (
                <Text
                  style={[
                    scaleFont(Louis_George_Cafe.regular.h8),
                    { color: "red", fontFamily: "Louis_George_Cafe_Bold" }
                  ]}
                >
                  {t(passwordErr)}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => handleForgot()} style={{ alignItems: "flex-end", marginTop: hp(1), marginHorizontal: wp(4) }}>
              <Text
                style={[
                  scaleFont(Louis_George_Cafe.regular.h7),
                  { color: THEMECOLORS[themeMode].primary, lineHeight: wp(5), marginTop: wp(1) }
                ]}
              >
                {t('login_withmobileno')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => { handleLogin() }}
            >
              <Text
                style={[
                  scaleFont(Louis_George_Cafe.bold.h5),
                  styles.loginButtonText
                ]}
              >
                {isLoading ? <><ActivityIndicator color={'#FFF'} /></> :
                  t('login')}
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
    padding: wp(3),
    justifyContent: "center",
  },
  input: {
    width: wp(90),
    height: hp(6),
    marginTop: 20,
    borderWidth: 1,
    borderRadius: wp(10), paddingHorizontal: wp(5)
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: wp(90),
  },
  eyeIcon: {
    position: "absolute",
    right: wp(5),
    bottom: wp(3)
  },
  loginButton: {
    width: wp(90),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
    alignSelf: "center",
    borderRadius: wp(3),
    backgroundColor: COLORS.button_bg_color,
  },
  loginButtonText: {
    color: '#fff', lineHeight: wp(10)
  },
});

export default LoginScreen;
