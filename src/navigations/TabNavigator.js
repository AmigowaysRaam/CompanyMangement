import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, ToastAndroid } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Attendance from "../screens/Attendance/Attendance";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getSiteSettings } from "../redux/authActions";
import { COLORS } from "../resources/Colors";
import { hp, wp } from "../resources/dimensions";
import { fontSizes, Louis_George_Cafe } from "../resources/fonts";
import { Image } from "react-native"; // add this at the top
import Employee from "../screens/Employee/Employee";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  // const [exitApp, setExitApp] = useState(false);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       if (exitApp) {
  //         BackHandler.exitApp();
  //       } else {
  //         ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
  //         setExitApp(true);
  //         setTimeout(() => setExitApp(false), 2000);
  //       }
  //       return true; // prevent default behavior
  //     };

  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //     return () => backHandler.remove();
  //   }, [exitApp])
  // );



  const { themeMode } = useTheme();

  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const CustomTabBarButton = (props) => (
    <TouchableOpacity
      {...props}
      activeOpacity={1} // Disables ripple effect
      style={[props.style, {
      }]}
    >
      {props.children}
    </TouchableOpacity>
  );

  useEffect(() => {
    if (userId) {
      dispatch(getSiteSettings(userId));
    }
  }, [userId]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ focused }) => {
            let imageSource;
            switch (route.name) {
              case 'HomeScreen':
                imageSource = focused
                  ? require('../assets/animations/home_filled.png')
                  : require('../assets/animations/home_outline.png');
                break;
          
              case 'Employee':
                imageSource = focused
                  ? require('../assets/animations/employee_fill.png')
                  : require('../assets/animations/employee_outline.png'); // ✅ fixed typo "emplyee"
                break;
          
              case 'Attendance':
                imageSource = focused
                  ? require('../assets/animations/attendance_fill.png')
                  : require('../assets/animations/attendance_outline.png');
                break;
          
              case 'Profile':
                imageSource = focused
                  ? require('../assets/animations/profile_fill.png')
                  : require('../assets/animations/profile_outline.png');
                break;
          
              default:
                imageSource = require('../assets/animations/home_tab.png');
            }
            return (
              <View style={[styles.iconContainer,]}>
                {focused && (
                  <View
                    style={{
                      backgroundColor: COLORS.button_bg_color,
                      height: wp(14),
                      width: wp(14),
                      borderRadius: wp(20),
                      bottom: wp(1),
                    }}
                  />
                )}
                <View style={{ position: 'absolute' }}>
                  <Image
                    source={imageSource}
                    style={{ width: wp(6), height: wp(6), tintColor: '#fff', marginTop: wp(1) }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            let label;
            switch (route.name) {
              case 'HomeScreen':
                label = 'Home';
                break;
              case 'Employee':
                label = 'Employees';
                break;
              case 'Attendance':
                label = 'Attendance';
                break;
              case 'Profile':
                label = 'Profile';
                break;
              default:
                label = '';
            }
            return (
              <Text
                style={[
                  Louis_George_Cafe.regular.h9,
                  styles.tababel,
                  { color: '#fff', fontSize: wp(i18n.language == 'ta' ? 2 : 2.5), marginTop: wp(1), lineHeight: wp(3) },
                ]}
              >
                {t(label)}
              </Text>
            );
          },
          headerShown: false,
          tabBarStyle: {
            height: hp(7),
            width: '100%', borderColor: THEMECOLORS[themeMode].primaryApp
          },
          tabBarItemStyle: {
            backgroundColor: THEMECOLORS[themeMode].primaryApp
          },
        };
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Employee" component={Employee} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center", justifyContent: 'center',
    width: wp(8), height: wp(10)
  },
  tabLabel: {
    marginTop: wp(1),
  },
  activeTabIndicator: {
    width: "30%",
    height: 10,
    position: "absolute",
    bottom: 0,
    // backgroundColor: COLORS.button_bg_color,
  },
});

export default TabNavigator;
