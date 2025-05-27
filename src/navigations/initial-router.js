import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
// import SignIn from "../screens/SignIn/SignIn";
import TabNavigator from "./TabNavigator";
import Splash from "../screens/SplashScreen/SplashScreen";
import ChooseLanguage from "../screens/ChooseLanguage";
import CarouselData from "../screens/CarouselData";
import MobileNumber from "../screens/MobileNumber";
import VerifyOtp from "../screens/VerifyOtp";
import SetMpin from "../screens/SetMpin";
import ServiceSelectionScreen from "../screens/ServiceSelectionScreen"
import EmplyeeDetails from "../screens/EmployeeDetails/EmployeeDetails";
import PayrollList from "../screens/PayrollList/PayrollList";
import Employee from "../screens/Employee/Employee";
import CategoryListScreen from "../screens/CategoryListScreen";
import SubCategoryListScreen from "../screens/SubCategoryListing";


const Stack = createNativeStackNavigator();
function InitialRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
        options={{ animationEnabled: false }}
      >
        <Stack.Screen name="HomeScreen" component={TabNavigator} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} 
          options={{ animationEnabled: false }}
        />
        <Stack.Screen name="CarouselData" component={CarouselData} />
        <Stack.Screen name="MobileNumber" component={MobileNumber} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="SetMpin" component={SetMpin} />
        <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
        <Stack.Screen name="EmplyeeDetails" component={EmplyeeDetails} />
        <Stack.Screen name="PayrollList" component={PayrollList} />
        <Stack.Screen name="Employee" component={Employee} />
        <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
        <Stack.Screen name="SubCategoryListScreen" component={SubCategoryListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InitialRouter;
