import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { getCLinetData } from '../redux/authActions';
import SearchInput from './SearchInput'; // Adjust path if needed

const ClientScreen = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const isTamil = i18n.language === 'ta';
    const userdata = useSelector((state) => state.auth.user?.data?.id);

    const [clinetsData, setSettingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            fetchSettings();
        }, [userdata])
    );

    const fetchSettings = async () => {
        setLoading(true);
        dispatch(getCLinetData(userdata, (response) => {
            if (response.success) {
                setSettingsData(response.data);
            }
            setLoading(false);
        }));
    };

    const renderStaticMapItem = () => {
        return [1, 2, 3, 4, 5].map((item, index) => (
            <View
                key={index}
                style={{
                    backgroundColor: themeMode === 'dark' ? "#222" : "#f1f1f1",
                    width: wp(90),
                    height: hp(22),
                    borderRadius: wp(4),
                    alignSelf: "center",
                    marginVertical: wp(2),
                }}
            />
        ));
    };

    const renderClientCard = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('CreateClient', { data: item?._id })}
            style={[styles.card, {
                backgroundColor: THEMECOLORS[themeMode].viewBackground,
                borderColor: themeMode === 'dark' ? "#999" : "#f1f1f1",
                borderWidth: wp(0.5),
            }]}>
            <Text numberOfLines={1} style={[
                Louis_George_Cafe.bold.h7,
                styles.cardTitle,
                { color: THEMECOLORS[themeMode].textPrimary }
            ]}>
                {item.name}
            </Text>

            <View style={styles.divider} />

            <Text style={[
                Louis_George_Cafe.bold.h7,
                { color: THEMECOLORS[themeMode].textPrimary, lineHeight: wp(7), marginBottom: wp(1) }
            ]}>
                {item.email}
            </Text>

            <Text style={[
                Louis_George_Cafe.bold.h7,
                { color: THEMECOLORS[themeMode].textPrimary, lineHeight: wp(6), marginBottom: wp(1) }
            ]}>
                {item?.companyName}
            </Text>

            <View style={{ flexDirection: "row" }}>
                <Text style={[
                    isTamil ? Louis_George_Cafe.bold.h7 : Louis_George_Cafe.bold.h6,
                    {
                        borderRadius: wp(2),
                        lineHeight: wp(6),
                        color: THEMECOLORS[themeMode].textPrimary
                    }
                ]}>
                    {t('status')} :
                </Text>
                <Text style={[
                    isTamil ? Louis_George_Cafe.bold.h9 : Louis_George_Cafe.bold.h7,
                    {
                        backgroundColor: item.status !== 'Completed' ? THEMECOLORS[themeMode].primaryApp : '#B6DEAF',
                        borderRadius: wp(4),
                        paddingHorizontal: wp(3),
                        lineHeight: hp(3),
                        marginLeft: wp(1),
                        textTransform: "capitalize",
                        color: item.status !== 'Completed' ? '#FFF' : '#000',
                    }
                ]}>
                    {item.status === 1 ? t('active') : t('inactive')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // 🔍 Filter clients by name, email, or company name
    const filteredClients = clinetsData.filter(item => {
        const search = searchText.toLowerCase();
        return (
            item.name?.toLowerCase().includes(search) ||
            item.email?.toLowerCase().includes(search) ||
            item.companyName?.toLowerCase().includes(search)
        );
    });

    return (
        <View style={[
            styles.container,
            { backgroundColor: THEMECOLORS[themeMode].background }
        ]}>
            <HeaderComponent showBackArray={true} title={t('client')} />

            <TouchableOpacity
                onPress={() => navigation.navigate('CreateClient', { data: null })}
                style={{
                    alignSelf: "flex-end",
                    backgroundColor: THEMECOLORS[themeMode].buttonBg,
                    padding: wp(2),
                    margin: wp(2),
                    marginHorizontal: wp(5),
                    borderRadius: wp(5),
                    paddingHorizontal: wp(3)
                }}>
                <Text style={[
                    Louis_George_Cafe.bold.h7,
                    { color: THEMECOLORS[themeMode].buttonText }
                ]}>
                    {t('add_new')}
                </Text>
            </TouchableOpacity>

            <View style={{ paddingHorizontal: wp(5), paddingBottom: wp(2) }}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>

            {
                loading
                    ? renderStaticMapItem()
                    : (
                        <FlatList
                            contentContainerStyle={styles.list}
                            data={filteredClients}
                            keyExtractor={(item) => item.id}
                            renderItem={renderClientCard}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                !loading && filteredClients.length === 0 ? (
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: hp(10),
                                    }}>
                                        <Text style={[
                                            Louis_George_Cafe.regular.h6,
                                            {
                                                color: THEMECOLORS[themeMode].textPrimary,
                                                lineHeight: wp(6)
                                            }
                                        ]}>
                                            {t('no_data')}
                                        </Text>
                                    </View>
                                ) : null
                            }
                        />
                    )
            }
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
    card: {
        padding: wp(4),
        marginBottom: hp(2),
        borderRadius: wp(2),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    cardTitle: {
        marginBottom: hp(1),
    },
    divider: {
        width: wp(85),
        height: 1,
        backgroundColor: "#555",
        alignSelf: "center",
        marginBottom: wp(3),
    },
});

export default ClientScreen;
