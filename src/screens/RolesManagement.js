import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    ToastAndroid,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import ConfirmationModal from '../components/ConfirmationModal';
import { deleteRoleAccess, getRoleList } from '../redux/authActions';

const RolesManagement = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);

    const [roleDataList, setRoleDataList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [modalAction, setModalAction] = useState(null);
    const [expandedRoles, setExpandedRoles] = useState({}); // Track expanded roles

    useFocusEffect(
        React.useCallback(() => {
            fetchRoleData();
        }, [])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchRoleData = () => {
        setLoading(true);
        dispatch(
            getRoleList(userdata?.id, (response) => {
                if (response.success) {
                    setRoleDataList(response?.data);
                    setLoading(false);
                    setRefreshing(false);
                }
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchRoleData();
    };

    const triggerDelete = (role) => {
        setSelectedRole(role);
        setModalAction('delete');
        setShowModal(true);
    };

    const onConfirmModalAction = () => {
        if (modalAction === 'delete') {
            const payload = {
                userid: userdata?.id,
                roleId: selectedRole?.id,
            };

            dispatch(
                deleteRoleAccess(payload, (response) => {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    if (response.success) {
                        onRefresh();
                    }
                })
            );
        }
        setShowModal(false);
        setSelectedRole(null);
        setModalAction(null);
    };

    const toggleExpandModules = (roleId) => {
        setExpandedRoles((prev) => ({
            ...prev,
            [roleId]: !prev[roleId],
        }));
    };

    const renderModules = (roleId, modules) => {
        const isExpanded = expandedRoles[roleId];
        const visibleModules = isExpanded ? modules : modules.slice(0, 3);
        return (
            <View style={styles.modulesContainer}>
                {visibleModules.map((module, index) => (
                    <View
                        key={index}
                        style={[
                            styles.moduleBadge,
                            {
                                backgroundColor:
                                    themeMode === 'dark' ? '#454545' : '#f1f1f1',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                Louis_George_Cafe.regular.h7,
                                { color: THEMECOLORS[themeMode].textPrimary },
                            ]}
                        >
                            {`${index + 1}. ${module}`}
                        </Text>
                    </View>
                ))}
                {modules.length > 3 && (
                    <TouchableOpacity onPress={() => toggleExpandModules(roleId)}>
                        <Text
                            style={[
                                Louis_George_Cafe.regular.h7,
                                {
                                    color:
                                        themeMode === 'dark'
                                            ? THEMECOLORS[themeMode].accent
                                            : THEMECOLORS[themeMode].primaryApp,
                                    marginTop: hp(0.5),
                                },
                            ]}
                        >
                            {isExpanded ? t('Show Less') : t('Show More')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
            <View style={styles.cardHeader}>
                <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item?.roleName}
                </Text>
                <View style={styles.actions}>
                    {item.canEdit && (
                        <TouchableOpacity onPress={() => navigation?.navigate('CreateRoleandAccess', item)}>
                            <MaterialCommunityIcons
                                name="pencil"
                                size={wp(7)}
                                color={
                                    themeMode === 'dark'
                                        ? THEMECOLORS[themeMode].accent
                                        : THEMECOLORS[themeMode].primaryApp
                                }
                            />
                        </TouchableOpacity>
                    )}
                    {item.canDelete && (
                        <TouchableOpacity onPress={() => triggerDelete(item)} style={{ marginLeft: wp(2) }}>
                            <MaterialCommunityIcons name="delete" size={wp(7)} color="#F44336" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <Text
                style={[
                    Louis_George_Cafe.regular.h6,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        marginBottom: hp(0.5),
                    },
                ]}
            >
                {t('Modules')}:
            </Text>
            {renderModules(item.id, item.modules)}
        </View>
    );

    const AddButton = () => (
        <TouchableOpacity
            onPress={() => navigation?.navigate('CreateRoleandAccess')}
            style={styles.addButton}
        >
            <Text style={[Louis_George_Cafe.bold.h7, styles.addButtonText(themeMode)]}>
                {t('add_role')}
            </Text>
            <MaterialCommunityIcons
                name={'plus-circle'}
                size={hp(2.5)}
                color={THEMECOLORS[themeMode].white}
            />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('RoleManagement')} />
            {AddButton()}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={{ marginTop: hp(10) }}
                />
            ) : (
                <FlatList
                    data={roleDataList}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.id}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text
                            style={[
                                Louis_George_Cafe.bold.h5,
                                styles.emptyText,
                                { color: THEMECOLORS[themeMode].textPrimary },
                            ]}
                        >
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
            <ConfirmationModal
                visible={showModal}
                message={t('Are you sure you want to delete this role?')}
                onConfirm={onConfirmModalAction}
                onCancel={() => {
                    setShowModal(false);
                    setSelectedRole(null);
                    setModalAction(null);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(1),
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modulesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
    },
    moduleBadge: {
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
        borderRadius: wp(5),
        marginBottom: hp(1),
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        margin: wp(2),
        paddingVertical: hp(1.2),
        paddingHorizontal: wp(4),
        borderRadius: wp(10),
        backgroundColor: THEMECOLORS.light.buttonBg,
    },
    addButtonText: (themeMode) => ({
        color: THEMECOLORS[themeMode].white,
        textTransform: 'capitalize',
        marginRight: wp(1.5),
    }),
});

export default RolesManagement;
