import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import SignIn from "../screens/SignIn/SignIn";
import TabNavigator from "./TabNavigator";
import Splash from "../screens/SplashScreen/SplashScreen";
import ChooseLanguage from "../screens/ChooseLanguage";
import CarouselData from "../screens/CarouselData";
import MobileNumber from "../screens/MobileNumber";
import VerifyOtp from "../screens/VerifyOtp";
import SetMpin from "../screens/SetMpin";
import ServiceSelectionScreen from "../screens/ServiceSelectionScreen"

const Stack = createNativeStackNavigator();
function InitialRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="HomeScreen" component={TabNavigator} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} />
        <Stack.Screen name="CarouselData" component={CarouselData} />
        <Stack.Screen name="MobileNumber" component={MobileNumber} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="SetMpin" component={SetMpin} />
        <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InitialRouter;
