import React, { useEffect } from "react";
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

import { getSiteSettings } from "../redux/authActions";
import { useTheme } from "../context/ThemeContext";
import { THEMECOLORS } from "../resources/colors/colors";
import { COLORS } from "../resources/Colors";
import { wp, hp } from "../resources/dimensions";
import { Louis_George_Cafe } from "../resources/fonts";

// Screens
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Attendance from "../screens/Attendance/Attendance";
import Employee from "../screens/Employee/Employee";
import PunchInOut from "../screens/PunchInPuchout";

// Local icon map
// import iconMap from "../assets/iconMap";

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

// Dummy tab config array
const tabData = [
  {
    name: "HomeScreen",
    label: "Home",
    iconFilled: "home_filled",
    iconOutline: "home_outline",
    component: HomeScreen,
  },
  {
    name: "Employee",
    label: "Employees",
    iconFilled: "employee_fill",
    iconOutline: "employee_outline",
    component: Employee,
  },
  {
    name: "punchinout",
    label: "",
    icon: "punh_nav", // static icon
    isStatic: true,
    iconSize: wp(9),
    component: PunchInOut,
  },
  {
    name: "Attendance",
    label: "Attendance",
    iconFilled: "attendance_fill",
    iconOutline: "attendance_outline",
    component: Attendance,
  },
  {
    name: "Profile",
    label: "Profile",
    iconFilled: "profile_fill",
    iconOutline: "profile_outline",
    component: ProfileScreen,
  },
];

const TabNavigator = () => {

  const { themeMode } = useTheme();
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (userId) {
      dispatch(getSiteSettings(userId));
    }
  }, [userId]);

  const CustomTabBarButton = (props) => (
    <TouchableOpacity {...props} activeOpacity={1}>
      {props.children}
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentTab = tabData.find((tab) => tab.name === route.name);
        return {
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => {
            const isPunchTab = currentTab?.name === "punchinout";
            const iconSize = isPunchTab ? wp(16) : wp(7);
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
                      height: wp(18),
                      width: wp(18),
                      borderRadius: wp(20),
                      bottom: wp(1),
                    }}
                  />
                )}
                <View style={{
                  position: "absolute",
                  bottom: isPunchTab && focused ? wp(4) : wp(1),
                }}>
                  <Image
                    source={imageSource}
                    style={{
                      width: iconSize,
                      height: iconSize,
                      tintColor: !isPunchTab ? "#fff" : "",
                      marginTop: wp(1),
                      top: isPunchTab ? hp(3) : 0,
                      // bottom: isPunchTab ? wp(2) : wp(4),

                    }}
                    resizeMode="contain"
                  />
                </View>
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
            height: hp(7),
            width: "100%",
            borderColor: THEMECOLORS[themeMode].primaryApp,
            backgroundColor: THEMECOLORS[themeMode].primaryApp,
          },
          tabBarItemStyle: {
            backgroundColor: THEMECOLORS[themeMode].primaryApp,
          },
        };
      }}
    >
      {tabData.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
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
    height: wp(10),
  },
  tabLabel: {
    marginTop: wp(1),
  },
});

export default TabNavigator;
