import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getEmployeeList } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const PAGE_SIZE = 10;

const SearchSelectScreen = ({ onClose, selectedEIds }) => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
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
        userdata?.id,
            // employId?.employeeID,
            currentPage,
            PAGE_SIZE,
            searchText,

            loadingRef.current = true;
        dispatch(getEmployeeList(userdata?.id,
            // employId?.employeeID,
            currentPage,
            PAGE_SIZE,
            searchText, (response) => {
                console.log('Fetching page:', response.employeeList);
                if (response?.success) {
                    const newData = response.employeeList || [];
                    if (newData.length < PAGE_SIZE) {
                        setIsEndReached(true);
                        endReachedRef.current = true;
                    }
                    if (isRefresh) {
                        setCategories(newData);
                        setPage(2);
                    } else {
                        setCategories(prev => [
                            ...prev,
                            ...newData,
                        ]);
                        setPage(currentPage + 1);
                    }
                }

                setLoading(false);
                loadingRef.current = false;
                setRefreshing(false);
            }));
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

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        if (Array.isArray(selectedEIds) && selectedEIds.length > 0 && categories.length > 0) {
            const idOrObj = selectedEIds[0];
            let enriched = null;
            if (typeof idOrObj === 'object') {
                enriched = idOrObj;
            } else {
                const match = categories.find(emp => emp.id === idOrObj);
                if (match) enriched = { id: match.id, name: match.name };
            }
            setSelectedEmployee(enriched);
        }
    }, [selectedEIds, categories]);

    const renderItem = ({ item }) => {
        const category = item.category || item;
        const employeeData = { id: category.id, name: category.name };
        const isSelected = selectedEmployee?.id === employeeData.id;

        const handleSelect = () => {
            if (isSelected) {
                setSelectedEmployee(null);
            } else {
                setSelectedEmployee(employeeData);
            }
        };

        return (
            <TouchableOpacity
                onPress={handleSelect}
                style={[
                    styles.itemBox,
                    {
                        backgroundColor: isSelected
                            ? THEMECOLORS[themeMode].primaryApp + '20'
                            : THEMECOLORS[themeMode].viewBackground,
                    }
                ]}
            >
                <MaterialCommunityIcons
                    name={isSelected ? "checkbox-marked-circle" : "circle-outline"}
                    size={hp(2.5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
                <Text style={[
                    Louis_George_Cafe.regular.h4,
                    styles.categoryTitle,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(4) : wp(4.5),
                        marginHorizontal: wp(4)
                    }
                ]}>
                    {category.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const ListEmptyComponent = () => {
        if (loading || refreshing) return null;
        return (
            <View style={{ paddingTop: hp(10), alignItems: 'center' }}>
                <Text style={{ color: THEMECOLORS[themeMode].textPrimary, fontSize: wp(4) }}>
                    {t('no_data')}
                </Text>
            </View>
        );
    };
    return (
        <>
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                <View style={sstyles(themeMode).searchContainer}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={wp(5)}
                        color={THEMECOLORS[themeMode].textPrimary}
                        style={sstyles(themeMode).icon}
                    />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder={t('search')}
                        placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                        style={sstyles(themeMode).input}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <MaterialCommunityIcons onPress={onClose}
                        name="close"
                        size={hp(3)}
                        color={THEMECOLORS[themeMode].textPrimary} />
                </View>
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.category?._id || index.toString()}
                    contentContainerStyle={{ paddingBottom: hp(10), flexGrow: 1 }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1} // ✅ Lower threshold for better triggering
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
                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                    onPress={() => onClose(selectedEmployee)}
                >
                    <Text style={[styles.doneText, { color: THEMECOLORS[themeMode].buttonText, textTransform: "capitalize" }]}>
                        {t('done')}
                    </Text>
                </TouchableOpacity>

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    itemBox: {
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: wp(2)
    },
    doneButton: {
        position: 'absolute',
        bottom: hp(2),
        left: wp(5),
        right: wp(5),
        height: hp(6),
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4, // optional for shadow
    },
    doneText: {
        fontSize: wp(4.2),
        fontWeight: '600',
    },


});
const sstyles = (themeMode) => StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(10),
        borderWidth: wp(0.4),
        borderColor: THEMECOLORS[themeMode].textPrimary,
        backgroundColor: THEMECOLORS[themeMode].viewBackground,
        paddingHorizontal: wp(3),
        height: hp(5),
        marginBottom: wp(2),
    },
    icon: {
        marginRight: wp(2),
    },
    input: {
        flex: 1,
        fontSize: wp(3.5),
        color: THEMECOLORS[themeMode].textPrimary,
        padding: wp(2.5)
    },
});

export default SearchSelectScreen;
