import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ToastAndroid
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import Checkbox from 'expo-checkbox';
import { getModuleAccessByIdArray, getModuleListArray, subMitRoleAccess, updateRoleAccess } from '../redux/authActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const permissions = ['add', 'edit', 'view', 'delete'];

const CreateRoleandAccess = () => {
    const { themeMode } = useTheme();
    const route = useRoute();
    const data = route?.params;
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [roleDataList, setRoleDataList] = useState([]);
    const [roleName, setroleName] = useState('');
    const [accessMatrix, setAccessMatrix] = useState({});
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalSelectAll, setGlobalSelectAll] = useState(false);

    const toggleGlobalSelectAll = () => {
        const newSelectAll = !globalSelectAll;
        setGlobalSelectAll(newSelectAll);

        const updatedMatrix = {};
        roleDataList.forEach((module) => {
            updatedMatrix[module.name] = {
                add: newSelectAll,
                edit: newSelectAll,
                view: newSelectAll,
                delete: newSelectAll,
                selectAll: newSelectAll,
            };
        });

        setAccessMatrix(updatedMatrix);
    };

    const userdata = useSelector((state) => state.auth.user?.data);
    useFocusEffect(
        useCallback(() => {
            fetchRoleData();
            if (data) {
                fetchRoleAccessByIdData();
            }
        }, [])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });
    const fetchRoleAccessByIdData = () => {
        setLoading(true);
        const payLoad = {
            roleId: data.id,
            userid: userdata?.id
        };
        dispatch(
            getModuleAccessByIdArray(payLoad, (response) => {
                if (response.success) {
                    const modules = response?.data?.accessModules || [];
                    setroleName(response?.data?.roleName || '');

                    const matrix = {};
                    modules.forEach(module => {
                        const permissions = {
                            add: module.permissions.add === 1,
                            edit: module.permissions.edit === 1,
                            delete: module.permissions.delete === 1,
                            view: module.permissions.view === 1,
                        };

                        // Check if all permissions are true (all selected)
                        const allSelected = Object.values(permissions).every(val => val);

                        // Update the matrix for the module and if all selected, mark it as true
                        matrix[module.moduleName] = {
                            ...permissions,
                            selectAll: allSelected,  // Add a `selectAll` flag to track if all permissions are selected
                        };
                    });
                    setAccessMatrix(matrix);
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };


    const fetchRoleData = () => {
        setLoading(true);
        dispatch(
            getModuleListArray(userdata?.id, (response) => {
                if (response.success) {
                    const modules = response?.data || [];
                    setRoleDataList(modules);
                    setAccessMatrix(prevMatrix => {
                        const updatedMatrix = { ...prevMatrix };
                        modules.forEach(role => {
                            if (!updatedMatrix[role.name]) {
                                updatedMatrix[role.name] = {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                };
                            }
                        });
                        return updatedMatrix;
                    });
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchRoleData();
        if (data) {
            fetchRoleAccessByIdData();
        }
    };

    const toggleSelectAll = (moduleName) => {
        setAccessMatrix(prev => {
            const currentPermissions = prev[moduleName] || {
                add: false,
                edit: false,
                view: false,
                delete: false,
                selectAll: false,
            };

            const newSelectAll = !currentPermissions.selectAll;

            // Set all permissions to newSelectAll value
            const updatedPermissions = permissions.reduce((acc, perm) => {
                acc[perm] = newSelectAll;
                return acc;
            }, {});

            return {
                ...prev,
                [moduleName]: {
                    ...updatedPermissions,
                    selectAll: newSelectAll,
                }
            };
        });
    };



    const togglePermission = (moduleName, permission) => {
        setAccessMatrix(prev => {
            const currentPermissions = prev[moduleName] || {
                add: false,
                edit: false,
                view: false,
                delete: false,
                selectAll: false,
            };

            // Toggle the individual permission
            const updatedPermissions = {
                ...currentPermissions,
                [permission]: !currentPermissions[permission],
            };

            // Check if all permissions are now true
            const allSelected = permissions.every(perm => updatedPermissions[perm]);

            return {
                ...prev,
                [moduleName]: {
                    ...updatedPermissions,
                    selectAll: allSelected,
                },
            };
        });
    };


    const handleSubmit = () => {
        if (!roleName.trim()) {
            ToastAndroid.show(t('rolenamerequired'), ToastAndroid.SHORT);
            return;
        }

        const accessModules = Object.entries(accessMatrix)
            .filter(([_, permissions]) =>
                permissions.add || permissions.edit || permissions.view || permissions.delete
            )
            .map(([moduleName, permissions]) => ({
                moduleName,
                permissions: {
                    add: permissions.add ? 1 : 0,
                    edit: permissions.edit ? 1 : 0,
                    delete: permissions.delete ? 1 : 0,
                    view: permissions.view ? 1 : 0,
                }
            }));

        if (accessModules.length === 0) {
            ToastAndroid.show(t('select_at_least_one_permission'), ToastAndroid.SHORT);
            return;
        }

        const isUpdate = !!data?.id;
        const payload = {
            roleName,
            accessModules,
            userid: userdata?.id,
            ...(isUpdate && { roleId: data.id })
        };

        setLoading(true);

        const callback = (response) => {
            ToastAndroid.show(response?.message, ToastAndroid.SHORT);
            if (response?.message) {
                navigation?.goBack();
            }
            setLoading(false);
            setRefreshing(false);
        };

        if (isUpdate) {
            dispatch(updateRoleAccess(payload, callback));
        } else {
            dispatch(subMitRoleAccess(payload, callback));
        }
    };

    const filteredRoleData = roleDataList.filter(item =>
        item?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderItem = ({ item, index }) => (
        <View style={[styles.card, { backgroundColor: index % 2 === 0 ? '#EDF2FF' : "#EDF2F2" }]}>
            <View style={styles.cardHeader}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h4, {
                    color: THEMECOLORS[themeMode].black,
                    marginVertical: wp(2)
                }]}>
                    {`${index + 1}. ${item.name}`}
                </Text>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleSelectAll(item.name)}
                >
                    <MaterialCommunityIcons
                        onPress={() => toggleSelectAll(item.name)}
                        name={accessMatrix[item.name]?.selectAll ? 'checkbox-marked' : 'square-outline'}
                        size={wp(7)}
                        color={accessMatrix[item.name]?.selectAll ? THEMECOLORS[themeMode].primaryApp : 'gray'}
                    />
                    {/* <Text style={[Louis_George_Cafe.regular.h8, styles.checkboxLabel, {
                        color: THEMECOLORS[themeMode].black
                    }]}>
                        {t('select_all')}
                    </Text> */}
                </TouchableOpacity>
            </View>

            {/* Select All Checkbox for the module */}
            <View style={styles.permissionRow}>


                {/* Permission Checkboxes */}
                {permissions.map((perm) => (
                    <TouchableOpacity key={`${item.name}-${perm}`} style={styles.checkboxContainer}
                        onPress={() => togglePermission(item.name, perm)}
                    >
                        <Checkbox
                            value={accessMatrix[item.name]?.[perm] || false}
                            onValueChange={() => togglePermission(item.name, perm)}
                            color={
                                accessMatrix[item.name]?.[perm]
                                    ? THEMECOLORS[themeMode].primaryApp
                                    : undefined
                            }
                        />
                        <Text style={[Louis_George_Cafe.regular.h8, styles.checkboxLabel, {
                            color: THEMECOLORS[themeMode].black
                        }]}>
                            {perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('RoleandAccess')}
                rightSideArr={globalSelectAll ? 'checkbox-marked' : 'square-outline'} rIconFunction={() => toggleGlobalSelectAll()}
            />
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={{ marginTop: hp(10) }}
                />
            ) : (
                <>
                    {/* Role Name Input */}
                    <View style={{ marginTop: wp(4) }}>
                        <Text style={[Louis_George_Cafe.regular.h5, {
                            color: THEMECOLORS[themeMode].textPrimary,
                            paddingHorizontal: wp(3.5)
                        }]}>
                            {t('role')}
                        </Text>
                        <TextInput
                            onChangeText={setroleName}
                            maxLength={28}
                            placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                            value={roleName}
                            placeholder='Enter Role Name'
                            style={[Louis_George_Cafe.regular.h4, styles.input, {
                                borderWidth: wp(0.5),
                                borderColor: 'grey',
                                borderRadius: 8,
                                padding: wp(1),
                                paddingHorizontal: wp(4),
                                backgroundColor: THEMECOLORS[themeMode].background,
                                marginHorizontal: wp(5),
                                alignSelf: "center",
                                width: wp(90),
                                height: hp(6.5),
                                marginVertical: wp(3),
                                color: THEMECOLORS[themeMode].textPrimary
                            }]}
                        />
                    </View>
                    {/* Module List */}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={filteredRoleData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={
                            <View style={{ marginTop: wp(2), marginBottom: wp(1), }}>
                                <TextInput
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholder={t('search') || 'Search Modules...'}
                                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                                    style={[Louis_George_Cafe.regular.h5, styles.input, {
                                        borderWidth: wp(0.5),
                                        borderColor: 'grey',
                                        borderRadius: wp(20),
                                        padding: wp(1),
                                        paddingHorizontal: wp(4),
                                        backgroundColor: THEMECOLORS[themeMode].background,
                                        marginHorizontal: wp(5),
                                        alignSelf: "center",
                                        width: wp(90),
                                        height: hp(6),
                                        color: THEMECOLORS[themeMode].textPrimary
                                    }]}
                                />
                            </View>
                        }
                        ListEmptyComponent={
                            <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, {
                                color: THEMECOLORS[themeMode].textPrimary
                            }]}>
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

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                        onPress={handleSubmit}
                    >
                        <Text style={[Louis_George_Cafe.bold.h5, {
                            color: THEMECOLORS[themeMode].buttonText
                        }]}>
                            {t('submit')}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(2)
    },
    listContainer: {
        paddingBottom: hp(2),
    },
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: wp(2),
        marginVertical: wp(1.5),
    },
    cardHeader: {
        flexDirection: "row", justifyContent: "space-between", marginBottom: hp(1),
    },
    permissionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(3),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: wp(4),
        marginBottom: hp(1),
    },
    checkboxLabel: {
        marginLeft: wp(1.5),
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
    submitButton: {
        padding: hp(1.2),
        borderRadius: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        margin: wp(4),
    },
    input: {
        fontSize: wp(4),
    }
});
export default CreateRoleandAccess;
