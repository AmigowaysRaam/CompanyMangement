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
import MyProfileUpdate from "../screens/MyProfileUpdate";
import LoginWithMPIN from "../screens/LoginMpin";
import NotificationList from "../screens/Notification";
import AccountSetting from "../screens/AccountSetting";
import SettingsScreen from "../screens/SettingsScreen";
import ChangeMpin from "../screens/changeMpin";
import CompenSationBenifts from "../screens/CompenstaionBeniftsMenu";
import BankDetails from "../screens/BankDetails";
import ChangePassword from "../screens/ChangePassword";
import PayrollHistory from "../screens/PayrollHistory";
import EmployeeList from "../screens/EmployeeList";
import Projects from "../screens/Projects/Projects";
import SearchScreen from "../screens/SearchScreen";
import JobDetails from "../screens/JobDetails";
import ClientScreen from "../screens/ClientScreen";
import FileManager from "../screens/FileManager";
import CreateEmployee from "../screens/CreateEmployee";
import PunchInOut from "../screens/PunchInPuchout";
import LeaveManageMent from "../screens/LeaveManageMent";
import AddLeaveForm from "../screens/AddLeaveForm";
import LoginHistory from "../screens/LoginHistory";
import PayrollDetails from "../screens/PayrollDetails";
import ChatListScreen from "../screens/ChatListScreen";
import CategoryManagement from "../screens/CategoryManagement";
import AddCatgegoryForm from "../screens/AddCatgegoryForm";
import CompanayManagement from "../screens/CompanayManagement.js";
import CreateCompany from "../screens/CreateCompany";
import CreateClient from "../screens/CreateClient";
import AddProjectForm from "../screens/AddProjectForm";
import GroupChatScreen from "../screens/GroupChatScreen";
import TaskManagement from "../screens/TaskManagement";
import CreateTask from "../screens/CreateTask";
import CreateProject from "../screens/CreateProject";
import ProjectDocumentsList from "../screens/ProjectDocumentsList";
import GroupChatScren from "../screens/GroupChatDetails.js";
import GroupChatDetails from "../screens/GroupChatDetails.js";
import AssignedTask from "../screens/AssignedTask";
import SocialMediaScreen from "../screens/SocialMediaScreen";
import RolesManagement from "../screens/RolesManagement";
import CreateRoleandAccess from "../screens/CreateRoleandAccess";


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
        <Stack.Screen name="MyProfileUpdate" component={MyProfileUpdate} />
        <Stack.Screen name="LoginWithMpin" component={LoginWithMPIN} />
        <Stack.Screen name="Notifications" component={NotificationList} />
        <Stack.Screen name="AccountSetting" component={AccountSetting} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="ChangeMpin" component={ChangeMpin} />
        <Stack.Screen name="CompenSationBenifts" component={CompenSationBenifts} />
        <Stack.Screen name="BankDetails" component={BankDetails} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="PayrollHistory" component={PayrollHistory} />
        <Stack.Screen name="EmployeeList" component={EmployeeList} />
        <Stack.Screen name="Projects" component={Projects} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="JobDetails" component={JobDetails} />
        <Stack.Screen name="ClientScreen" component={ClientScreen} />
        <Stack.Screen name="FileManager" component={FileManager} />
        <Stack.Screen name="CreateEmployee" component={CreateEmployee} />
        <Stack.Screen name="PunchInOut" component={PunchInOut} />
        <Stack.Screen name="LeaveManagement" component={LeaveManageMent} />
        <Stack.Screen name="AddLeaveForm" component={AddLeaveForm} />
        <Stack.Screen name="LoginHistory" component={LoginHistory} />
        <Stack.Screen name="PayrollDetails" component={PayrollDetails} />
        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
        <Stack.Screen name="CategoryManagement" component={CategoryManagement} />
        <Stack.Screen name="AddCatgegoryForm" component={AddCatgegoryForm} />
        <Stack.Screen name="CompanyManagement" component={CompanayManagement} />
        <Stack.Screen name="CreateCompany" component={CreateCompany} />
        <Stack.Screen name="CreateClient" component={CreateClient} />
        <Stack.Screen name="AddProjectForm" component={AddProjectForm} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
        <Stack.Screen name="TaskManagement" component={TaskManagement} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="CreateProject" component={CreateProject} />
        <Stack.Screen name="ProjectDocumentsList" component={ProjectDocumentsList} />
        <Stack.Screen name="GroupChatScren" component={GroupChatDetails} />
        <Stack.Screen name="AssignedTask" component={AssignedTask} />
        <Stack.Screen name="SocialMediaScreen" component={SocialMediaScreen} />
        <Stack.Screen name="RolesandPrevilages" component={RolesManagement} />
        <Stack.Screen name="CreateRoleandAccess" component={CreateRoleandAccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InitialRouter;
