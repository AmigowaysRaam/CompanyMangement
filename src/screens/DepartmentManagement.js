import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Text,
    ToastAndroid,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createDepartment, deleteDepartment, getDepartMentList, updateDepartment } from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import SearchInput from './SearchInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmationModal from '../components/ConfirmationModal';
import DepartmentModal from './DepartmentModal'; // Import the new child modal component

const DepartmentManagement = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const isTamil = i18n.language === 'ta';
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);
    const [loading, setLoading] = useState(true);
    const [departmentList, setdepartmentList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

    // Modal states now simplified
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [departmentNameError, setDepartmentNameError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    // New status state added
    const [status, setStatus] = useState('1'); // default active

    const fetchHomeData = () => {
        setLoading(true);
        dispatch(
            getDepartMentList(userdata, (response) => {
                if (response.success) {
                    setdepartmentList(response.data);
                }
                setLoading(false);
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchHomeData();
        }, [userdata])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const handleDeletePress = (departmentId) => {
        setSelectedDepartmentId(departmentId);
        setModalVisible(true);
    };

    const handleDeleteConfirm = () => {
        setModalVisible(false);
        let payload = {
            id: selectedDepartmentId,
            userId: userdata
        }
        dispatch(
            deleteDepartment(payload, (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                if (response?.success) {
                    fetchHomeData();
                    setLoading(false);
                }
            })
        );
    };

    // Open create modal
    const openCreateModal = () => {
        setIsEditing(false);
        setEditingDepartment(null);
        setDepartmentNameError('');
        setStatus('1'); // default status active when creating new
        setEditModalVisible(true);
    };

    // Open edit modal
    const openEditModal = (department) => {
        setIsEditing(true);
        setEditingDepartment(department);
        setDepartmentNameError('');
        setStatus(department.status); // use existing status or default active
        setEditModalVisible(true);
    };

    const handleSave = (name, newStatus) => {
        setLoading(true);
        if (isEditing) {
            const payload = {
                DepartmentName: name?.departmentName,
                status: name?.status,
                userId: userdata,
                id: editingDepartment?._id,
            };
            dispatch(
                updateDepartment(payload, (response) => {
                    ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                    if (response?.success) {
                        fetchHomeData();
                        setLoading(false);
                    }
                })
            );
            setEditModalVisible(false);
        } else {
            const payload = {
                DepartmentName: name?.departmentName,
                status: name?.status,
                userId: userdata,
            };

            dispatch(
                createDepartment(payload, (response) => {
                    ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                    if (response?.success) {
                        fetchHomeData();
                        setLoading(false);
                    }
                })
            );

            setEditModalVisible(false);
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('DepartmentManagement')} />

            <View style={{ marginHorizontal: wp(4) }}>
                <TouchableOpacity
                    onPress={openCreateModal}
                    style={styles.addButton(themeMode)}
                >
                    <Text
                        numberOfLines={1}
                        style={[
                            Louis_George_Cafe.bold.h6,
                            {
                                color: THEMECOLORS[themeMode].white,
                                lineHeight: wp(5),
                                fontSize: isTamil ? wp(3.2) : wp(4),
                            },
                        ]}
                    >
                        {t('add_new')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: wp(1), paddingHorizontal: hp(3) }}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>

            <ScrollView style={styles.list}>
                {loading ? (
                    [1, 2, 3].map((company) => (
                        <View
                            key={company}
                            style={{
                                backgroundColor: themeMode === 'dark' ? '#5e5e5e' : '#e9e9e9',
                                width: wp(90),
                                height: hp(15),
                                marginVertical: wp(3),
                                borderRadius: wp(2),
                            }}
                        />
                    ))
                ) : (
                    departmentList
                        .filter((company) =>
                            company.DepartmentName?.toLowerCase().includes(searchText.toLowerCase())
                        )
                        .map((company) => (
                            <View key={company._id} style={styles.card(themeMode)}>
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.cardTitle, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {company.DepartmentName}
                                    </Text>
                                    <View style={styles.actionContainer}>
                                        <TouchableOpacity
                                            style={styles.iconButton}
                                            onPress={() => openEditModal(company)}
                                        >
                                            <MaterialCommunityIcons
                                                name="pencil"
                                                size={wp(7)}
                                                color={THEMECOLORS[themeMode].textPrimary}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.iconButton}
                                            onPress={() => handleDeletePress(company._id)}
                                        >
                                            <MaterialCommunityIcons
                                                name="delete"
                                                size={wp(7)}
                                                color="red"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* <Text style={[styles.cardSubText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('created_at')}: {new Date(company.createdAt).toLocaleDateString()}
                                </Text> */}
                                <Text style={[styles.cardSubText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('status')}: {company.status === '1' ? t('active') : t('inactive')}
                                </Text>
                            </View>
                        ))
                )}
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                visible={modalVisible}
                message={t('Are you sure you want to delete this department?')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setModalVisible(false)}
            />

            {/* Create/Edit Department Modal as child */}
            <DepartmentModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSave={(name, newStatus) => {
                    handleSave(name, newStatus);
                }}
                initialName={isEditing && editingDepartment ? editingDepartment.DepartmentName : ''}
                initialStatus={status}
                setStatus={setStatus}
                isEditing={isEditing}
                errorText={departmentNameError}
                setErrorText={setDepartmentNameError}
                themeMode={themeMode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        paddingHorizontal: wp(5),
        paddingVertical: wp(1),
    },
    addButton: (themeMode) => ({
        flexDirection: 'row',
        width: wp(30),
        height: wp(8),
        alignSelf: 'flex-end',
        backgroundColor: THEMECOLORS[themeMode].primaryApp,
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: wp(3),
        margin: wp(2),
    }),
    card: (themeMode) => ({
        backgroundColor: themeMode === 'dark' ? '#3a3a3a' : '#fff',
        padding: wp(4),
        marginVertical: wp(2),
        borderRadius: wp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    }),
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        marginBottom: wp(1),
        flex: 1,
    },
    cardSubText: {
        fontSize: wp(3.5),
        color: '#888',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: wp(5),
    },
    iconButton: {
        marginLeft: wp(3),
    },
});

export default DepartmentManagement;
