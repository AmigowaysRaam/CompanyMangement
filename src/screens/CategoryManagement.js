import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCategoryListCall } from '../redux/authActions';

const CategoryManagement = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);

    const [expandedIds, setExpandedIds] = useState({});
    const [categoriesList, setcategoriesList] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true; // prevent default behavior
        }
        return false;
    });

    const handleEdit = (category) => {
        Alert.alert("Edit", `Edit ${category.name || category.category_name}`);
    };

    const handleDelete = (category) => {
        Alert.alert("Delete", `Delete ${category.name || category.category_name}?`);
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const fetchCategoryListData = () => {
        setLoading(true);
        dispatch(
            getCategoryListCall(userdata, (response) => {
                setLoading(false);
                setRefreshing(false);
                if (response.success) {
                    setcategoriesList(response.data);
                    setFilteredCategories(response.data);

                    // Reset expandedIds to all false - no expanded by default
                    const expandedState = {};
                    response.data.forEach(cat => {
                        expandedState[cat._id] = false;
                    });
                    setExpandedIds(expandedState);
                }
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCategoryListData();
        }, [userdata])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategoryListData();
    };

    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredCategories(categoriesList);
        } else {
            const lowerText = text.toLowerCase();
            const filtered = categoriesList.filter(cat =>
                cat.category_name.toLowerCase().includes(lowerText)
            );
            setFilteredCategories(filtered);
        }
    };

    const renderSubCategories = (subs, level = 1) => {
        return subs.map(sub => {
            const isExpanded = expandedIds[sub._id];
            return (
                <View key={sub._id} style={[styles.categoryBlock, { marginLeft: wp(level * 5) }]}>
                    <TouchableOpacity
                        onPress={() => sub.subcategories && sub.subcategories.length > 0 ? toggleExpand(sub._id) : null}
                        style={styles.categoryHeader}
                        activeOpacity={0.7}
                    >
                        <Text style={[Louis_George_Cafe.regular.h6, { color: THEMECOLORS[themeMode].textPrimary, textTransform: "capitalize" }]}>
                            {`* ${sub.name}`}
                        </Text>
                        {sub.subcategories && sub.subcategories.length > 0 && (
                            <AntDesign
                                name={isExpanded ? "up" : "down"}
                                size={wp(4)}
                                color={THEMECOLORS[themeMode].textPrimary}
                            />
                        )}
                    </TouchableOpacity>
                    {/* <View style={styles.actionButtons}>
                        <TouchableOpacity onPress={() => handleEdit(sub)} style={styles.editButton}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(sub)} style={styles.deleteButton}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View> */}
                    {isExpanded && sub.subcategories && renderSubCategories(sub.subcategories, level + 1)}
                </View>
            );
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('Category Management')} />
            {/* Add Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate('AddCatgegoryForm', { data: null })}
                style={styles.addButton(themeMode)}
            >
                <MaterialCommunityIcons name={"plus"} size={hp(3)} color={THEMECOLORS[themeMode].white} />
                <Text style={styles.addButtonText(themeMode)}>
                    {'Add'}
                </Text>
            </TouchableOpacity>
            {/* Search Input */}
            <TextInput
                placeholder="Search category..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={handleSearch}
                style={[styles.searchInput, {
                    backgroundColor: THEMECOLORS[themeMode].card,
                    color: THEMECOLORS[themeMode].textPrimary,
                    borderColor: THEMECOLORS[themeMode].textPrimary
                }]}
            />
            {loading ? (
                <ActivityIndicator size="large" color={THEMECOLORS[themeMode].primaryApp} style={{ marginTop: hp(2) }} />
            ) : (
                <ScrollView
                    style={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {filteredCategories.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: hp(2), color: THEMECOLORS[themeMode].textPrimary }}>
                            No categories found
                        </Text>
                    ) : (
                        filteredCategories.map((category, index) => {
                            const isExpanded = expandedIds[category._id];
                            return (
                                <TouchableOpacity
                                    onPress={() => category.sub_category && category.sub_category.length > 0 ? toggleExpand(category._id) : null}
                                    key={category._id}
                                    style={[
                                        styles.categoryBlock,
                                        {
                                            backgroundColor:
                                                themeMode === 'dark'
                                                    ? index % 2 === 0
                                                        ? '#2a2a2a'
                                                        : '#5e5e5e'
                                                    : index % 2 === 0
                                                        ? '#ccc'
                                                        : '#e9e9e9',
                                        }
                                    ]}
                                >
                                    <View style={styles.categoryHeader}>
                                        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: wp(1) }}>
                                            <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h4, styles.categoryText, {
                                                color: THEMECOLORS[themeMode].textPrimary, marginVertical: wp(2), marginRight: hp(1),
                                                textTransform: "capitalize"
                                            }]}>
                                                {index + 1}. {category.category_name}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('AddCatgegoryForm', {
                                                    data: category
                                                })}
                                                style={{
                                                    backgroundColor: THEMECOLORS[themeMode].primaryApp, borderRadius: wp(1), paddingHorizontal: wp(2), padding: wp(1)
                                                }}
                                            >
                                                <AntDesign
                                                    name={'edit'}
                                                    size={wp(4)}
                                                    color={THEMECOLORS[themeMode].white}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {category.sub_category && category.sub_category.length > 0 && (
                                            <AntDesign
                                                name={isExpanded ? 'up' : 'down'}
                                                size={wp(4)}
                                                color={THEMECOLORS[themeMode].textPrimary}
                                            />
                                        )}
                                    </View>
                                    {isExpanded && category.sub_category && renderSubCategories(category.sub_category)}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: wp(1),
    },
    categoryBlock: {
        marginBottom: hp(1),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: hp(1),
        borderRadius: wp(2),
        paddingHorizontal: wp(4)
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryText: {},
    actionButtons: {
        flexDirection: 'row',
        marginTop: hp(0.7),
    },
    editButton: {
        marginRight: wp(2),
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    deleteButton: {
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
        backgroundColor: '#F44336',
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: wp(3.5),
    },
    addButton: (themeMode) => ({
        width: wp(25),
        height: wp(8),
        backgroundColor: THEMECOLORS[themeMode].primaryApp,
        borderRadius: wp(4),
        margin: wp(2),
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    }),
    addButtonText: (themeMode) => ({
        color: THEMECOLORS[themeMode].white,
        textTransform: "capitalize",
        fontSize: wp(4),
    }),
    searchInput: {
        marginHorizontal: wp(2),
        marginBottom: wp(2),
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        borderWidth: 1,
        fontSize: wp(4),
        borderRadius: wp(5)
    },
});

export default CategoryManagement;
