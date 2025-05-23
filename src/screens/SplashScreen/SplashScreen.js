import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Animated, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from '../../utils/utils';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { wp, hp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";

const Splash = () => {

  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const scaleAnim = new Animated.Value(0); // Start with 0 width (closed door)
  async function fnAssignUserData() {
    const userData = await AsyncStorage.getItem('user_data');
    const obj = JSON.parse(userData);

    dispatch({
      type: 'UPDATE_PROFILE_USER_SUCCESS',
      payload: obj
    });
    dispatch({
      type: 'LOGIN_USER_SUCCESS',
      payload: obj
    });
  }

  async function redirect() {
    const userData = await getUserData();
    // navigation.navigate('ChooseLanguage')
    navigation.navigate('HomeScreen')
    // if (userData || isAuthenticated) {
    //   navigation.replace("HomeScreen");
    // } else {
    //   navigation.navigate("LoginScreen");
    // }
  }

  useEffect(() => {
    fnAssignUserData();
    // Door opening animation
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale it to 1 (fully opened)
      duration: 50, // Duration of the animation (2 seconds)
      useNativeDriver: true, // Use native driver for better performance
    }).start();
    const timer = setTimeout(() => {
      redirect();
    }, 2000); // Wait a little longer for the animation to finish

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.doorContent, { transform: [{ scaleX: scaleAnim }] }]}>
        <Image
          resizeMode="contain"
          source={require('../../../src/assets/animations/amigo_hrms_Splash.png')}
          style={[
            {
              height: wp(18),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    width: wp(100),
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  doorContent: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Prevents the image from spilling out during the scale animation
  },
  splashText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Splash;
