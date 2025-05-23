import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    ImageBackground,
} from "react-native";
import { hp, wp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import { Louis_George_Cafe } from "../resources/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HomeScreenModal = ({ visible, onClose, children, title, }) => {
    // Track which menus are expanded for submenu
    const [expandedMenus, setExpandedMenus] = useState({});
    const navigation = useNavigation();

    // Example menu with submenu support
    const defaultMenus = [
        {
            label: "My Profile",
            onPress: () => alert("Go to Profile"),
        },
        {
            label: "Notification",
            onPress: () => alert("Open Notifications"),
            submenus: [
                { label: "Messages", onPress: () => alert("Open Messages") },
                { label: "Alerts", onPress: () => alert("Open Alerts") },
            ],
        },
        {
            label: "Job Details",
            onPress: () => alert("Go to Job Details"),
        },
        {
            label: "Settings",
            onPress: () => alert("Go to Settings"),
            submenus: [
                { label: "Account Settings", onPress: () => alert("Account Settings") },
                { label: "Privacy", onPress: () => alert("Privacy Settings") },
                { label: "Notifications", onPress: () => alert("Notification Settings") },
            ],
        },
    ];

    // Toggle expand/collapse submenu for a menu index
    const toggleExpand = (index) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleLogout = () => {
        navigation.replace('LoginScreen')
    }

    // Render submenu item
    const renderSubmenuItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                item.onPress();
                onClose();
            }}
            style={styles.submenuItem}
        >
            <Text style={[Louis_George_Cafe.regular.h8, { color: COLORS.gray }]}>
                {item.label}
            </Text>
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
                            item.onPress();
                            onClose();
                        }
                    }}
                    style={styles.menuItem}
                >
                    <Text style={[Louis_George_Cafe.regular.h7]}>{item.label}</Text>
                    <MaterialCommunityIcons
                        name={hasSubmenu ? (isExpanded ? "chevron-up" : "chevron-down") : "chevron-right"}
                        size={hp(3)}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                {/* Render submenu if expanded */}
                {hasSubmenu && isExpanded && (
                    <FlatList
                        data={item.submenus}
                        keyExtractor={(subItem, subIndex) => `${index}-${subIndex}`}
                        renderItem={renderSubmenuItem}
                        scrollEnabled={false}
                        style={{ marginLeft: wp(8), backgroundColor: COLORS.lightBackground }}
                    />
                )}
            </View>
        );
    };

    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <ImageBackground
                            source={require("../../src/assets/animations/profile_bg.png")}
                            resizeMode="stretch"
                            style={{ width: "100%", height: hp(34) }}
                        >
                            <View style={{ width: "100%", height: hp(32), alignItems: "center" }}>
                                <View style={{ marginVertical: hp(2) }}>
                                    <Image
                                        source={require("../assets/animations/user_1.png")}
                                        style={{ width: wp(40), height: wp(40), borderRadius: wp(25) }}
                                    />
                                    <View style={{ marginTop: wp(2) }}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                Louis_George_Cafe.bold.h6,
                                                { alignSelf: "center", color: COLORS.background },
                                            ]}
                                        >
                                            {"Admin"}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                Louis_George_Cafe.regular.h7,
                                                { alignSelf: "center", color: COLORS.background },
                                            ]}
                                        >
                                            {"App Developer"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>

                        {/* Menu list */}
                        <View style={{ marginVertical: hp(2), flex: 1 }}>
                            <FlatList
                                data={children || defaultMenus}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderMenuItem}
                                scrollEnabled
                                showsVerticalScrollIndicator={false}
                            />
                        </View>

                        <View
                            style={{
                                margin: hp(2),
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <TouchableOpacity style={styles.logoutBtn} onPress={() => handleLogout()}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        Louis_George_Cafe.bold.h7,
                                        { alignSelf: "center", color: COLORS.background, lineHeight: wp(5) },
                                    ]}
                                >
                                    {"Logout"}
                                </Text>
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={wp(4)}
                                    color={COLORS.background}
                                />
                            </TouchableOpacity>
                            <Text
                                numberOfLines={1}
                                style={[
                                    Louis_George_Cafe.bold.h9,
                                    { alignSelf: "center", color: COLORS.button_bg_color },
                                ]}
                            >
                                {"1.0.0"}
                            </Text>
                        </View>
                    </View>
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
        backgroundColor: COLORS.button_bg_color,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: wp(5),
        paddingHorizontal: wp(2),
        flexDirection: "row",
    },
    modalBox: {
        width: wp(80),
        backgroundColor: COLORS.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        height: hp(100),
        overflow: "hidden",
        borderTopEndRadius: wp(10),
    },
    menuItem: {
        paddingVertical: wp(3.5),
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#CCC",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp(4),
    },
    submenuItem: {
        paddingVertical: wp(2.5),
        borderBottomWidth: 0.5,
        borderBottomColor: "#EEE",
        paddingHorizontal: wp(6),
    },
});

export default HomeScreenModal;
