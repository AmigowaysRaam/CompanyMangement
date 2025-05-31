import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../screens/SignIn/SignIn";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import LoginWithMPIN from "../screens/LoginMpin";
import MyProfileUpdate from "../screens/MyProfileUpdate";
import SubCategoryListScreen from "../screens/SubCategoryListing";
import CategoryListScreen from "../screens/CategoryListScreen";
import Employee from "../screens/Employee/Employee";
import PayrollList from "../screens/PayrollList/PayrollList";
import EmplyeeDetails from "../screens/EmployeeDetails/EmployeeDetails";
import SetMpin from "../screens/SetMpin";
import MobileNumber from "../useCurrentLocation";
import CarouselData from "../screens/CarouselData";
import VerifyOtp from "../screens/VerifyOtp";

const Stack = createStackNavigator();
const AuthNavigator = ({ initialRouteName }) => (

  <Stack.Navigator
    initialRouteName={LoginScreen}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignIn" component={SignIn} />
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
    <Stack.Screen name="MyProfileUpdate" component={MyProfileUpdate} />
    <Stack.Screen name="LoginWithMpin" component={LoginWithMPIN} />


  </Stack.Navigator>
);

export default AuthNavigator;
