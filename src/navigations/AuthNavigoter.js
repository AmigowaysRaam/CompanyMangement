import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import SignIn from "../screens/SignIn/SignIn";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();

const AuthNavigator = ({ initialRouteName }) => (
  
  <Stack.Navigator
    initialRouteName={LoginScreen}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
