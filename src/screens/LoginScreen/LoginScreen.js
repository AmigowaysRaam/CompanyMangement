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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";
import { loginUser } from "../../redux/authActions";
import ButtonComponent from "../../components/Button/Button";
import TextInputComponent from "../../components/TextInput/TextInput";
import Icon from "react-native-vector-icons/Ionicons";
import messaging from '@react-native-firebase/messaging';
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState(__DEV__ ? "admin@gmail.com" : "");
  const [password, setPassword] = useState(__DEV__ ? "1234" : "");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, lerror } = useSelector((state) => state.auth);
  const [fcmtoken, setfcmTorkn] = useState(null);

  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    setUsernameErr('');
    setPasswordErr('');

    if (!username) {
      setUsernameErr('Username must not be empty');
      return;
    }
    if (!password) {
      setPasswordErr('Password must not be empty');
      return;
    }
    setIsLoading(true);
    const credentials = { username, password, fcmtoken };
    // TEMP NAVIGATION – Remove/comment when using real login
    navigation.replace('MobileNumber');
    // Uncomment below when login API is active
    // dispatch(loginUser(credentials, fcmtoken, (response) => {
    //   if (response) {
    //     AsyncStorage.setItem('user_data', JSON.stringify(response));
    //     setIsLoading(false);
    //   } else {
    //     setIsLoading(false);
    //   }
    // }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      AsyncStorage.setItem('username', username);
      AsyncStorage.setItem('password', password);
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (lerror) {
      setIsLoading(false);
      Toast.show({
        text1: lerror,
        type: 'error',
        position: 'top',
      });
    }
  }, [lerror]);

  const handleForgot = () => {
    navigation.navigate("ForgotPassword");
  };

  useEffect(() => {
    const onBackPress = () => true; // disable hardware back
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

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
          <View style={styles.container}>
            <Toast />
            <Image
              resizeMode="contain"
              source={require('../../../src/assets/animations/logo_hrms.png')}
              style={{ width: wp(20), height: wp(20) }}
            />

            <View style={{ margin: wp(3) }}>
              <Text style={[Louis_George_Cafe.regular.h2, { fontFamily: "Louis_George_Cafe_Bold", marginVertical: wp(2) }]}>Hey,</Text>
              <Text style={[Louis_George_Cafe.regular.h2, { fontFamily: "Louis_George_Cafe_Bold", marginVertical: wp(1) }]}>Welcome</Text>
              <Text style={[Louis_George_Cafe.regular.h8, { fontFamily: "Louis_George_Cafe_Bold", color: "#747474", marginVertical: wp(1) }]}>
                Hello there, Login to continue
              </Text>
            </View>

            <View style={{ alignSelf: "center" }}>
              <TextInputComponent
                style={[styles.input, { backgroundColor: COLORS.background }]}
                title="Enter Username or Email"
                value={username}
                onChangeText={setUsername}
              />
              {usernameErr && (
                <Text style={[Louis_George_Cafe.regular.h8, { color: "red", fontFamily: "Louis_George_Cafe_Bold" }]}>
                  {usernameErr}
                </Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInputComponent
                  style={[styles.input, { backgroundColor: COLORS.background }]}
                  title="Password"
                  value={password}
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={wp(6)} color={COLORS.button_bg_color} />
                </TouchableOpacity>
              </View>
              {passwordErr && (
                <Text style={[Louis_George_Cafe.regular.h8, { color: "red", fontFamily: "Louis_George_Cafe_Bold" }]}>
                  {passwordErr}
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={handleForgot} style={{ alignItems: "flex-end", marginHorizontal: wp(4) }}>
              <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.button_bg_color }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={[Louis_George_Cafe.bold.h5, styles.loginButtonText]}>Login</Text>
            </TouchableOpacity>

            {/* Uncomment below for Register screen */}
            {/* <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
              <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.black, marginTop: hp(2) }]}>
                Don't have an account? Register
              </Text>
            </TouchableOpacity> */}
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
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  input: {
    width: wp(90),
    height: hp(6),
    marginTop: 20,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
    color: "#1484CD",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: wp(90),
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
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
    color: '#fff',
  },
});

export default LoginScreen;
