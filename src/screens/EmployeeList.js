import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getEmployeeList } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import SearchInput from './SearchInput';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const PAGE_SIZE = 13;

const EmployeeList = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const userdata = useSelector((state) => state.auth.user?.data);

    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    const loadingRef = useRef(false);
    const endReachedRef = useRef(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchEmployee = useCallback((currentPage = 1, isRefresh = false) => {
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

        dispatch(getEmployeeList(
            userdata?.id,
            currentPage,
            PAGE_SIZE,
            searchText,
            (response) => {
                if (response?.success) {
                    const newData = response.employeeList || [];
                    // alert(JSON.stringify(newData, null, 2))
                    if (newData.length < PAGE_SIZE) {
                        setIsEndReached(true);
                        endReachedRef.current = true;
                    }

                    if (isRefresh) {
                        setCategories(newData);
                        setPage(2);
                    } else {
                        setCategories(prev => [...prev, ...newData]);
                        setPage(currentPage + 1);
                    }
                }

                setLoading(false);
                loadingRef.current = false;
                setRefreshing(false);
            }
        ));
    }, [dispatch, searchText]);

    useEffect(() => {
        fetchEmployee(1, true);
    }, [fetchEmployee]);

    const onRefresh = () => {
        fetchEmployee(1, true);
    };

    const loadMore = () => {
        if (!loadingRef.current && !endReachedRef.current) {
            fetchEmployee(page);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchEmployee(1, true);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchText, fetchEmployee]);

    const renderItem = ({ item, index }) => {
        const category = item.category || item;
        return (
            <TouchableOpacity style={[styles.cardBox, { backgroundColor: '#EDF2FF' }]}
                onPress={() =>
                    navigation.navigate('EmplyeeDetails', item)
                }
            >
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h9, styles.column, styles.textAlignLeft, { fontSize: isTamil ? wp(2.5) : wp(3.2) }]}>
                    {`${index + 1}. ${category.name}`}
                </Text>
                <Text style={[Louis_George_Cafe.regular.h9, styles.column, styles.textAlignCenter, { fontSize: isTamil ? wp(2.5) : wp(3.2) }]}>
                    {category?.eId || '-'}
                </Text>
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h9, styles.column, styles.textAlignRight, { fontSize: isTamil ? wp(2.5) : wp(3.2) }]}>
                    {category?.position}
                </Text>
            </TouchableOpacity>
        );
    };

    const ListEmptyComponent = () => {
        if (loading || refreshing) return null;
        return (
            <View style={{ paddingTop: hp(3), alignItems: 'center' }}>
                <Text style={{ color: '#000', fontSize: wp(4), lineHeight: wp(6) }}>
                    {t('no_data')}
                </Text>
            </View>
        );
    };

    return (
        <>
            <HeaderComponent title={t('employeeList')} showBackArray={true} />
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
                <View style={styles.listContainer}>
                    <View style={[styles.cardBo, styles.headerRow]}>
                        <Text style={[Louis_George_Cafe.bold.h9, styles.column, styles.textAlignLeft, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>
                            {t('employee_name')}
                        </Text>
                        <Text style={[Louis_George_Cafe.bold.h9, styles.column, styles.textAlignCenter, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>
                            {t('id')}
                        </Text>
                        <Text style={[Louis_George_Cafe.bold.h9, styles.column, styles.textAlignRight, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>
                            {t('position')}
                        </Text>
                    </View>
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.category?._id || index.toString()}
                        contentContainerStyle={{ paddingBottom: hp(1), flexGrow: 1 }}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.1}
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
        backgroundColor: "#EDF2FF",
        justifyContent: "center",
        borderRadius: wp(2),
        paddingTop: wp(3),
        flex: 1,
    },
    cardBox: {
        borderRadius: wp(2),
        paddingVertical: wp(2),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    headerRow: {
        backgroundColor: '#D0DBFF',
        paddingVertical: wp(3),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    column: {
        flex: 1,
        paddingHorizontal: wp(1),
    },
    textAlignLeft: {
        textAlign: 'left',
        textTransform: "capitalize"
    },
    textAlignCenter: {
        textAlign: 'center',
        textTransform: "capitalize"
    },
    textAlignRight: {
        textAlign: 'right',
        textTransform: "capitalize"

    },
});
export default EmployeeList;
