import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VersionCheck from 'react-native-version-check';

import { wp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { getSiteSettingsFrom } from "../../redux/authActions";
import { useTheme } from "../../context/ThemeContext";
import UpgradeModal from "../UpgradeModal";

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { themeMode } = useTheme();

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [storeUrl, setStoreUrl] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const userData = useSelector((state) => state.auth.user);

  // 1. VERSION CHECK
  const checkAppVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion();
      const currentVersion = VersionCheck.getCurrentVersion();
      const updateNeeded = VersionCheck.needUpdate({ currentVersion, latestVersion });
      if (updateNeeded?.isNeeded) {
        setShowUpgrade(true);
        const url = await VersionCheck.getStoreUrl();
        setStoreUrl(url);
      }
      else {
        setShowUpgrade(false);
      }
    } catch (error) {
      console.log('Version check failed:', error);
    }
  };

  // 2. REDIRECT USER TO HOME OR LANGUAGE SCREEN
  const redirect = async () => {
    if (!showUpgrade) {
      const userData = await AsyncStorage.getItem('user_data');
      // const obj = JSON.parse(userData);
      // alert(JSON.stringify(obj.data))
      if (userData) {
        const obj = JSON.parse(userData);
        dispatch({ type: 'APP_USER_LOGIN_SUCCESS', payload: obj });
        if (obj.data.mpin) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginWithMpin' }],
          });
        }
        else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        }

      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ChooseLanguage' }],
        });
      }
    }
  };

  // 3. LOAD SITE SETTINGS FROM STORAGE OR API
  const checkAndFetchSiteSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('site_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'APP_SITE_SETTINGS_SUCCESS', payload: { data: parsed } });
        setTimeout(redirect, 1000);
      } else {
        fetchSiteSettings();
      }
    } catch (err) {
      console.error('Error accessing AsyncStorage:', err);
      fetchSiteSettings();
    }
  };

  const fetchSiteSettings = () => {
    dispatch(getSiteSettingsFrom((response) => {
      if (response?.data) {
        AsyncStorage.setItem('site_settings', JSON.stringify(response.data))
          .then(() => {
            dispatch({ type: 'APP_SITE_SETTINGS_SUCCESS', payload: { data: response.data } });
            setTimeout(redirect, 1000);
          })
          .catch(err => console.error('Failed to save site settings:', err));
      }
    }));
  };

  // 4. SPLASH ANIMATION
  const startSplashAnimation = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 5. INIT EFFECTS
  useEffect(() => {
    // checkAppVersion();
    checkAndFetchSiteSettings();
    startSplashAnimation();
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

      <UpgradeModal
        visible={showUpgrade}
        onUpdatePress={() => {
          setShowUpgrade(false);
          if (storeUrl) Linking.openURL(storeUrl);
        }}
        onLaterPress={() => setShowUpgrade(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: wp(100),
    backgroundColor: COLORS.background,
  },
  doorContent: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default Splash;
