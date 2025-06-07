import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    FlatList,
    Platform,
    SafeAreaView,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import SearchInput from './SearchInput';
import { height, Louis_George_Cafe } from '../resources/fonts';
import { getJobDetailsArr, getSettingMenus } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreenLoader from './HomeScreenLoader';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';

const CARD_WIDTH = wp(60);

const JobDetails = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const userdata = useSelector((state) => state.auth.user?.data?.id);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [dummyData, setdummyData] = useState(true);


    const fetchSettings = async () => {
        // setLoading(true);
        dispatch(getJobDetailsArr(userdata, (response) => {
            if (response.success) {
                // alert(JSON.stringify(response?.Projects))
                setdummyData(response?.data?.Projects)
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

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });


    const renderCardItem = ({ item }) => (
        <TouchableOpacity style={[styles.cardWrapper, {
            borderColor: THEMECOLORS[themeMode].tabInActive
        }]}>
            <View style={styles.card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Image
                        source={require('../assets/animations/presence_icon.png')}
                        style={styles.cardImage}
                        resizeMode="contain"
                    />
                    <Text style={[Louis_George_Cafe.bold.h1, styles.cardDescription, {
                        color: THEMECOLORS[themeMode].tabInActive
                    }]}>{item.count}</Text>
                </View>
                <Text style={[Louis_George_Cafe.bold.h6, styles.cardTitle, {
                    color: THEMECOLORS[themeMode].tabInActive
                }]}>{item.label}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderJobItem = ({ item, index }) => (
        <View style={[styles.tableRow, {
            backgroundColor: THEMECOLORS[themeMode].viewBackground,
            borderBottomWidth: index + 1 !== dummyData.jobs.length ? 1 : 0,
        }]}>
            <Text style={[styles.tableCell, { flex: 1.2, color: THEMECOLORS[themeMode].textPrimary }]}>{item.roleId}</Text>
            <Text style={[styles.tableCell, { flex: 2, color: THEMECOLORS[themeMode].textPrimary }]}>{item.positionTitle}</Text>
            <Text style={[styles.tableCell, { flex: 1, color: item.status === 'Active' ? 'green' : 'red' }]}>{item.status}</Text>
            <Text style={[styles.tableCell, {
                flex: 1.3,
                color: THEMECOLORS[themeMode].textPrimary
            }]}>{item.jobType}</Text>
        </View>
    );

    const renderTableHeader = () => (
        <View style={[styles.tableRow, {
            backgroundColor: THEMECOLORS[themeMode].viewBackground,
        }]}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: "bold", color: THEMECOLORS[themeMode].textPrimary }]}>Role Id</Text>
            <Text style={[styles.tableCell, { flex: 2, fontWeight: "bold", color: THEMECOLORS[themeMode].textPrimary }]}>Position</Text>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: "bold", color: THEMECOLORS[themeMode].textPrimary }]}>Status</Text>
            <Text style={[styles.tableCell, { flex: 1.3, fontWeight: "bold", color: THEMECOLORS[themeMode].textPrimary }]}>Type</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}>
            <HeaderComponent showBackArray={true} title={t('JobDetails')} />
            {/* <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                /> */}
            {/* <ThemeToggle /> */}
            {loading ?
                <HomeScreenLoader />
                :
                <>
                    <View style={[styles.container]}>
                        <FlatList
                            data={dummyData.cards}
                            renderItem={renderCardItem}
                            keyExtractor={(item, index) => `card-${index}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingLeft: wp(3), marginVertical: hp(2),
                                height: wp(28)
                            }}
                        />

                        <View style={[styles.tableCardContainer, {
                            backgroundColor: THEMECOLORS[themeMode].background

                        }]}>
                            <FlatList
                                data={dummyData.jobs}
                                keyExtractor={(item, index) => `job-${index}`}
                                renderItem={renderJobItem}
                                ListHeaderComponent={
                                    <>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: THEMECOLORS[themeMode].buttonBg,
                                                alignItems: "center",
                                                alignSelf: "flex-end",
                                                padding: wp(1),
                                                margin: wp(2),
                                                borderRadius: wp(4),
                                                paddingHorizontal: wp(4)
                                            }}>
                                            <Text style={{ color: THEMECOLORS[themeMode].buttonText }}>
                                                Create Job +
                                            </Text>
                                        </TouchableOpacity>
                                        {renderTableHeader()}
                                    </>
                                }
                                scrollEnabled={false}
                                contentContainerStyle={{ paddingBottom: hp(2) }}
                            />
                        </View>
                    </View>
                </>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        padding: wp(2),
    },
    cardWrapper: {
        marginRight: wp(3),
        borderRadius: wp(3),
        height: wp(25),
        borderWidth: wp(0.4),
    },

    card: {
        width: CARD_WIDTH,
        height: wp(28),
        padding: wp(3),
        borderRadius: wp(3),
    },

    cardTitle: {
        color: "#000",
    },
    cardDescription: {
        color: "#000",
    },
    cardImage: {
        width: wp(12),
        height: wp(12),
    },
    
    tableRow: {
        flexDirection: 'row',
        paddingVertical: hp(1.2),
        borderBottomColor: '#ccc',
        alignItems: 'center',
        paddingHorizontal: wp(2),
    },
    tableCell: {
        fontSize: wp(2.5),
        paddingHorizontal: wp(1),
    },

    tableCardWrapper: {
        paddingBottom: hp(5),
        borderRadius: wp(1),
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    },

    tableCardContainer: {
        marginHorizontal: wp(2),
        borderRadius: wp(2),
        paddingVertical: hp(1),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },

});

export default JobDetails;
