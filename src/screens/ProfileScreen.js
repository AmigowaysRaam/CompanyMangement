import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Animated, Easing
} from 'react-native';

import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getSideMenus } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LogoutModal from '../components/LogoutPop';
import { ActivityIndicator } from 'react-native-paper';

const ProfileScreen = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const [expandedIndex, setExpandedIndex] = useState(null);
    const userdata = useSelector((state) => state.auth.user);
    const sideMenusArray = useSelector((state) => state.auth.sidemenu);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [sideMenusList, setsideMenusList] = useState(sideMenusArray ? sideMenusArray?.data : []);
    const [isLoading, setisLoading] = useState(false);
    const flatListRef = useRef(null);
    const [hideText, setHideText] = useState(false);

    const lockPosition = useRef(new Animated.Value(0)).current;
    const [isAnimating, setIsAnimating] = useState(false);

    const animateLockToCenter = () => {
        setHideText(true); // hide the text
        Animated.timing(lockPosition, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start(() => {
            setShowLogoutModal(true); // or any follow-up logic
        });
    };

    const translateX = lockPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [0, wp(25)] // Adjust this based on how far it needs to move
    });



    const toggleSubmenu = (index) => {
        const isExpanding = expandedIndex !== index;
        setExpandedIndex(isExpanding ? index : null);

        if (isExpanding) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: index,
                    animated: true,
                    viewPosition: 0.2,
                });
            }, 100);
        }
    };


    // const flatListRef = useRef(null); // <-- Step 1: Create ref
    const handleScrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true }); // <-- Step 2: Scroll to end
        }
    };


    const handleFnNavigate = (label) => {
        // console.log(label);
        const routeMap = {
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
            'Task': 'TaskManagement',
            'Social Connect': 'SocialMediaScreen',
            'Role Settings': 'RolesandPrevilages',
            'Chats': 'ChatListScreen',
            'Home': "HomeScreen",
            'All Employees': "EmployeeList",
            'Companies': 'CompanyManagement',
            'Project Management': 'Projects',
            'Client Management': 'ClientScreen',
        };

        const route = routeMap[label];
        if (route) {
            navigation.navigate(route);
        }
    };

    const [showDownArrow, setShowDownArrow] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            dispatch(getSideMenus(userdata?.data?.id));
            setsideMenusList(sideMenusArray?.data);
            if (_.isEmpty(sideMenusArray?.data)) {
                setisLoading(true);
                dispatch(getSideMenus({ userid: userdata?.data?.id }, (response) => {
                    if (response.success) {
                        // alert(JSON.stringify(response))
                        setisLoading(false);
                        setsideMenusList(response.data);
                    } else {
                        setsideMenusList(sideMenusArray ? sideMenusArray : []);
                        setisLoading(true);
                    }
                }));
            } else {
            }
        }, [userdata?.data?.id])
    );

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20; // some threshold for bottom detection
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
        setShowDownArrow(!isAtBottom);
    };


    useEffect(() => {
        const userId = userdata?.data?.id;
        setisLoading(true);
        dispatch(getSideMenus({ userid: userdata?.data?.id }, (response) => {
            if (response?.success) {
                setsideMenusList(response.data);
                setisLoading(false);
            } else {
                setsideMenusList([]);
                setisLoading(false);
            }
        }));
    }, [userdata?.data?.id]);

    const renderItem = ({ item, index }) => {
        const isExpanded = expandedIndex === index;
        return (
            <View>
                <TouchableOpacity
                    style={[styles.menuItem, { flexDirection: "row", justifyContent: "space-between" }]}
                    onPress={() => {
                        if (item.submenus) {
                            toggleSubmenu(index);
                        } else {
                            handleFnNavigate(item.label);
                        }
                    }}
                >
                    <Text style={[
                        isTamil ? Louis_George_Cafe.regular.h8 : Louis_George_Cafe.regular.h5,
                        {
                            color: THEMECOLORS[themeMode].textPrimary,
                            textTransform: "capitalize"
                        }
                    ]}>
                        {t(item.label)}
                    </Text>
                    {item.submenus ? (
                        <MaterialCommunityIcons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={hp(2.5)}
                            color={THEMECOLORS[themeMode].textPrimary}
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={hp(2.5)}
                            color={THEMECOLORS[themeMode].textPrimary}
                        />
                    )}
                </TouchableOpacity>
                {isExpanded && item.submenus?.length > 0 && (
                    <View style={{ paddingLeft: wp(8), marginTop: hp(1) }}>
                        {item.submenus.map((submenu, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.submenuItem}
                                onPress={() => handleFnNavigate(submenu.label)}
                            >
                                <Text style={[
                                    isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.regular.h6,
                                    { color: THEMECOLORS[themeMode].textPrimary }
                                ]}>
                                    {t(submenu.label)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const staticMapItems = [1, 2, 3, 4, 5];
    const renderStaticMapItem = () => {
        return (
            staticMapItems.map((item, index) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: themeMode == 'dark' ? "#111" : "#f1f1f1",
                        width: wp(90),
                        height: hp(6),
                        borderRadius: wp(4),
                        alignSelf: "center",
                        marginVertical: wp(2),
                    }}
                />
            ))
        );
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: THEMECOLORS[themeMode].background,
            paddingVertical: wp(1),
            // opacity: showLogoutModal ? 0.9 : 1
        }}>
            <HeaderComponent title={t('profile')} showBackArray={false} />
            <View style={styles.coverContainer}>
                <LinearGradient
                    colors={['#C4A5EC', '#FFF7E3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.coverImage}
                >
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: userdata?.data?.profileImage }}
                            style={styles.profileImage}
                        />
                    </View>
                </LinearGradient>
                <View style={styles.infoContainer}>
                    <Text style={[
                        isTamil ? Louis_George_Cafe.bold.h5 : Louis_George_Cafe.bold.h4,
                        { color: THEMECOLORS[themeMode].textPrimary, textTransform: "capitalize" }
                    ]}>
                        {userdata?.data?.full_name}
                    </Text>
                    <Text style={[
                        isTamil ? Louis_George_Cafe.regular.h7 : Louis_George_Cafe.regular.h6,
                        { color: THEMECOLORS[themeMode].textPrimary }
                    ]}>
                        {userdata?.data?.userid}
                    </Text>
                </View>
            </View>


            {isLoading ?
                renderStaticMapItem()
                :
                <>
                    <FlatList
                        ref={flatListRef}
                        data={sideMenusList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{
                            paddingHorizontal: wp(5),
                            // backgroundColor: "red",
                            minHeight: hp(20), // or whatever minimum height you want
                        }}

                        getItemLayout={(data, index) => ({
                            length: hp(8), // approx row height
                            offset: hp(8) * index,
                            index,
                        })}
                        onScroll={handleScroll}
                        scrollEventThrottle={16} // smoother scroll events
                    />
                    {showDownArrow && sideMenusList?.length > 6 && (
                        <View style={{
                            position: 'absolute',
                            bottom: hp(8), // position just above the bottom padding
                            alignSelf: 'center',
                            backgroundColor: '#f9f9f9',
                            // optional background
                            borderRadius: wp(4),
                            padding: wp(1),
                            zIndex: 10,
                            // paddingHorizontal: wp(1),
                        }}>
                            <MaterialCommunityIcons
                                onPress={handleScrollToBottom}
                                name="chevron-down"
                                size={hp(3)}
                                color={'black'}
                            />
                        </View>
                    )}


                    <TouchableOpacity onPress={() => animateLockToCenter()} style={{
                        marginTop: hp(3)
                    }}>
                        <LinearGradient
                            colors={['#013CA3', `${'#013CA3'}`]}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: wp(1),    // reduce vertical padding
                                width: wp(50),               // reduce width
                                backgroundColor: '#D6DCE7',
                                borderRadius: wp(10),         // smaller border radius
                                paddingHorizontal: wp(2),    // reduce horizontal padding
                                // marginVertical: wp(2),       // reduce margin
                                alignSelf: "center",
                                alignItems: "center",
                            }}
                        >
                            {/* <Animated.View
                                style={{
                                    backgroundColor: "#D6DCE7",
                                    alignItems: "center",
                                    // padding: wp(1),           // reduce padding inside icon container
                                    paddingHorizontal: wp(4),
                                    // paddingVertical: wp(2),
                                    borderRadius: wp(5),      // smaller border radius
                                    transform: [{ translateX }],
                                }}
                            > */}
                            <MaterialCommunityIcons
                                name={'logout'}
                                size={hp(5)}               // smaller icon size
                                color={'#fff'}
                            />
                            {/* </Animated.View> */}

                            {!hideText && (
                                <Text
                                    style={[
                                        isTamil ? Louis_George_Cafe.bold.h9 : Louis_George_Cafe.bold.h5,  // smaller font size styles

                                        { color: "#FFF", lineHeight: wp(4), marginRight: hp(1), lineHeight: wp(6) }
                                    ]}
                                >
                                    {t('log_out')}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </>
            }

            {showLogoutModal &&
                <LogoutModal
                    isVisible={showLogoutModal}
                    onCancel={() => {
                        setShowLogoutModal(false);
                        setHideText(false); // show the text back
                        Animated.timing(lockPosition, {
                            toValue: 0,
                            duration: 500,
                            easing: Easing.out(Easing.exp),
                            useNativeDriver: true,
                        }).start();
                    }}

                />
            }
        </View >
    );
};

const styles = StyleSheet.create({
    coverContainer: {
        height: hp(25),
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    coverImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '60%',
        alignSelf: "center",
        justifyContent: "flex-end",
    },

    profileImageContainer: {
        zIndex: 2,
        alignSelf: "center",
        position: "relative",
        top: hp(1),
    },

    profileImage: {
        width: wp(30),
        height: wp(30),
        borderRadius: wp(15),
        borderWidth: 3,
        borderColor: '#fff'
    },

    infoContainer: {
        alignItems: 'center',
        marginBottom: hp(1),
    },

    menuItem: {
        padding: wp(2),
        borderRadius: wp(2),
        marginBottom: hp(1),
    },
    submenuItem: {
        paddingVertical: wp(3),
        paddingHorizontal: wp(2),
        borderRadius: wp(1),
        marginBottom: hp(0.5),
    },
});

export default ProfileScreen;
