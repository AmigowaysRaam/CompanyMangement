import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const sidebarMenu = [
    {
        label: "My Profile",
    },
    {
        label: "Notifications",
        submenus: [
            { label: "Messages" },
            { label: "Alerts" },
        ]
    },
    {
        label: "Job Details",
    },
    {
        label: "Compensation & Benefits",
    },
    {
        label: "Attendance & Leave",
    },
    {
        label: "Settings",
        submenus: [
            { label: "Account Settings" },
            { label: "Privacy" },
            { label: "Notifications" },
        ]
    },
];

const ProfileScreen = () => {


    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const [expandedIndex, setExpandedIndex] = useState(null);
    const userdata = useSelector((state) => state.auth.user);
    const sideMenusArray = useSelector((state) => state.auth.sidemenu);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [sideMenusList, setsideMenusList] = useState(sideMenusArray ? sideMenusArray?.data : []);
    const [isLoading, setisLoading] = useState(false);
    const toggleSubmenu = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleFnNavigate = (label) => {
        if (label == 'My Profile') {
            navigation.navigate('MyProfileUpdate')
        }

    };
    useEffect(() => {
        const userId = userdata?.data?.id;

        if (!userId) return;

        // Only fetch if the list is empty
        if (_.isEmpty(sideMenusArray?.data)) {
            setisLoading(true);

            dispatch(getSideMenus(userId, (response) => {
                if (response?.success) {
                    setsideMenusList(response.data);
                } else {
                    setsideMenusList([]);
                }
                setisLoading(false);
            }));
        } else {
            // Already available in store
            setsideMenusList(sideMenusArray.data);
        }
    }, [userdata?.data?.id, sideMenusArray]);

    const handleLogout = async () => {
        // navigation.replace('LoginScreen')
        try {
            await AsyncStorage.clear();
            navigation.replace('LoginScreen');
            dispatch({ type: 'APP_USER_LOGIN_SUCCESS', payload: null });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
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
                        isTamil ? Louis_George_Cafe.regular.h8 : Louis_George_Cafe.regular.h6,
                        { color: THEMECOLORS[themeMode].textPrimary }
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
                                    isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.regular.h7,
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

    return (
        <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background, paddingVertical: wp(1) }}>
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
                            source={require('../../src/assets/animations/user_1.png')}
                            style={styles.profileImage}
                        />
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.infoContainer}>
                <Text style={[
                    isTamil ? Louis_George_Cafe.bold.h5 : Louis_George_Cafe.bold.h4,
                    { color: THEMECOLORS[themeMode].textPrimary }
                ]}>
                    {userdata?.data?.full_name}
                </Text>
                <Text style={[
                    isTamil ? Louis_George_Cafe.regular.h7 : Louis_George_Cafe.regular.h6,
                    { color: THEMECOLORS[themeMode].textPrimary }
                ]}>
                    {userdata?.data?.designation}
                </Text>
            </View>

            <FlatList
                data={sidebarMenu}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => {
                    return (
                        <TouchableOpacity onPress={() => handleLogout()} style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(2), alignItems: "center", marginVertical: wp(3) }}>
                            <Text style={[
                                isTamil ? Louis_George_Cafe.regular.h7 : Louis_George_Cafe.regular.h6,
                                { color: THEMECOLORS[themeMode].textPrimary }
                            ]}>
                                {t('log_out')}
                            </Text>
                            <MaterialCommunityIcons
                                name={'logout'}
                                size={hp(2.5)}
                                color={THEMECOLORS[themeMode].textPrimary}
                            />
                        </TouchableOpacity>
                    );
                }}

                contentContainerStyle={{ paddingHorizontal: wp(5), paddingTop: hp(2), paddingBottom: hp(5) }}
            />
        </View>
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
        height: '80%',
        alignSelf: "center",
        justifyContent: "flex-end",
    },
    profileImageContainer: {
        zIndex: 2,
        alignSelf: "center",
        position: "relative",
        top: hp(4)
    },
    profileImage: {
        width: wp(35),
        height: wp(35),
        borderRadius: wp(18),
        borderWidth: 3,
        borderColor: '#fff'
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: wp(2)
    },
    menuItem: {
        padding: wp(2),
        borderRadius: wp(2),
        marginBottom: hp(1),
    },
    submenuItem: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        borderRadius: wp(1),
        marginBottom: hp(0.5),
    },
});

export default ProfileScreen;
