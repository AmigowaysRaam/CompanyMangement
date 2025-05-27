import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../screens/SignIn/SignIn";
import LoginScreen from "../screens/LoginScreen/LoginScreen";

const Stack = createStackNavigator();
const AuthNavigator = ({ initialRouteName }) => (
  
  <Stack.Navigator
    initialRouteName={LoginScreen}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignIn" component={SignIn} />
  </Stack.Navigator>
);

export default AuthNavigator;
