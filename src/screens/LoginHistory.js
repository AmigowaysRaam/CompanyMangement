import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getHistoryApiCall } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import SearchInput from './SearchInput';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // if using expo/
import moment from 'moment';


const PAGE_SIZE = 13;
const LoginHistory = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const [categories, setRecords] = useState([]);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const loadingRef = useRef(false);
    const endReachedRef = useRef(false);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) navigation.goBack();
    });

    const fetchLoginRecords = useCallback((currentPage = 1, isRefresh = false) => {

        if (loadingRef.current || (endReachedRef.current && !isRefresh)) return;

        if (isRefresh) {
            setRefreshing(true);
            setIsEndReached(false);
            endReachedRef.current = false;
            setPage(1);
        } else {
            setLoading(true);
        }

        loadingRef.current = true;
        dispatch(getHistoryApiCall(
            userdata?.id,
            currentPage,
            PAGE_SIZE,
            searchText,
            (response) => {
                const newData = response?.data || [];
                // console.log(JSON.stringify(newData))
                if (newData.length < PAGE_SIZE) {
                    setIsEndReached(true);
                    endReachedRef.current = true;
                }

                if (isRefresh) {
                    setRecords(newData);
                    setPage(2);
                } else {
                    setRecords(prev => [...prev, ...newData]);
                    setPage(currentPage + 1);
                }
                setLoading(false);
                setRefreshing(false);
                loadingRef.current = false;
            }
        ));
    }, [dispatch, searchText, userdata?.id]);

    useEffect(() => {
        fetchLoginRecords(1, true);
    }, [fetchLoginRecords]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchLoginRecords(1, true);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchText]);

    const onRefresh = () => fetchLoginRecords(1, true);
    const loadMore = () => {
        if (!loadingRef.current && !endReachedRef.current) {
            fetchLoginRecords(page);
        }
    };

    const renderItem = ({ item, index }) => {
        const isExpanded = expandedIndex === index;
        const category = item.category || item;

        const calculateDuration = (start, end) => {
            if (!start || !end) return '';
            const format = 'hh:mm A';
            const startDate = moment(start, format);
            const endDate = moment(end, format);
            const duration = moment.duration(endDate.diff(startDate));
            const minutes = duration.asMinutes();
            return `(${Math.round(minutes)} min)`;
        };

        return (
            <View>
                <TouchableOpacity
                    style={[
                        styles.cardItem,
                        { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#f8f8f8' },
                    ]}
                    onPress={() => setExpandedIndex(isExpanded ? null : index)}
                >
                    <Text style={styles.cell}>{category?.date || '-'}</Text>
                    <Text style={styles.cell}>{category?.punchInTime || '-'}</Text>
                    <Text style={styles.cell}>{category?.punchOutTime || '-'}</Text>
                    <Text style={styles.cell}>{`${category?.totalWorkedHours} hr` || '-'}</Text>
                    <MaterialCommunityIcons style={{ marginRight: wp(2) }} name={isExpanded ? 'chevron-up' : 'chevron-down'} size={wp(4)} color="#333" />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandContainer}>
                        {/* 🍽 Lunch */}
                        {category?.lunch?.start && category?.lunch?.end && (
                            <View style={styles.detailRow}>
                                <MaterialCommunityIcons name="food" size={wp(6)} color="#333" />
                                <Text style={styles.detailText}>
                                    {`${t('lunch')} :`} {category.lunch.start} - {category.lunch.end} {calculateDuration(category.lunch.start, category.lunch.end)}
                                </Text>
                            </View>
                        )}

                        {/* ⏸ Breaks */}
                        {category?.breaks?.length > 0 && category.breaks.map((brk, i) => (
                            <View style={styles.detailRow} key={i}>
                                <AntDesign name="pausecircle" size={wp(6)} color="#666" />
                                <Text style={styles.detailText}>
                                    {`${t('break')} ${i + 1}:`} {brk.start} - {brk.end} {calculateDuration(brk.start, brk.end)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const ListEmptyComponent = () => {
        if (loading || refreshing) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('no_data')}</Text>
            </View>
        );
    };
    return (
        <>
            <HeaderComponent title={t('LoginHistory')} showBackArray={true} />
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
                {/* <ThemeToggle/> */}
                <View style={[styles.listContainer, {
                    backgroundColor: THEMECOLORS[themeMode].cardBackground
                }]}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>{t('date')}</Text>
                        <Text style={styles.headerText}>{t('in')}</Text>
                        <Text style={styles.headerText}>{t('out')}</Text>
                        <Text style={styles.headerText}>{t('wokredHours')}</Text>
                    </View>

                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.category?._id || index.toString()}
                        contentContainerStyle={{ paddingBottom: hp(2) }}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.2}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={THEMECOLORS[themeMode].primaryApp}
                                colors={["#013CA3"]}
                            />
                        }
                        ListFooterComponent={
                            loading && !refreshing ? (
                                <ActivityIndicator size="small" color={THEMECOLORS[themeMode].primaryApp} />
                            ) : null
                        }
                        ListEmptyComponent={ListEmptyComponent}
                    />
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    listContainer: {
        flex: 1,
        // backgroundColor: '#EDF2FF',
        borderRadius: wp(2),
        paddingTop: wp(3),
        paddingHorizontal: wp(2),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(1),
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: hp(1),
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: wp(3),
        fontFamily: Louis_George_Cafe.regular.h9.fontFamily,
        color: '#000',
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(1),
        // backgroundColor: '#fff',
        borderRadius: wp(2),
        marginBottom: hp(0.5),
        // paddingHorizontal: wp(1),
        paddingVertical: wp(4)
    },
    expandContainer: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        backgroundColor: '#eaeaea',
        borderBottomLeftRadius: wp(2),
        borderBottomRightRadius: wp(2),
        marginBottom: hp(0.5),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    detailText: {
        marginLeft: wp(2),
        fontSize: wp(2.8),
        color: '#444',
    },


    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: wp(2.8),
        fontFamily: Louis_George_Cafe.regular.h9.fontFamily,
        color: '#000',
    },
    emptyContainer: {
        paddingTop: hp(5),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: wp(4),
        color: '#555',
    },
});

export default LoginHistory;
