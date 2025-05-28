import React, { useEffect } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { wp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { getSiteSettingsFrom } from "../../redux/authActions";
import { useTheme } from "../../context/ThemeContext";

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { themeMode } = useTheme();
  const scaleAnim = new Animated.Value(0);
  const getFrontSiteData = useSelector((state) => state.auth.getFrontSite);
  // Assign user data to redux store
  async function fnAssignUserData() {
    const userData = await AsyncStorage.getItem('user_data');
    // alert(userData)
    if (userData) {
      const obj = JSON.parse(userData);
      dispatch({ type: 'APP_USER_LOGIN_SUCCESS', payload: obj });
    }
  }
  const redirect = async () => {

    const userData = await AsyncStorage.getItem('user_data');
    // alert(userData)
    if (userData) {
      const obj = JSON.parse(userData);
      dispatch({ type: 'APP_USER_LOGIN_SUCCESS', payload: obj });
      navigation.reset({
        index: 0,
        // routes: [{ name: 'ChooseLanguage' }],
        routes: [{ name: 'HomeScreen' }],
      });

    }
    else {
      navigation.reset({
        index: 0,
        // routes: [{ name: 'ChooseLanguage' }],
        routes: [{ name: 'ChooseLanguage' }],
      });
    }
  };

  // Fetch site settings either from AsyncStorage or API
  const checkAndFetchSiteSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('site_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'APP_SITE_SETTINGS_SUCCESS', payload: { data: parsed } });
        setTimeout(() => {
          redirect();
        }, 1000);
      } else {
        fetchSiteSettings();
      }
    } catch (err) {
      console.error('Error accessing AsyncStorage:', err);
      fetchSiteSettings();
    }
  };

  const fetchSiteSettings = () => {
    dispatch(
      getSiteSettingsFrom((response) => {
        if (response?.data) {
          AsyncStorage.setItem('site_settings', JSON.stringify(response.data))
            .then(() => {
              dispatch({ type: 'APP_SITE_SETTINGS_SUCCESS', payload: { data: response.data } });
              setTimeout(() => {
                redirect();

              }, 1000);
            })
            .catch((err) => {
              console.error('Failed to save site settings:', err);
            });
        }
      })
    );
  };

  useEffect(() => {
    // fnAssignUserData();
    checkAndFetchSiteSettings();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.doorContent, { transform: [{ scaleX: scaleAnim }] }]}>
        <Image
          resizeMode="contain"
          source={require('../../../src/assets/animations/amigo_hrms_Splash.png')}
          style={{ height: wp(18) }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    width: wp(100),
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  doorContent: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default Splash;
