import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  BackHandler,
  ActivityIndicator,
  Animated
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { wp, hp } from "../resources/dimensions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, Menu } from "react-native-paper";
import { Louis_George_Cafe, width } from "../resources/fonts";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../context/Language";
import { getLanguageList, setLanguageSelected } from "../redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../ScreenComponents/HeaderComponent/ThemeToggle";

function HeaderComponent({
  title,
  value,
  onChangeText,
  placeholder,
  openModal,
  showBackArray,
  working,
  onTitleClick,
  chatCount,
  titleAlign,
  ...props
}) {
  const navigation = useNavigation();
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const langugelist = useSelector((state) => state.auth?.langugelistArray?.data);

  const { language, setLanguage } = useLanguage();
  const dispatch = useDispatch();
  const [languagesList, setSelectedLanguageList] = useState(langugelist ? langugelist : []);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const slideAnim = React.useRef(new Animated.Value(-200)).current; // Start off-screen to the left

  const fnchangeLanguage = (langCode, flag) => {
    setLanguage(langCode); // Update context (if using Context API)
    dispatch(setLanguageSelected(langCode, (response) => {
      if (response.success && response.data) {
        const translations = response.data;
        i18n.addResourceBundle(
          langCode,          // e.g., 'fr'
          'translation',     // Namespace
          translations,      // JSON object with translations
          true,              // Deep merge
          true               // Overwrite existing
        );
        // Change the language
        i18n.changeLanguage(langCode);
        if (flag) {
          ToastAndroid.show(`Language switched to ${langCode}`, ToastAndroid.SHORT);
        }
      } else {
        // console.warn('Translation response is invalid or missing data.');
      }
    }));

    i18n.changeLanguage(langCode);
    closeMenu();
  };
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500, // duration of the animation
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent back action
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );



  useEffect(() => {
    dispatch(getLanguageList)
    if (languagesList?.length == 0) {
      setLoading(true)
      dispatch(getLanguageList((response) => {
        if (response.success) {
          setLoading(false)
          setSelectedLanguageList(response.data)
        }
        else {
          setLoading(false)
        }
      }));
    }
  }, [language])

  useEffect(() => {
    fnchangeLanguage(language, false)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent back action
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <View style={[styles.container, {
      backgroundColor: THEMECOLORS[themeMode].background,
    }]}>
      <View style={[title == 'home' ? styles.headerRow : {}]}>
        {
          title == 'home' ?
            <>
              <View style={{ flexDirection: "row" }}>

                <TouchableOpacity onPress={openModal} style={styles.iconButton}>
                  <MaterialCommunityIcons name="menu" size={hp(3.5)} color={THEMECOLORS[themeMode].primary} />
                </TouchableOpacity>
                <TouchableOpacity >
                  <Image
                    source={require('../assets/animations/logo_hrms.png')}
                    style={{ width: hp(3.5), height: hp(3.5), borderRadius: hp(3.5 / 2) }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: "center", alignItems: "center", marginHorizontal: wp(2) }}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('SearchScreen')}>
                  <MaterialCommunityIcons name="magnify" size={hp(3)} color={THEMECOLORS[themeMode].primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() =>
                  navigation.navigate('Notifications')
                }>
                  <MaterialCommunityIcons name="bell-outline" size={hp(3)} color={THEMECOLORS[themeMode].primary} />
                </TouchableOpacity>
                {languagesList.length != 0 &&
                  <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
                        {isLoading ?
                          <ActivityIndicator
                            size={hp(3)}
                            color={THEMECOLORS[themeMode].primary}
                          />
                          :
                          <MaterialCommunityIcons
                            name={"translate"}
                            size={hp(3)}
                            color={THEMECOLORS[themeMode].primary}
                          />
                        }
                      </TouchableOpacity>
                    }
                    contentStyle={{ backgroundColor: "#e9e9e9", marginTop: hp(4) }}
                  >
                    {languagesList.map((lang) => (
                      <Menu.Item
                        key={lang.code}
                        onPress={() => fnchangeLanguage(lang.code, true)}
                        title={lang.nativeName}
                        titleStyle={{ color: language == lang.code ? THEMECOLORS[themeMode].primaryApp : "#000", fontWeight: language == lang.code ? "900" : null, fontSize: wp(language == lang.code ? 4 : 3) }}
                      />
                    ))}
                  </Menu>
                }
                <TouchableOpacity onPress={() =>
                  navigation.navigate('ChatListScreen')
                } style={{ flexDirection: "row" }}>
                  <View style={styles.iconButton} >
                    <MaterialCommunityIcons name="chat-outline" size={hp(3)} color={THEMECOLORS[themeMode].primary} />
                  </View>
                  {chatCount && chatCount > 0 &&
                    <View style={{ width: wp(5), justifyContent: "center", backgroundColor: '#ff0000', height: wp(5), borderRadius: wp(2.5), alignItems: "center", position: "absolute", left: wp(5.5), bottom: wp(3) }}>
                      <Text style={[Louis_George_Cafe.bold.h9, { fontWeight: "500", color: "#FFF" }]}>{chatCount > 99 ? '99+' : chatCount}</Text>
                    </View>
                  }
                  </TouchableOpacity>
              </View>
            </>
            :
            <>
              <View style={{ flexDirection: "row" }}>
                {
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconutton}>
                    <Text style={{ lineHeight: hp(4), marginRight: wp(2) }}>
                      <MaterialCommunityIcons
                        name={showBackArray && titleAlign == 'center' ? "close" : "chevron-left"} size={hp(3.5)} color={THEMECOLORS[themeMode].primary} />
                    </Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={onTitleClick}>
                  {/* <Animated.View style={{ transform: [{ translateX: slideAnim }] }}> */}
                  <View style={{ width: wp(75), alignItems: titleAlign }}>
                    <Text style={[Louis_George_Cafe.bold.h6, {
                      justifyContent: "center",
                      alignItems: "center",
                      textTransform: 'capitalize',
                      margin: wp(1),
                      marginHorizontal: wp(2),
                      lineHeight: hp(3),
                      color: THEMECOLORS[themeMode].primary
                    }]}>
                      {title}
                    </Text>
                  </View>
                  {/* </Animated.View> */}
                </TouchableOpacity>
                {/* onTitleClick */}

              </View>

            </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: wp(0.2),
    borderColor: "#CCC",
    marginBottom: wp(0.1), width: wp(100)
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center", justifyContent: "space-between", height: wp(9),
  },
  iconButton: {
    marginHorizontal: hp(0.5),
  },
});

export default HeaderComponent;
