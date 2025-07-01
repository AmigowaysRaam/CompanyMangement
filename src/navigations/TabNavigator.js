import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { bottomNavigation } from "../redux/authActions";
import { useTheme } from "../context/ThemeContext";
import { THEMECOLORS } from "../resources/colors/colors";
import { COLORS } from "../resources/Colors";
import { wp, hp } from "../resources/dimensions";
import { Louis_George_Cafe } from "../resources/fonts";
import { useFocusEffect } from "@react-navigation/native";

// Screens
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Attendance from "../screens/Attendance/Attendance";
import Employee from "../screens/Employee/Employee";
import PunchInOut from "../screens/PunchInPuchout";

// Local icon map
const iconMap = {
  home_filled: require('../assets/animations/home_filled.png'),
  home_outline: require('../assets/animations/home_outline.png'),
  employee_fill: require('../assets/animations/employee_fill.png'),
  employee_outline: require('../assets/animations/employee_outline.png'),
  attendance_fill: require('../assets/animations/attendance_fill.png'),
  attendance_outline: require('../assets/animations/attendance_outline.png'),
  profile_fill: require('../assets/animations/profile_fill.png'),
  profile_outline: require('../assets/animations/profile_outline.png'),
  punh_nav: require('../assets/animations/punchin.png'),
};

const Tab = createBottomTabNavigator();
// Map backend component strings to actual components
const componentMap = {
  HomeScreen: HomeScreen,
  Employee: Employee,
  PunchInOut: PunchInOut,
  Attendance: Attendance,
  ProfileScreen: ProfileScreen,
};

const TabNavigator = () => {
  const { themeMode } = useTheme();
  const userId = useSelector((state) => state.auth.user?.data?.id);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [bottom, setBottomTab] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(
          bottomNavigation(
            { userId },
            (response) => {
              if (response.success) {
                setBottomTab(response?.data || []);
              }
            }
          )
        );
      }
    }, [userId, dispatch])
  );

  // Render nothing or a loading indicator until bottom tabs load
  if (!bottom || bottom.length === 0) {
    return null;
    // Or: return <LoadingSpinner /> if you have one
  }

  const CustomTabBarButton = (props) => (
    <TouchableOpacity {...props} activeOpacity={1}>
      {props.children}
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentTab = bottom.find((tab) => tab.name === route.name) || {};
        return {
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => {
            const isPunchTab = currentTab?.name === "punchinout";
            const iconSize = isPunchTab ? wp(18) : wp(7);
            const iconKey = currentTab?.isStatic
              ? currentTab.icon
              : focused
                ? currentTab?.iconFilled
                : currentTab?.iconOutline;

            const imageSource = iconMap[iconKey];

            return (
              <View style={styles.iconContainer}>
                {focused && (
                  <View
                    style={{
                      backgroundColor: COLORS.button_bg_color,
                      height: wp(15),
                      width: wp(15),
                      borderRadius: wp(15) / 2,
                      bottom: wp(1),
                      position: "absolute",
                      zIndex: -1,
                    }}
                  />
                )}
                <Image
                  source={imageSource}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    tintColor: !isPunchTab ? "#fff" : undefined,
                    marginTop: wp(1),
                    position: "relative",
                    top: isPunchTab  ? hp(1) : hp(0),
                  }}
                  resizeMode="contain"
                />
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            const label = currentTab?.label || "";
            return (
              <Text
                style={[
                  Louis_George_Cafe.regular.h9,
                  styles.tabLabel,
                  {
                    color: "#fff",
                    fontSize: wp(i18n.language === "ta" ? 1.8 : 2.3),
                    marginTop: wp(1),
                    lineHeight: wp(3),
                  },
                ]}
              >
                {t(label)}
              </Text>
            );
          },
          headerShown: false,
          tabBarStyle: {
            height: hp(8),
            width: "100%",
            borderColor: THEMECOLORS[themeMode].primaryApp,
            backgroundColor: THEMECOLORS[themeMode].primaryApp,
            paddingTop:wp(1.5)
          },
          tabBarItemStyle: {
            // backgroundColor: THEMECOLORS[themeMode].primaryApp,
          },
        };
      }}
    >
      {bottom.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={componentMap[tab.component] || HomeScreen}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(8),
    height: wp(12),
  },
  tabLabel: {
    marginTop: wp(1),
  },
});

export default TabNavigator;
