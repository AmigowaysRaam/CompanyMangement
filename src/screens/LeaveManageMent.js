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
import { getLeaveArray } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const LeaveManageMent = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    const [leaveData, setLeaveData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

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
            getLeaveArray(userdata?.id, (response) => {
                if (response.success) {
                    setLeaveData(response.data || []);
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaveData(); // `setRefreshing(false)` handled inside `fetchLeaveData`
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>

            <View style={styles.cardHeader}>
                <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item.leaveType}
                </Text>
                <View style={[styles.statusBadge, {
                    backgroundColor: item.status === 'Approved' ? '#4CAF50' :
                        item.status === 'Pending' ? '#FF9800' : '#F44336'
                }]}>
                    <Text style={[Louis_George_Cafe.bold.h7, styles.statusText]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={[Louis_George_Cafe.regular.h7, styles.label,
                { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('startDate')}: <Text style={styles.value}>{formatDate(item.startDate)}</Text>
                </Text>
                <Text style={[Louis_George_Cafe.regular.h7, styles.label,
                { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('endDate')}: <Text style={styles.value}>{formatDate(item.endDate)}</Text>
                </Text>
                <Text style={[Louis_George_Cafe.regular.h7, styles.label,
                { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('reason')}: <Text style={styles.value}>{item.reason}</Text>
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('LeaveManagement')} />
            <TouchableOpacity
                onPress={() => navigation.navigate('AddLeaveForm')}
                style={{
                    flexDirection: "row", justifyContent: "space-around", alignItems: "center", alignSelf: "flex-end",
                    margin: wp(2),
                    padding: wp(2), backgroundColor: THEMECOLORS[themeMode].buttonBg,
                    borderRadius: wp(5)
                }}>
                <Text style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].buttonText, textTransform: "capitalize", lineHeight: wp(4) }]}>
                    {t('apply_leave')}
                </Text>
                <MaterialCommunityIcons
                    name={'plus-circle'}
                    size={hp(2.5)}
                    color={THEMECOLORS[themeMode].buttonText}
                    style={{ paddingHorizontal: wp(2) }}
                />
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={{ marginTop: hp(10) }}
                />
            ) : (
                <FlatList
                    data={leaveData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {t('noLeaveData')}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {},
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
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.3),
        borderRadius: wp(2),
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
    value: {},
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});

export default LeaveManageMent;
