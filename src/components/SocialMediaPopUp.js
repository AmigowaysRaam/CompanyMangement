import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, FlatList, Image
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { getSocialMediasArray } from '../redux/authActions';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { LoginManager, AccessToken, Settings, AppEventsLogger, LoginButton } from "react-native-fbsdk-next";
// import * as AuthSession from 'expo-auth-session';
import NetInfo from '@react-native-community/netinfo';

const SocialMediaPopUp = ({ isVisible, onCancel }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { themeMode } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialMedias, setSocialMeddia] = useState([]);
    const userdata = useSelector((state) => state.auth.user?.data);
    useFocusEffect(
        React.useCallback(() => {
            fetchLeaveData();
        }, [userdata])
    );
    const authHandler = (err, data) => {
        console.log(err, data);
    };
    useEffect(() => {
        Settings.setAppID('1082945133132002');
        Settings.setAdvertiserTrackingEnabled(true);
        AppEventsLogger.logEvent('TestEvent');
        console.log("📣 Sent TestEvent to Facebook App Events");
    }, []);

    const facebookLogin = async (i) => {
        // console.log('i', i)
        if (i?.name == 'Telegram') {
            navigation?.navigate('Telegram')
            return
        }
        if (i?.name == 'LinkedIn') {
            navigation?.navigate('Linkedin')
            return
        }
        if (i?.name == 'Facebook') {
            navigation?.navigate('FaceBook')
            return
        }
        onCancel();
        // try {
        //     Settings.initializeSDK();
        //     console.log('✅ Facebook SDK initialized');
        //     const result = await LoginManager.logInWithPermissions(['email']);
        //     if (result.isCancelled) {
        //         console.log('❌ User cancelled Facebook login');
        //         return;
        //     }
        //     console.log('✅ Facebook login result:', result);
        //     // 4. Get access token
        //     const data = await AccessToken.getCurrentAccessToken();
        //     alert(JSON.stringify(data))
        //     if (!data) {
        //         console.log('⚠️ Failed to get Facebook access token');
        //         return;
        //     }
        //     else{
        //         console.log("No Token")
        //     }
        //     console.log('🎟️ Facebook access token:', data.accessToken.toString());
        //     alert(`Logged in! Token: ${data.accessToken.toString()}`);
        // } catch (error) {
        //     console.error('🚨 Facebook login error:', error);
        // }
    };





    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => facebookLogin(item)} // replace with connect logic
            style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
            <View style={styles.cardHeader}>
                <View style={styles.leftection}>
                    <Image
                        source={{ uri: item?.icon }}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    {/* <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].black }]}>
                        {item.name}
                    </Text> */}
                </View>
                {/* {!item.connected &&
                    <TouchableOpacity
                        // disabled={item.connected}
                        onPress={() => facebookLogin()} // replace with connect logic
                        style={[
                            styles.connectBtn,
                            {
                                backgroundColor
                                    : THEMECOLORS[themeMode].primaryApp
                            }
                        ]}
                    >
                        <Text style={[
                            Louis_George_Cafe.bold.h8,
                            {
                                color: THEMECOLORS[themeMode].white,
                                textTransform: "capitalize",
                                lineHeight: wp(4)
                            }
                        ]}>
                            {t('connect')}
                        </Text>
                        <MaterialCommunityIcons
                            name={'chevron-right'}
                            size={hp(2)}
                            color={THEMECOLORS[themeMode].white}
                            style={{ paddingHorizontal: wp(1) }}
                        />
                    </TouchableOpacity>
                } */}
            </View>

        </TouchableOpacity>
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    const fetchLeaveData = () => {
        setLoading(true);
        dispatch(
            getSocialMediasArray(userdata?.id, (response) => {
                if (response.success) {
                    setSocialMeddia(response.data || []);
                    // console.log(response.data)
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };
    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaveData();
    };
    return (
        <Modal
            isVisible={isVisible}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            animationInTiming={500}       // Slower slide in
            animationOutTiming={500}      // Slower slide out ✅
            backdropColor="black"
            onBackdropPress={!loading ? onCancel : null}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <>
                    <MaterialCommunityIcons
                        onPress={onCancel}
                        name={"close"}
                        size={hp(4)}
                        color={THEMECOLORS[themeMode].primaryApp}
                        style={{
                            marginVertical: wp(2),
                            //  alignSelf: "flex-end"
                        }}
                    />
                    {
                        loading ?
                            <ActivityIndicator style={{ alignSelf: "center", marginTop: wp(10) }} />
                            :
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={socialMedias.filter((i) => i?.name !== 'YouTube')}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => `${item.platform}_${index}`}
                                contentContainerStyle={styles.listContainer}
                                ListEmptyComponent={
                                    <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {t('no_data')}
                                    </Text>
                                }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[THEMECOLORS[themeMode].textPrimary]}
                                        tintColor={THEMECOLORS[themeMode].textPrimary}
                                    />
                                }
                            />
                    }
                </>
            </View>
        </Modal>
    );
};
export default SocialMediaPopUp;
const styles = StyleSheet.create({
    modal: {
        // // margin: 10,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#f9f9f9',
        width: wp(20),
        // padding: wp(6),
        // paddingHorizontal: wp(3),
        borderTopLeftRadius: wp(2),
        borderBottomLeftRadius: wp(4),
        position: "absolute",
        right: wp(-2), top: hp(-1), minHeight: hp(52), alignItems: "center"
    },
    title: {
        // fontSize: wp(4),
        textAlign: 'center', marginBottom: hp(2), color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: hp(2),
    },
    button: {
        backgroundColor: '#013CA3',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: wp(2),
    },
    buttonText: {
        color: '#fff',
        fontSize: wp(4),
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#013CA3',
    },
    cancelText: {
        color: '#013CA3',
    },
    listContainer: {
        paddingBottom: hp(2),
    },
    card: {
        borderRadius: wp(3),
        borderBottomWidth: 1,
        borderColor: '#efefef',
        paddingVertical: wp(3),
        marginVertical: wp(1.5),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(2),
    },
    connectBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(1),
        paddingVertical: wp(1.5),
        borderRadius: wp(2),
        justifyContent: "space-between"
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});