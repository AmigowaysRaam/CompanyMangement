import React, { useEffect, useState } from "react";
import {
    Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image,
    FlatList, ImageBackground, ActivityIndicator,
} from "react-native";
import { hp, wp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import { Louis_George_Cafe } from "../resources/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ThemeToggle from "../ScreenComponents/HeaderComponent/ThemeToggle";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getSideMenus } from "../redux/authActions";
import _ from 'lodash';
import LogoutModal from "../components/LogoutPop";
import { useTranslation } from "react-i18next";
import VersionCheck from 'react-native-version-check';


const HomeScreenModal = ({ visible, onClose, children, title, }) => {
    // Track which menus are expanded for submenu
    const [expandedMenus, setExpandedMenus] = useState({});
    const navigation = useNavigation();
    const { themeMode, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const userdata = useSelector((state) => state.auth.user);
    const sideMenusArray = useSelector((state) => state.auth.sidemenu);
    const dispatch = useDispatch();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [sideMenusList, setsideMenusList] = useState(sideMenusArray ? sideMenusArray?.data : []);
    const [isLoading, setisLoading] = useState(false);
    // Toggle expand/collapse submenu for a menu index

    const toggleExpand = (index) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    useEffect(() => {
        dispatch(getSideMenus(userdata?.data?.id))
        setsideMenusList(sideMenusArray?.data)
        if (_.isEmpty(sideMenusArray?.data)) {
            setisLoading(true)
            dispatch(getSideMenus(userdata?.data?.id, (response) => {
                if (response.success) {
                    setisLoading(false)
                    setsideMenusList(response.data)
                    console.log('test', response.data)
                } else {
                    setsideMenusList(sideMenusArray ? sideMenusArray : [])
                    setisLoading(true)
                }
            }));
        }

    }, [userdata?.data?.id])

    const handleNavigateScreen = (item) => {
        const routes = {
            'My Profile': 'Profile',
            'Notifications': 'Notifications',
            'Attendance & Leave': 'Attendance',
            'Compensation & Benefits': 'CompenSationBenifts',
            'Settings': 'SettingsScreen',
        };

        const route = routes[item];
        if (route) {
            navigation.navigate(route);
        }
    };

    // Render submenu item
    const renderSubmenuItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                // item.onPress();
                handleNavigateScreen(item.label)
                onClose();
            }}
            style={styles.submenuItem}
        >
            <Text style={[Louis_George_Cafe.regular.h8, { color: THEMECOLORS[themeMode].textPrimary }]}>
                {item.label}
            </Text>
            <MaterialCommunityIcons
                name={"arrow-right"}
                size={hp(2.5)}
                color={THEMECOLORS[themeMode].textPrimary}
            />
        </TouchableOpacity>
    );

    // Render main menu item, with optional submenu
    const renderMenuItem = ({ item, index }) => {
        const hasSubmenu = Array.isArray(item.submenus) && item.submenus.length > 0;
        const isExpanded = expandedMenus[index];

        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        if (hasSubmenu) {
                            toggleExpand(index);
                        } else {
                            onClose(),
                                handleNavigateScreen(item.label)
                        }
                    }}
                    style={styles.menuItem}
                >
                    <Text style={[Louis_George_Cafe.regular.h7, {
                        lineHeight: wp(5),
                        color: THEMECOLORS[themeMode].textPrimary
                    }]}>{t(item.label)}</Text>
                    <MaterialCommunityIcons
                        name={hasSubmenu ? (isExpanded ? "chevron-up" : "chevron-down") : "chevron-right"}
                        size={hp(3)}
                        color={THEMECOLORS[themeMode].textPrimary}
                    />
                </TouchableOpacity>
                {/* Render submenu if expanded */}
                {hasSubmenu && isExpanded && (
                    <FlatList
                        data={item.submenus}
                        keyExtractor={(subItem, subIndex) => `${index}-${subIndex}`}
                        renderItem={renderSubmenuItem}
                        scrollEnabled={false}
                        style={{ marginLeft: wp(8), backgroundColor: THEMECOLORS[themeMode].background }}
                    />
                )}
            </View>
        );
    };
    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={[{
                        backgroundColor: THEMECOLORS[themeMode].background,
                    }, styles.modalBox]}>
                        <ImageBackground
                            source={require("../../src/assets/animations/profile_bg.png")}
                            resizeMode="stretch"
                            style={{ width: "100%", height: hp(42) }}
                        >

                            <ThemeToggle />
                            <View style={{ width: "100%", height: hp(32), alignItems: "center" }}>
                                <TouchableOpacity style={{ marginVertical: hp(4) }} onPress={() => {
                                    onClose()
                                    navigation.navigate('MyProfileUpdate')
                                }
                                } >
                                    <Image
                                        source={require("../assets/animations/user_1.png")}
                                        style={{ width: wp(35), height: wp(35), borderRadius: wp(25) }}
                                    />
                                    <MaterialCommunityIcons
                                        name="pencil-outline"
                                        size={wp(7)}
                                        color={COLORS.button_bg_color}
                                        style={{ alignSelf: "flex-end", position: "relative", bottom: hp(3), right: hp(2), backgroundColor: THEMECOLORS[themeMode].white, borderRadius: wp(5), padding: wp(0.5) }}
                                    />
                                </TouchableOpacity>
                                <View style={{ position: "relative", bottom: wp(10) }} >
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            Louis_George_Cafe.bold.h5,
                                            { alignSelf: "center", maxWidth: wp(60), color: THEMECOLORS[themeMode].white, alignSelf: "center" }
                                        ]}
                                    >
                                        {userdata?.data?.full_name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            Louis_George_Cafe.regular.h7,
                                            { alignSelf: "center", color: THEMECOLORS[themeMode].white, textTransform: "capitalize" },
                                        ]}
                                    >
                                        {userdata?.data?.designation}
                                    </Text>
                                </View>
                            </View>
                        </ImageBackground>
                        {/* Menu list */}
                        <View style={{ marginVertical: hp(2), flex: 1, paddingHorizontal: wp(2) }}>
                            {
                                isLoading ?
                                    <ActivityIndicator size={wp(10)} style={{ marginVertical: wp(10) }} color={THEMECOLORS[themeMode].textPrimary} />
                                    :
                                    <FlatList
                                        data={sideMenusList}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderMenuItem}
                                        scrollEnabled
                                        showsVerticalScrollIndicator={false}
                                    />
                            }
                        </View>
                        <View
                            style={{
                                margin: hp(2),
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <TouchableOpacity style={[styles.logoutBtn, {
                                backgroundColor: THEMECOLORS[themeMode].buttonBg
                            }]}
                                // onPress={() => handleLogout()}
                                onPress={() => {
                                    setShowLogoutModal(true)
                                    // onClose()
                                }
                                }

                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.bold.h7,
                                        { alignSelf: "center", color: THEMECOLORS[themeMode].buttonText, lineHeight: wp(5) },
                                    ]}
                                >
                                    {t('log_out')}
                                </Text>
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={wp(4)}
                                    color={THEMECOLORS[themeMode].buttonText}
                                />
                            </TouchableOpacity>
                            <Text
                                numberOfLines={1}
                                style={[
                                    Louis_George_Cafe.bold.h9,
                                    { alignSelf: "center", color: THEMECOLORS[themeMode].primary },
                                ]}
                            >
                                {`V.${VersionCheck?.getCurrentVersion()}` || ''}
                            </Text>
                        </View>
                    </View>
                    {showLogoutModal &&
                        <LogoutModal
                            isVisible={showLogoutModal}
                            onCancel={() => setShowLogoutModal(false)}
                        />
                    }
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-start",
    },
    logoutBtn: {
        width: wp(30),
        height: wp(9),
        // backgroundColor: COLORS.button_bg_color,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: wp(5),
        paddingHorizontal: wp(2),
        flexDirection: "row",
    },
    modalBox: {
        width: wp(85),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        height: "100%",
        overflow: "hidden",
        borderTopEndRadius: wp(10),
    },
    menuItem: {
        paddingVertical: wp(5),
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp(4),
    },
    submenuItem: {
        flexDirection: "row", justifyContent: "space-between",
        paddingVertical: wp(2.5),
        paddingHorizontal: wp(4),
    },
});

export default HomeScreenModal;
