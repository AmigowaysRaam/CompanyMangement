import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveArray, getSocialMediasArray } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const SocialMediaScreen = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [socialMedias, setSocialMeddia] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchLeaveData();
        }, [userdata])
    );

    const platformImageMap = {
        Instagram: require('../assets/animations/ig.png'),
        Facebook: require('../assets/animations/fb.png'),
        Twitter: require('../assets/animations/x.png'),
        YouTube: require('../assets/animations/youtube.png'),
        Pintrest: require('../assets/animations/pintrest.png'),
        // Add more mappings if needed
    };


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
                    console.log(response.data)
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

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].cardBackground }]}>
            <View style={styles.cardHeader}>
                <View style={styles.leftSection}>
                    <Image
                        source={{ uri: item?.icon }}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {item.name}
                    </Text>
                </View>
                {!item.connected &&
                    <TouchableOpacity
                        // disabled={item.connected}
                        // onPress={() => navigation.navigate('AddLeaveForm')} // replace with connect logic
                        style={[
                            styles.connectBtn,
                            {
                                backgroundColor: item.connected
                                    ? THEMECOLORS[themeMode].disabledButton
                                    : THEMECOLORS[themeMode].buttonBg
                            }
                        ]}
                    >
                        <Text style={[
                            Louis_George_Cafe.bold.h7,
                            {
                                color: THEMECOLORS[themeMode].buttonText,
                                textTransform: "capitalize",
                                lineHeight: wp(4)
                            }
                        ]}>
                            {t('connect')}
                        </Text>
                        <MaterialCommunityIcons
                            name={'chevron-right'}
                            size={hp(2.5)}
                            color={THEMECOLORS[themeMode].buttonText}
                            style={{ paddingHorizontal: wp(2) }}
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('SocialMediaScreen')}
            />

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={{ marginTop: hp(10) }}
                />
            ) : (
                <FlatList
                    data={socialMedias}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.platform}_${index}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {t('noLeaveData')}
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingBottom: hp(2),
    },
    card: {
        borderRadius: wp(3),
        padding: wp(3),
        borderBottomWidth: 1,
        borderColor: '#efefef',
        marginHorizontal: wp(2),
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
        marginRight: wp(3),
        borderRadius: wp(2),
    },
    connectBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(2),
        paddingVertical: wp(2),
        borderRadius: wp(2),
        justifyContent: "space-between"
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});
export default SocialMediaScreen;
