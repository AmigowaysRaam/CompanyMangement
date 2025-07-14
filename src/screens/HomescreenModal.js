import React, { useEffect, useRef, useState } from "react";
import {
    // Modal,
    View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
    FlatList,
} from "react-native";
import { hp, wp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import { Louis_George_Cafe } from "../resources/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getSideMenus } from "../redux/authActions";
import _ from 'lodash';
import LogoutModal from "../components/LogoutPop";
import { useTranslation } from "react-i18next";
import VersionCheck from 'react-native-version-check';
import Modal from 'react-native-modal';
import ProfileHeader from "../components/ModalProfileHeader";

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
    const [showDownArrow, setShowDownArrow] = useState(true);

    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20; // 20px buffer
        setShowDownArrow(!isAtBottom);
    };

    const flatListRef = useRef(null); // <-- Step 1: Create ref
    const handleScrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true }); // <-- Step 2: Scroll to end
        }
    };
    // Toggle expand/collapse submenu for a menu index
    const toggleExpand = (index) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    
    useEffect(() => {
        dispatch(getSideMenus(userdata?.data?.id));
        setsideMenusList(sideMenusArray?.data);
        if (_.isEmpty(sideMenusArray?.data)) {
            setisLoading(true);
            dispatch(getSideMenus({ userid: userdata?.data?.id }, (response) => {
                if (response.success) {
                    // alert(JSON.stringify(response))
                    setisLoading(false);
                    setsideMenusList(response.data);
                    setExpandedMenus(expandAllMenusWithSubmenus(response.data)); // 👈 auto expand
                } else {
                    setsideMenusList(sideMenusArray ? sideMenusArray : []);
                    setisLoading(false);
                }
            }));
        } else {
            setExpandedMenus(expandAllMenusWithSubmenus(sideMenusArray?.data)); // 👈 in case it's already available
        }
    }, [userdata?.data?.id]);

    const handleNavigateScreen = (item) => {
        const routes = {
            'My Profile': 'Profile',
            'Notifications': 'Notifications',
            'Attendance & Leave': 'Attendance',
            'Compensation & Benefits': 'CompenSationBenifts',
            'Settings': 'SettingsScreen',
            'Job Details': 'JobDetails',
            'Client': 'ClientScreen',
            'Files': 'FileManager',
            'Leave': 'LeaveManagement',
            'Project': 'Projects',
            'Payroll': 'PayrollDetails',
            'Category Management': 'CategoryManagement',
            'Company Management': 'CompanyManagement',
            'Social Connect': 'SocialMediaScreen',
            'Roles & Privileges': 'RolesandPrevilages',
            'Chats': 'ChatListScreen',
            'Home': "HomeScreen",
            'Project Management': 'Projects',
            'Task': 'AssignedTask',
            'All Employees': "EmployeeList",
            'Companies': 'CompanyManagement',
            'Task Management': 'TaskManagement',
            'Departments': 'DepartmentManagement',
            'Leave Request': 'LeaveRequestList',
            'Holidays': 'HolidayManagement',
            'Client Management': 'ClientScreen',
            'Employee Catgories': 'EmplyeeCategory',
            'Salary Structure': "CreateSalartyStructure",
            'Employee Payroll': 'PayrollDetails',
            'Admin': 'AdminManagement',
            "Payroll Settings": "PayrollSettings",
            "Shifts": "ShiftsManagement"
        };
        const route = routes[item];
        // alert(item)
        if (route) {
            navigation.navigate(route);
        }
        else {
            console.log(item)
        }
    };

    const expandAllMenusWithSubmenus = (menuData) => {
        const expandedState = {};
        menuData.forEach((item, index) => {
            if (Array.isArray(item.submenus) && item.submenus.length > 0) {
                expandedState[index] = true;
            }
        });
        return expandedState;
    };
    // Render submenu item
    const renderSubmenuItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                // item.onPress();
                handleNavigateScreen(item.value)
                onClose();
            }}
            style={[styles.submenuItem, {
                backgroundColor: showLogoutModal ? 'grey' : THEMECOLORS[themeMode].background
            }]}
        >
            <Text style={[Louis_George_Cafe.regular.h7, { color: THEMECOLORS[themeMode].textPrimary }]}>
                {item.label}
            </Text>
            <MaterialCommunityIcons
                name={"arrow-right"}
                size={hp(2.5)}
                color={THEMECOLORS[themeMode].textPrimary}
            />
        </TouchableOpacity>
    );

    const staticMapItems = [1, 2, 3, 4, 5, 6, 7, 8];
    const renderStaticMapItem = () => {
        return staticMapItems.map((item, index) => (
            <View
                key={index}
                style={{
                    backgroundColor: themeMode === 'dark' ? "#222" : "#f1f1f1",
                    width: wp(78),
                    height: hp(6),
                    borderRadius: wp(3),
                    alignSelf: "center",
                    marginVertical: wp(2),
                }}
            />
        ));
    };


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
                                handleNavigateScreen(item.value)
                        }
                    }}
                    style={styles.menuItem}
                >
                    <Text style={[Louis_George_Cafe.regular.h6, {
                        lineHeight: wp(5),
                        color: THEMECOLORS[themeMode].textPrimary, textTransform: "capitalize"
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
        <Modal
            animationIn="slideInLeft"
            animationOut="slideOutRight"
            isVisible={visible}
            onBackdropPress={onClose}
            backdropTransitionOutTiming={0} // optional: avoids flicker
            useNativeDriver={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={[{
                        backgroundColor: showLogoutModal ? 'grey' : THEMECOLORS[themeMode].background,
                    }, styles.modalBox]}>

                        <View>
                            <ProfileHeader
                                userdata={userdata}
                                themeMode={themeMode}
                                onClose={onClose}
                                navigation={navigation}
                            />
                            {/* other content */}
                        </View>

                        {/* Menu list */}
                        <View style={{ marginVertical: hp(2), flex: 1, paddingHorizontal: wp(2) }}>
                            {
                                isLoading ?
                                    renderStaticMapItem()
                                    :
                                    <FlatList
                                        ref={flatListRef} // <-- Attach ref here
                                        data={sideMenusList}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderMenuItem}
                                        scrollEnabled
                                        showsVerticalScrollIndicator={false}
                                        onScroll={handleScroll}
                                        scrollEventThrottle={16}
                                        ListEmptyComponent={<>
                                            <Text
                                                style={[Louis_George_Cafe.regular.h4, { color: THEMECOLORS[themeMode].textPrimary, alignSelf: "center", marginTop: hp(10) }]}
                                            >{t('no_menu')}</Text>
                                        </>}
                                    />
                            }
                        </View>
                        {showDownArrow && sideMenusList?.length > 7 && (
                            <View style={{
                                position: 'absolute',
                                bottom: hp(6), // position just above the bottom padding
                                alignSelf: 'center',
                                backgroundColor: '#f9f9f9',
                                borderRadius: wp(4),
                                padding: wp(1),
                                zIndex: 10,

                            }}>
                                <MaterialCommunityIcons
                                    onPress={handleScrollToBottom}
                                    name="chevron-down"
                                    size={hp(3)}
                                    color={'black'}
                                />
                            </View>
                        )}

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
                                onPress={() => {
                                    setShowLogoutModal(true)
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
        justifyContent: "flex-start",
        right: wp(5),
        bottom: wp(6),

    },
    logoutBtn: {
        width: wp(30),
        height: wp(9),
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
        height: hp(100),
        overflow: "hidden",
        borderTopEndRadius: wp(10),
        paddingVertical: wp(1), borderEndWidth: wp(0.1),
        borderColor: "#999"

    },
    menuItem: {
        paddingVertical: wp(5),
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp(4),
        borderBottomWidth: wp(0.2),
        borderColor: "#999"
    },

    submenuItem: {
        flexDirection: "row", justifyContent: "space-between", paddingVertical: wp(3),
        paddingHorizontal: wp(4),
    },
});

export default HomeScreenModal;
