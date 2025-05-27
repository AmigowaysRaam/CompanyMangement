import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Pressable
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getSubCategoryList } from '../redux/authActions';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderComponent from '../components/HeaderComponent';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';
import SearchInput from './SearchInput';

const PAGE_SIZE = 10;

const SubCategoryListScreen = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const item = route.params;
    const [subCategories, setSubCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const loadingRef = useRef(false);
    const endReachedRef = useRef(false);

    const fetchSubCategories = useCallback((currentPage = 1, isRefresh = false) => {
        if (loadingRef.current || (endReachedRef.current && !isRefresh)) return;

        if (isRefresh) {
            setRefreshing(true);
            setIsEndReached(false);
            endReachedRef.current = false;
            setPage(1);
        } else {
            setLoading(true);
            loadingRef.current = true;
        }

        dispatch(getSubCategoryList(item.category_id, "product", currentPage, PAGE_SIZE, searchText, (response) => {
            if (response?.success) {
                const newData = response.data || [];
                if (newData.length < PAGE_SIZE) {
                    setIsEndReached(true);
                    endReachedRef.current = true;
                }
                if (isRefresh) {
                    setSubCategories(newData);
                    setPage(2);
                } else {
                    setSubCategories(prev => {
                        const ids = new Set(prev.map(item => item.subCategory?._id));
                        const filteredNew = newData.filter(item => !ids.has(item.subCategory?._id));
                        return [...prev, ...filteredNew];
                    });
                    setPage(prev => prev + 1);
                }
            }

            setLoading(false);
            loadingRef.current = false;
            setRefreshing(false);
        }));
    }, [dispatch, item.category_id, searchText]);

    useEffect(() => {
        fetchSubCategories(1, true);
    }, [fetchSubCategories]);

    const onRefresh = () => {
        fetchSubCategories(1, true);
    };

    const loadMore = () => {
        if (!loadingRef.current && !endReachedRef.current) {
            fetchSubCategories(page);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchSubCategories(1, true);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchText]);

    const renderItem = ({ item }) => {
        const subCategory = item.subCategory || item;
        const isSelected = selectedId === subCategory._id;

        return (
            <TouchableOpacity
                onPress={() => setSelectedId(subCategory._id)}
                style={[styles.subCategoryBox, { backgroundColor: THEMECOLORS[themeMode].viewBackground }]}
            >
                <View style={styles.radioRow}>
                    <MaterialCommunityIcons
                        name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                        size={hp(2.8)}
                        color={THEMECOLORS[themeMode].primaryApp}
                    />
                    <Text style={[
                        Louis_George_Cafe.bold.h5,
                        styles.subCategoryTitle,
                        {
                            color: THEMECOLORS[themeMode].textPrimary,
                            fontSize: isTamil ? wp(4) : wp(4.5)
                        }
                    ]}>
                        {subCategory.sub_category_name}
                    </Text>
                </View>
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={hp(3)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
            </TouchableOpacity>
        );
    };
    
    const handleContinue = () => {
        const selectedSubCat = subCategories.find(item =>
            (item.subCategory || item)._id === selectedId
        );
        if (selectedSubCat) {
            navigation.replace('HomeScreen', { selectedSubCategory: selectedSubCat });
        }
    };

    return (
        <>
            <HeaderComponent title={t('choose_your_subcategories')} showBackArray={true} />
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />

                <FlatList
                    data={subCategories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.subCategory?._id || index.toString()}
                    contentContainerStyle={{ paddingBottom: hp(10) }}
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
                />

                {selectedId !== '' && (
                    <TouchableOpacity
                        onPress={handleContinue}
                        style={[styles.continueButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                    >
                        <Text style={[Louis_George_Cafe.bold.h5, { color: '#fff' }]}>
                            {t('continue')}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* <View style={{ margin: wp(4) }}>
                    <ThemeToggle />
                </View> */}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    subCategoryBox: {
        borderWidth: 1,
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1),
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    },
    subCategoryTitle: {
        marginLeft: wp(2)
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    continueButton: {
        alignSelf: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(10),
        borderRadius: wp(2),
        marginVertical: wp(1)
    }
});

export default SubCategoryListScreen;
