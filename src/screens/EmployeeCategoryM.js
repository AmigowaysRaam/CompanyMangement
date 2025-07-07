// EmployeePositionList.js
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
import {
    createPosition,
    deletePositionArr,
    getEmplCategoryList,  // existing fetch
    updatePosition,
} from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import SearchInput from './SearchInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmationModal from '../components/ConfirmationModal';
import PositionModal from './PositionModal';

const EmployeePositionList = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const isTamil = i18n.language === 'ta';
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.user?.data?.id);
    const [loading, setLoading] = useState(true);
    const [positionList, setPositionList] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [positionNameError, setPositionNameError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [status, setStatus] = useState('1'); // default active

    const fetchPositions = () => {
        setLoading(true);
        dispatch(
            getEmplCategoryList(userId, response => {
                if (response.success) {
                    // alert(JSON.stringify(response.data))
                    setPositionList(response.data);
                }
                setLoading(false);
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchPositions();
        }, [userId])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const openCreateModal = () => {
        setIsEditing(false);
        setEditingPosition(null);
        setPositionNameError('');
        setStatus('1');
        setModalVisible(true);
    };

    const openEditModal = position => {
        setIsEditing(true);
        setEditingPosition(position);
        setPositionNameError('');
        setStatus(position.Status);
        setModalVisible(true);
    };

    const handleDeletePress = id => {
        setSelectedPositionId(id);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteModalVisible(false);
        dispatch(
            deletePositionArr({ id: selectedPositionId, userId }, response => {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                if (response.success) {
                    fetchPositions();
                }
            })
        );
    };


    const handleSave = ({ Department, positionTitle, level, positionCode, status, DepartmentId }) => {
        const payload = {
            positionTitle: positionTitle,
            level: level,
            positionCode: positionCode,
            Department: DepartmentId,
            userId,
            ...(isEditing && { id: editingPosition._id }),
        };

        const action = isEditing ? updatePosition : createPosition;
        dispatch(
            action(payload, response => {
                if(response)
                ToastAndroid.show(response?.message, ToastAndroid.SHORT);
                if (response?.success) {
                    fetchPositions();
                } else {
                    setLoading(false);
                }
                setModalVisible(false);
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray title={t('Employee Positions')} />
            <View style={{ marginHorizontal: wp(4) }}>
                <TouchableOpacity onPress={openCreateModal} style={styles.addButton(themeMode)}>
                    <Text style={[Louis_George_Cafe.bold.h6, {
                        color: THEMECOLORS[themeMode].white,
                        lineHeight: wp(5),
                        fontSize: isTamil ? wp(3.2) : wp(4),
                    }]}>
                        {t('add_new')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: wp(1), paddingHorizontal: hp(3) }}>
                <SearchInput searchText={searchText} setSearchText={setSearchText} themeMode={themeMode} />
            </View>

            <ScrollView style={styles.list}>
                {loading ? (
                    [1, 2, 3, 4, 5,].map(n => (
                        <View key={n} style={[{ backgroundColor: themeMode === 'dark' ? '#3a3a3a' : '#fff', width: wp(90), height: hp(13), alignSelf: "center", marginVertical: wp(2), borderRadius: wp(2) }]} />
                    ))
                ) : (
                    positionList
                        .filter(pos =>
                            pos.positionTitle?.toLowerCase().includes(searchText.toLowerCase()) ||
                            pos.Department?.DepartmentName?.toLowerCase().includes(searchText.toLowerCase())
                        )
                        .map(pos => (
                            <View key={pos._id} style={styles.card(themeMode)}>
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.cardTitle, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {pos.positionTitle} – {pos.Department?.DepartmentName}
                                    </Text>
                                    {/* <Text>{JSON.stringify(pos.level)}</Text> */}
                                    <View style={styles.actionContainer}>
                                        <TouchableOpacity onPress={() => openEditModal(pos)} style={styles.iconButton}>
                                            <MaterialCommunityIcons name="pencil" size={wp(6)} color={THEMECOLORS[themeMode].textPrimary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeletePress(pos._id)} style={styles.iconButton}>
                                            <MaterialCommunityIcons name="delete" size={wp(6)} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={[styles.cardSubText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('level')}: {pos.level} • {t('code')}: {pos.positionCode}
                                </Text>
                                <Text style={[styles.cardSubText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('status')}: {pos.Status === '1' ? t('active') : t('inactive')}
                                </Text>
                            </View>
                        ))
                )}
            </ScrollView>

            <ConfirmationModal
                visible={deleteModalVisible}
                message={t('Are you sure you want to delete this position?')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalVisible(false)}
            />

            <PositionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
                initialData={isEditing ? editingPosition : null}
                initialStatus={status}
                setStatus={setStatus}
                isEditing={isEditing}
                errorText={positionNameError}
                setErrorText={setPositionNameError}
                themeMode={themeMode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    list: { paddingHorizontal: wp(5), paddingVertical: wp(1) },
    addButton: themeMode => ({
        flexDirection: 'row',
        width: wp(30),
        height: wp(8),
        alignSelf: 'flex-end',
        backgroundColor: THEMECOLORS[themeMode].primaryApp,
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        margin: wp(2),
    }),
    card: themeMode => ({
        backgroundColor: themeMode === 'dark' ? '#3a3a3a' : '#fff',
        padding: wp(4),
        marginVertical: wp(2),
        borderRadius: wp(2),
        elevation: 3,
    }),
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: wp(4.5), fontWeight: 'bold', flex: 1 },
    cardSubText: { fontSize: wp(3.5), marginTop: wp(1) },
    actionContainer: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { marginLeft: wp(3) },
});

export default EmployeePositionList;
