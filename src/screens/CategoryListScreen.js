import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl, TextInput
} from 'react-native';

import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getCategoryList } from '../redux/authActions';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderComponent from '../components/HeaderComponent';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';
import SearchInput from './SearchInput';

const PAGE_SIZE = 10;

const CategoryListScreen = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const sType = route.params?.value;

    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    const loadingRef = useRef(false);
    const endReachedRef = useRef(false);

    // ✅ Include searchText in dependencies
    const fetchCategories = useCallback((currentPage = 1, isRefresh = false) => {
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

        dispatch(getCategoryList(sType, currentPage, PAGE_SIZE, searchText, (response) => {
            if (response?.success) {
                const newData = response.data || [];
                if (newData.length < PAGE_SIZE) {
                    setIsEndReached(true);
                    endReachedRef.current = true;
                }

                if (isRefresh) {
                    setCategories(newData);
                    setPage(2);
                } else {
                    setCategories(prev => {
                        const ids = new Set(prev.map(item => item.category?._id));
                        const filteredNew = newData.filter(item => !ids.has(item.category?._id));
                        return [...prev, ...filteredNew];
                    });
                    setPage(prev => prev + 1);
                }
            }

            setLoading(false);
            loadingRef.current = false;
            setRefreshing(false);
        }));
    }, [dispatch, sType, searchText]); // ✅ searchText added here

    useEffect(() => {
        fetchCategories(1, true);
    }, [fetchCategories]);

    const onRefresh = () => {
        fetchCategories(1, true);
    };

    const loadMore = () => {
        if (!loadingRef.current && !endReachedRef.current) {
            fetchCategories(page);
        }
    };

    // ✅ Debounced search effect
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchCategories(1, true);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchText, fetchCategories]);

    const renderItem = ({ item }) => {
        const category = item.category || item;
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('SubCategoryListScreen', item)}
                style={[styles.categoryBox, { backgroundColor: THEMECOLORS[themeMode].viewBackground }]}
            >
                <Text style={[
                    Louis_George_Cafe.bold.h5,
                    styles.categoryTitle,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(4) : wp(4.5)
                    }
                ]}>
                    {category.category_name}
                </Text>
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={hp(3)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
            </TouchableOpacity>
        );
    };

    const ListEmptyComponent = () => {
        if (loading || refreshing) return null;
        return (
            <View style={{ paddingTop: hp(10), alignItems: 'center' }}>
                <Text style={{ color: THEMECOLORS[themeMode].textPrimary, fontSize: wp(4) }}>
                    {t('no_categories_found')}
                </Text>
            </View>
        );
    };

    return (
        <>
            <HeaderComponent title={t('choose_your_categories')} showBackArray={true} />
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.category?._id || index.toString()}
                    contentContainerStyle={{ paddingBottom: hp(10), flexGrow: 1 }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={THEMECOLORS[themeMode].primaryApp}
                        />
                    }
                    ListFooterComponent={
                        loading && !refreshing ? (
                            <ActivityIndicator size="small" color={THEMECOLORS[themeMode].primaryApp} />
                        ) : null
                    }
                    ListEmptyComponent={ListEmptyComponent}
                />
                <ThemeToggle />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    categoryBox: {
        borderWidth: 1,
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1),
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    },
    categoryTitle: {},
});

export default CategoryListScreen;
