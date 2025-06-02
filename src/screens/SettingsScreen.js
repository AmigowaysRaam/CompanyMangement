import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import SwitchToggle from "react-native-switch-toggle";
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';
import { changeNoftificationStatus, getSettingMenus } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';

const SettingsScreen = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [settingsData, setSettingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // const dummyData = [
    //     {
    //         section: "Account Settings",
    //         items: [
    //             { title: "My Profile", slug: "MyProfile" },
    //             { title: "Reset MPIN", slug: "ChangeMpin" },
    //             { title: "Change Password", slug: "ChangePassword" },
    //         ]
    //     },
    //     {
    //         section: "Notification",
    //         items: [
    //             { title: "Enable Notifications", slug: "EnableNotification" }
    //         ]
    //     }
    // ];

    const fetchSettings = async () => {
        setLoading(true);
        dispatch(getSettingMenus(userdata, (response) => {
            if (response.success) {
                setSettingsData(response?.data.Settings)
                // alert(JSON.stringify(response?.data?.notificationsExist))
                setIsNotificationEnabled(response?.data?.notificationsExist)
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        }));
    };

    useEffect(() => {
        // Simulate API call
        fetchSettings();
    }, []);
    const staticMapItems = [1, 2, 3, 4, 5, 6, 7];
    const handleToggleSwitch = () => {
        const nextState = !isNotificationEnabled;
        setIsNotificationEnabled(nextState);
        let payLoad = {
            userid: userdata,
            notification: nextState ? 'on' : 'off'
        }
        dispatch(changeNoftificationStatus(payLoad, (response) => {
            if (response.success) {
                setLoading(false);
                // fetchSettings();
            }
            else {
                setLoading(false)
            }
            ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
        }));
    };





    const renderStaticMapItem = () => {
        return (
            staticMapItems.map((item, index) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: themeMode == 'dark' ? "#222" : "#f1f1f1",
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

    const handleItemPress = (slug) => {
        // You can customize the logic based on slug
        if (slug === 'EnableNotification') {
            handleToggleSwitch();
        } else {
            navigation.navigate(slug);
        }
    };

    return (
        <View style={[styles.container, {
            backgroundColor: THEMECOLORS[themeMode].background
        }]}>
            <HeaderComponent showBackArray={true} title={t('settings')} />
            <ScrollView style={styles.list}>
                {loading ?
                    renderStaticMapItem()
                    :
                    <>
                        {settingsData?.map((section, sectionIndex) => (
                            <View key={sectionIndex}>
                                <Text style={[Louis_George_Cafe.bold.h5, styles.sectionHeader, { color: THEMECOLORS[themeMode].tabInActive }]}>
                                    {t(section.section)}
                                </Text>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={styles.item}
                                        onPress={() => {
                                            item.slug === 'EnableNotification' ? handleToggleSwitch() :
                                                handleItemPress(item.slug)
                                        }
                                        }
                                    >
                                        <Text style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].textPrimary, lineHeight: wp(6) }]}>
                                            {t(item.title)}
                                        </Text>
                                        {item.slug === 'EnableNotification' ? (
                                            <SwitchToggle
                                                switchOn={isNotificationEnabled}
                                                onPress={handleToggleSwitch}
                                                circleColorOff={THEMECOLORS[themeMode].background}
                                                circleColorOn={"#FFF"}
                                                backgroundColorOn={THEMECOLORS[themeMode].primaryApp}
                                                backgroundColorOff={THEMECOLORS[themeMode].textPrimary}
                                                containerStyle={{
                                                    width: wp(12),
                                                    height: wp(6.5),
                                                    borderRadius: 25,
                                                    padding: wp(1),
                                                }}
                                                circleStyle={{
                                                    width: wp(5),
                                                    height: wp(5),
                                                    borderRadius: wp(2.5),
                                                }}
                                            />
                                        ) : (
                                            <Icon name="chevron-forward" size={wp(5)} color={THEMECOLORS[themeMode].textPrimary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </>
                }
                {/* <ThemeToggle /> */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
    },
    sectionHeader: {
        marginVertical: hp(1.2),
    },
    item: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderBottomWidth: wp(0.1),
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontFamily: Louis_George_Cafe.Regular,
    },
});

export default SettingsScreen;
