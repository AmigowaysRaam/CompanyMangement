import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { getCLinetData } from '../redux/authActions';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';

const ClientScreen = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [clinetsData, setSettingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchSettings = async () => {
        setLoading(true);
        dispatch(getCLinetData(userdata, (response) => {
            if (response.success) {
                setSettingsData(response?.data?.Clients)
            }
            setLoading(false);
        }));
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const staticMapItems = [1, 2, 3, 4, 5, 6, 7];
    const renderStaticMapItem = () => {
        return staticMapItems.map((item, index) => (
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
        <View style={[styles.card, {
            backgroundColor: THEMECOLORS[themeMode].viewBackground,
            borderColor:
                '#F1F1F1',
            borderWidth: wp(0.5),
        }]}>
            <Text style={[
                Louis_George_Cafe.bold.h7,
                styles.cardTitle,
                { color: THEMECOLORS[themeMode].textPrimary }
            ]}>
                {item.name}
            </Text>
            <View style={styles.divider} />
            <View style={[{
                flexDirection: "row", justifyContent: "space-between", marginBottom: wp(2)
            }]}>
                <Text style={[
                    Louis_George_Cafe.regular.h7,
                    styles.cardText,
                    { color: THEMECOLORS[themeMode].textPrimary }
                ]}>
                    {t('agreementDate')}
                </Text>
                <Text style={[
                    Louis_George_Cafe.bold.h7,
                    { color: THEMECOLORS[themeMode].textPrimary }
                ]}>
                    {item.agreementDate}
                </Text>
            </View>
            <View style={styles.dateRow}>
                <View style={styles.dateBlock}>
                    <Text style={[
                        Louis_George_Cafe.regular.h7,
                        styles.cardText,
                        { color: THEMECOLORS[themeMode].textPrimary }
                    ]}>
                        {t('startDate')}
                    </Text>
                    <Text style={[
                        Louis_George_Cafe.bold.h7,
                        { color: THEMECOLORS[themeMode].textPrimary }
                    ]}>
                        {item.startDate}
                    </Text>
                </View>

                <View style={styles.dateBlock}>
                    <Text style={[
                        Louis_George_Cafe.regular.h7,
                        styles.cardText,
                        { color: THEMECOLORS[themeMode].textPrimary }
                    ]}>
                        {t('endDate')}
                    </Text>
                    <Text style={[
                        Louis_George_Cafe.bold.h7,
                        { color: THEMECOLORS[themeMode].textPrimary }
                    ]}>
                        {item.endDate}
                    </Text>
                </View>
            </View>
            <Text style={[
                Louis_George_Cafe.regular.h7,
                styles.cardText,
                { color: THEMECOLORS[themeMode].textPrimary, marginTop: hp(1.2) }
            ]}>
                {t('budgetProgress')} : {item.budgetProgress}
            </Text>
            <View style={{ flexDirection: "row" }}>
                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    {
                        alignSelf: "flex-start", borderRadius: wp(2), paddingHorizontal: wp(0),
                        lineHeight: wp(6),
                        color: THEMECOLORS[themeMode].textPrimary
                    }
                ]}>
                    {t('status')} :
                </Text>
                <Text style={[
                    Louis_George_Cafe.regular.h7,
                    {
                        backgroundColor: item.status !== 'Completed' ? THEMECOLORS[themeMode].primaryApp
                            : '#B6DEAF',
                        alignSelf: "flex-start", borderRadius: wp(4), paddingHorizontal: wp(3),
                        lineHeight: hp(3), marginLeft: wp(1),
                        textTransform: "capitalize",
                        color: item.status !== 'Completed' ? '#FFF'
                            : '#000',
                    }
                ]}>
                    {t(item.status)}
                </Text>
            </View>

        </View>
    );

    return (
        <View style={[
            styles.container,
            { backgroundColor: THEMECOLORS[themeMode].background }
        ]}>
            {/* <ThemeToggle/> */}
            <HeaderComponent showBackArray={true} title={t('client')} />
            {
                loading ?
                    renderStaticMapItem() :
                    <FlatList
                        contentContainerStyle={styles.list}
                        data={clinetsData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderClientCard}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            !loading ? (
                                <View style={[{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: hp(10),
                                }]}>
                                    <Text style={[
                                        Louis_George_Cafe.regular.h6,
                                        { color: THEMECOLORS[themeMode].textPrimary }
                                    ]}>
                                        {t('no_data')}
                                    </Text>
                                </View>
                            ) : null
                        }
                    />

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
        borderWidth: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    cardTitle: {
        marginBottom: hp(1),
    },
    cardText: {
        fontSize: wp(3.6),
        marginBottom: hp(1),
    },
    divider: {
        width: wp(85),
        height: 1,
        backgroundColor: "#555",
        alignSelf: "center",
        marginBottom: wp(3),
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateBlock: {
        width: '30%',
    },
});

export default ClientScreen;
