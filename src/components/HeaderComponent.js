import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  BackHandler,
  ActivityIndicator
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { wp, hp } from "../resources/dimensions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, Menu } from "react-native-paper";
import { Louis_George_Cafe } from "../resources/fonts";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../context/Language";
import { getLanguageList, setLanguageSelected } from "../redux/authActions";
import { useDispatch, useSelector } from "react-redux";

function HeaderComponent({
  title,
  value,
  onChangeText,
  placeholder,
  openModal,
  showBackArray,
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
      <View style={styles.headerRow}>
        {
          title == 'home' ?
            <>
              <View style={{ flexDirection: "row", marginTop: wp(1) }}>
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
              <View style={{ flexDirection: "row", marginTop: wp(1) }}>
                <TouchableOpacity style={styles.iconButton}
                //  onPress={() => navigation.navigate('LoginWithMpin')}
                >
                  <MaterialCommunityIcons name="calendar" size={hp(3)} color={THEMECOLORS[themeMode].primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
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
                    contentStyle={{ backgroundColor:"#e9e9e9", marginTop: hp(4) }}
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



              </View>
            </>
            :
            <>
              <View style={{ flexDirection: "row" }}>
                {
                  showBackArray &&
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Text style={{ lineHeight: hp(5.1) }}>
                      <MaterialCommunityIcons name="chevron-left" size={hp(3.5)} color={THEMECOLORS[themeMode].primary} />
                    </Text>

                  </TouchableOpacity>
                }
                <Text style={[Louis_George_Cafe.bold.h6, {
                  justifyContent: "center", alignItems: "center", textTransform: 'capitalize', lineHeight: wp(5)
                  , margin: wp(1), marginHorizontal: wp(2), lineHeight: hp(4), color: THEMECOLORS[themeMode].primary
                }]}>
                  {title}
                </Text>
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
    paddingVertical: hp(1),
    borderBottomWidth: wp(0.1), borderColor: "#CCC"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center", marginBottom: hp(1), justifyContent: "space-between", height: wp(9)
  },
  iconButton: {
    marginHorizontal: hp(0.5),
  },
});

export default HeaderComponent;
