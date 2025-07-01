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
import { getProjectsListPagination } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PAGE_SIZE = 10;

const SearchSelectProject = ({ onClose, selectedEIds }) => {
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
    const [selectedProjectId, setSelectedProjectId] = useState(
        null
    );
    const [selectedProject, setSelectedProject] = useState(null);

    const fetchProjects = useCallback((currentPage = 1, isRefresh = false) => {
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
        dispatch(
            getProjectsListPagination(userdata?.id, currentPage, PAGE_SIZE, searchText, (response) => {
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
                        setCategories((prev) => [...prev, ...newData]);
                        setPage(currentPage + 1);
                    }
                }
                setLoading(false);
                loadingRef.current = false;
                setRefreshing(false);
            })
        );
    }, [dispatch, searchText]);

    useEffect(() => {
        fetchProjects(1, true);
    }, [fetchProjects]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchProjects(1, true);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchText, fetchProjects]);

    useEffect(() => {
        if (selectedProjectId && categories.length > 0) {
            const match = categories.find((item) => item._id === selectedProjectId);
            if (match) setSelectedProject(match);
        }
    }, [selectedProjectId, categories]);

    const handleSelect = (item) => {
        setSelectedProjectId(item._id === selectedProjectId ? null : item._id);
    };

    const renderItem = ({ item }) => {
        const isSelected = item._id === selectedProjectId;
        return (
            <TouchableOpacity
                onPress={() => handleSelect(item)}
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
                    name={isSelected ? 'checkbox-marked-circle' : 'circle-outline'}
                    size={hp(2.5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
                <View>
                    <Text
                        style={[
                            Louis_George_Cafe.regular.h4,
                            styles.categoryTitle,
                            {
                                color: THEMECOLORS[themeMode].textPrimary,
                                fontSize: isTamil ? wp(4) : wp(4.5),
                                marginHorizontal: wp(4),
                            },
                        ]}
                    >
                        {`${item.projectName}`}
                    </Text>
                    <Text
                        style={[
                            Louis_George_Cafe.regular.h4,
                            styles.categoryTitle,
                            {
                                color: THEMECOLORS[themeMode].textPrimary,
                                fontSize: isTamil ? wp(3) : wp(3.5),
                                marginHorizontal: wp(4),
                            },
                        ]}>
                        {` ${item.company?.company_name}`}
                    </Text>
                </View>
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
                <MaterialCommunityIcons
                    onPress={onClose}
                    name="close"
                    size={hp(3)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
            </View>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
                contentContainerStyle={{ paddingBottom: hp(10), flexGrow: 1 }}
                onEndReached={fetchProjects}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchProjects(1, true)}
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
            {
                selectedProject &&
                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={() => onClose(selectedProject)}
                    disabled={!selectedProject}
                >
                    <Text style={[styles.doneText, { color: THEMECOLORS[themeMode].buttonText }]}>
                        {t('done')}
                    </Text>
                </TouchableOpacity>
            }

        </View>
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
        alignItems: 'center',
        paddingHorizontal: wp(2),
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
        elevation: 4,
    },
    doneText: {
        fontSize: wp(4.2),
        fontWeight: '600',
    },
    categoryTitle: {
        flex: 1,
    },
});

const sstyles = (themeMode) =>
    StyleSheet.create({
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
            padding: wp(2.5),
        },
    });

export default SearchSelectProject;
