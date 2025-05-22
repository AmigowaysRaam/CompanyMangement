import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import Community from "../screens/Community/Community";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getSiteSettings } from "../redux/authActions";
import { COLORS } from "../resources/Colors";
import { wp } from "../resources/dimensions";
import { fontSizes, Louis_George_Cafe } from "../resources/fonts";
import { Image } from "react-native"; // add this at the top

const Tab = createBottomTabNavigator();
const TabNavigator = () => {

  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();

  const CustomTabBarButton = (props) => (
    <TouchableOpacity
      {...props}
      activeOpacity={1} // Disables ripple effect
      style={props.style}
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
                imageSource = require('../assets/animations/home_tab.png');
                break;
              case 'myacctivity':
                imageSource = require('../assets/animations/employee_tan.png');

                break;
              case 'Community':
                imageSource = require('../assets/animations/attedance_tab.png');

                break;
              case 'chat':
                imageSource = require('../assets/animations/profile_tab.png');

                break;
              default:
                imageSource = require('../assets/animations/home_tab.png');
            }
            return (
              <View style={styles.iconContainer}>
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
              case 'myacctivity':
                label = 'Employees';
                break;
              case 'Community':
                label = 'Attendance';
                break;
              case 'chat':
                label = 'Profile';
                break;
              default:
                label = '';
            }
            return (
              <Text
                style={[
                  // Louis_George_Cafe.regular.h9,
                  styles.tababel,
                  { color: '#fff', fontSize: wp(2), marginTop: wp(0.5) },
                ]}
              >
                {label}
              </Text>
            );
          },
          headerShown: false,
          tabBarStyle: {
            height: 60,
            width: '100%', alignItems: "center"
          },
          tabBarItemStyle: {
            backgroundColor: COLORS.button_bg_color,
          },
        };
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="myacctivity" component={Community} />
      <Tab.Screen name="Community" component={HomeScreen} />
      <Tab.Screen name="chat" component={Community} />
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
