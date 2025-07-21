import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getShiftsListing } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import SearchInput from './SearchInput';

const ShiftsManagement = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth?.user?.data);
    const dispatch = useDispatch();

    const [shiftData, setShiftData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchShiftData();
        }, [userdata])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchShiftData = () => {
        setLoading(true);
        dispatch(
            getShiftsListing({ companyId: userdata?.id }, (response) => {
                if (response.success) {
                    setShiftData(response.shifts || []);
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchShiftData();
    };

    const filteredShiftData = shiftData.filter(item =>
        item.shift_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.company?.company_name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderItem = ({ item }) => {
        const {
            shift_name,
            start_time,
            end_time,
            lunch_break_start,
            lunch_break_end,
            breaks,
            company
        } = item;

        const formattedBreaks = breaks && breaks.length > 0
            ? breaks.map((b, i) => (
                <Text
                    key={i}
                    style={[Louis_George_Cafe.regular.h8, styles.breakItem, { color: THEMECOLORS[themeMode].textPrimary }]}
                >
                    <Icon name="coffee-outline" size={14} color={THEMECOLORS[themeMode].textPrimary} /> {b.break_start} - {b.break_end}
                </Text>
            ))
            : (
                <Text style={[Louis_George_Cafe.regular.h8, { color: THEMECOLORS[themeMode].textSecondary }]}>
                    {t('no_breaks')}
                </Text>
            );

        return (
            <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
                <View style={styles.row}>
                    <Icon name="calendar-clock" size={wp(8)} color={THEMECOLORS[themeMode].textPrimary} />
                    <Text style={[Louis_George_Cafe.bold.h5, styles.cardTitle, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {shift_name || t('unnamed_shift')}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="office-building" size={wp(5)} color={THEMECOLORS[themeMode].textPrimary} />
                    <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>
                        {company?.company_name || '-'}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="clock-time-four-outline" size={wp(5)} color={THEMECOLORS[themeMode].textPrimary} />
                    <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>
                        {t('timing')}: <Text style={styles.value}>{start_time} - {end_time}</Text>
                    </Text>
                </View>

                {lunch_break_start && lunch_break_end && (
                    <View style={styles.row}>
                        <Icon name="silverware-fork-knife" size={wp(5)} color={THEMECOLORS[themeMode].textPrimary} />
                        <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>
                            {t('lunch_break')}: <Text style={styles.value}>{lunch_break_start} - {lunch_break_end}</Text>
                        </Text>
                    </View>
                )}

                <View style={[styles.row, { marginTop: hp(1) }]}>
                    <Icon name="pause-circle-outline" size={wp(5)} color={THEMECOLORS[themeMode].textPrimary} />
                    <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>{t('other_breaks')}:</Text>
                </View>
                <View style={{ marginLeft: wp(5), marginTop: hp(0.5) }}>
                    {formattedBreaks}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('shifts')} />
            <View style={{ padding: wp(1), paddingHorizontal: hp(3), marginTop: wp(4) }}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={{ marginTop: hp(10) }}
                />
            ) : (
                <FlatList
                    data={filteredShiftData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item._id}_${index}`}
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: wp(3),
        paddingBottom: hp(2),
    },
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: wp(3),
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        marginLeft: wp(2),
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1),
    },
    label: {
        fontSize: 15,
        marginLeft: wp(2),
    },
    value: {
        fontWeight: 'normal',
    },
    breakItem: {
        fontSize: 14,
        marginTop: hp(0.5),
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});
export default ShiftsManagement;