import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestedLeaveArray, updateLeaveStatus } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import DropdownModal from '../components/DropDownModal';
import ConfirmationModal from '../components/ConfirmationModal';

const LeaveRequestList = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    const [leaveData, setLeaveData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusArray, setStatusArray] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); // For filtering
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

    const colors = THEMECOLORS[themeMode];

    useFocusEffect(
        React.useCallback(() => {
            fetchLeaveData();
        }, [userdata])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchLeaveData = () => {
        setLoading(true);
        dispatch(
            getRequestedLeaveArray({ userid: userdata?.id }, (response) => {
                if (response.success) {
                    setLeaveData(response.data || []);
                    // console.log('response.status_name', response.status_name);
                    // Add "All" manually to the beginning
                    setStatusArray([
                        { label: 'All', value: 'All' },
                        { label: 'Pending', value: 'Pending' },
                        ...(response.status_name || [])
                    ]);
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaveData();
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleUpdateApiCall = () => {
        dispatch(
            updateLeaveStatus({ approvedBy: userdata?.id, leaveId: selectedLeaveId, status: pendingStatusChange?.newStatus }, (response) => {
                // alert(JSON.stringify(response))
                if (response.success) {
                    onRefresh();
                }
            })
        );
        setConfirmVisible(false);
        setPendingStatusChange(null);
    }
    const handleShowDropDown = (leaveId, currentStatus) => {
        setSelectedLeaveId(leaveId);
        setSelectedStatus(currentStatus);
        setDropdownVisible(true);
    };

    const filteredLeaveData = filterStatus === 'All'
        ? leaveData
        : leaveData.filter(item => item.status === filterStatus);

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[Louis_George_Cafe.bold.h5, { color: colors.textPrimary }]}>
                    {item.leaveType}
                </Text>
                <TouchableOpacity
                    onPress={() => item.status === 'Pending' && handleShowDropDown(item._id, item.status)}
                    style={[styles.statusBadge, {
                        backgroundColor: item.status === 'Approved' ? '#4CAF50' :
                            item.status === 'Pending' ? '#FF9800' : '#F44336'
                    }]}
                >
                    <Text style={[Louis_George_Cafe.bold.h7, styles.statusText]}>
                        {item.status}
                    </Text>
                    {item.status === 'Pending' &&
                        <MaterialCommunityIcons name={'chevron-down'} size={wp(5)} />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
                <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: colors.textPrimary }]}>
                    {t('startDate')}: <Text style={styles.value}>{formatDate(item.startDate)}</Text>
                </Text>
                <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: colors.textPrimary }]}>
                    {t('endDate')}: <Text style={styles.value}>{formatDate(item.endDate)}</Text>
                </Text>
                <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: colors.textPrimary }]}>
                    {t('reason')}: <Text style={styles.value}>{item.reason}</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderComponent showBackArray={true} title={t('LeaveManagement')} />

            {/* Filter Dropdown Trigger */}
            <TouchableOpacity
                onPress={() => setFilterDropdownVisible(true)}
                style={[styles.filterButton, { backgroundColor: colors.viewBackground }]}
            >
                <Text style={[Louis_George_Cafe.bold.h6, { color: colors.textPrimary }]}>
                    {t('filterByStatus')}: {filterStatus}
                </Text>
                <MaterialCommunityIcons name="chevron-down" color={colors.textPrimary} size={wp(5)} />
            </TouchableOpacity>

            {/* Leave List */}
            {loading ? (
                <ActivityIndicator size="large" color={colors.textPrimary} style={{ marginTop: hp(10) }} />
            ) : (
                <FlatList
                    data={filteredLeaveData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item._id}_${index}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: colors.textPrimary }]}>
                            {t('noLeaveData')}
                        </Text>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.textPrimary]}
                            tintColor={colors.textPrimary}
                        />
                    }
                />
            )}

            {/* Dropdown to Change Status */}
            <DropdownModal
                visible={dropdownVisible}
                items={statusArray.slice(2)} // Exclude 'All'
                selectedValue={selectedStatus}
                title={t('change_status')}
                onSelect={(selectedItem) => {
                    setPendingStatusChange({
                        leaveId: selectedLeaveId,
                        newStatus: selectedItem.value
                    });
                    setDropdownVisible(false);
                    setConfirmVisible(true);
                }}
                onCancel={() => setDropdownVisible(false)}
            />

            {/* Dropdown to Filter by Status */}
            <DropdownModal
                visible={filterDropdownVisible}
                items={statusArray}
                selectedValue={filterStatus}
                title={t('filterByStatus')}
                onSelect={(selectedItem) => {
                    setFilterStatus(selectedItem.value);
                    setFilterDropdownVisible(false);
                }}
                onCancel={() => setFilterDropdownVisible(false)}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={confirmVisible}
                message={`Are you sure you want to change the status to "${pendingStatusChange?.newStatus}"?`}
                onConfirm={() => {
                    if (pendingStatusChange) {
                        console.log('Confirmed change:', pendingStatusChange);
                        // TODO: Dispatch action or call API
                        handleUpdateApiCall()

                    }
                }}
                onCancel={() => {
                    setConfirmVisible(false);
                    setPendingStatusChange(null);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp(2),
        marginTop: hp(1),
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        borderWidth: wp(0.4),
        borderColor: "#444",
        // width:wp(100)
    },
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#efefef',
        marginHorizontal: wp(2),
        marginVertical: wp(1.5),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
    },
    statusBadge: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        paddingVertical: wp(2),
        borderRadius: wp(2),
        alignItems: "center",
    },
    statusText: {
        textTransform: 'capitalize',
    },
    cardContent: {
        marginTop: hp(0.5),
    },
    label: {
        fontSize: 16,
        marginBottom: hp(0.5),
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});

export default LeaveRequestList;
