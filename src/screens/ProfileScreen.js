import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileMenuList } from '../redux/authActions';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {

    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const userdata = useSelector((state) => state.auth.user?.data);
    const tabMenuList = useSelector((state) => state.auth?.tabMenuList);
    const [menuItem, setMeniItems] = useState(tabMenuList?.data);

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getProfileMenuList(userdata?.id))
            if (_.isEmpty(tabMenuList?.data)) {
                setisLoading(true);
                dispatch(getProfileMenuList(userdata?.id, (response) => {
                    if (response.success) {
                        setMeniItems(response?.data);
                    }
                    setisLoading(false);
                }));
            }
        }, [userdata])
    );
 
    const handleFnNavigate = (slug) => {
        if (slug == 'my_profile') {
            navigation.navigate('MyProfileUpdate');
        };
    };
    const handleLogout = async (slug) => {
        try {
            await AsyncStorage.clear();
            // console.log('AsyncStorage cleared. Logging out...');
            navigation.replace('LoginScreen');
            dispatch({ type: 'APP_USER_LOGIN_SUCCESS', payload: null });

        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.menuItem, { flexDirection: "row", justifyContent: "space-between" }]}
            onPress={() => {
                if (item.slug === 'log_out') {
                    handleLogout(item.slug)
                } else {
                    handleFnNavigate(item.slug)
                }
            }}
        >
            <View style={styles.menuContent}>
                {item.showArrow ?
                    <MaterialCommunityIcons
                        name={item.icon}
                        size={hp(2.5)}
                        color={THEMECOLORS[themeMode].textPrimary}
                        style={{ marginRight: wp(3) }}
                    />
                    :
                    <View
                        style={{ marginRight: hp(4.5) }}
                    />
                }
                <Text style={[
                    isTamil ? Louis_George_Cafe.regular.h8 : Louis_George_Cafe.regular.h6,
                    { color: THEMECOLORS[themeMode].textPrimary, textTransform: "capitalize", lineHeight: wp(5) }
                ]}>
                    {t(item.slug)}
                </Text>
            </View>
            {/* {item.showArrow && ( */}
            <MaterialCommunityIcons
                name={item.showArrow ? "chevron-right" : "logout"}
                size={hp(2.5)}
                color={THEMECOLORS[themeMode].textPrimary}
            />
            {/* )} */}
        </TouchableOpacity>
    );

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
                <Text numberOfLines={1} style={[
                    isTamil ? Louis_George_Cafe.bold.h5 : Louis_George_Cafe.bold.h4,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        textTransform: "capitalize",
                        maxWidth: wp(70)
                    }
                ]}>
                    {userdata?.full_name}
                </Text>
                <Text numberOfLines={1} style={[
                    isTamil ? Louis_George_Cafe.regular.h7 : Louis_George_Cafe.regular.h6,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        textTransform: "capitalize",
                        maxWidth: wp(70)
                    }
                ]}>
                    {userdata?.designation}
                </Text>
            </View>

            {isLoading ? (
                <ActivityIndicator style={{ marginVertical: wp(10) }} color={THEMECOLORS[themeMode].textPrimary} />
            ) : (
                <FlatList
                    data={menuItem}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: wp(5), paddingTop: hp(2) }}
                />
            )}
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
        // borderTopRightRadius: hp(3),
        // borderTopLeftRadius: hp(3),
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
    menuContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProfileScreen;
