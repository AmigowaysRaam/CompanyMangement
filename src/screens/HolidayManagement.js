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
import { getHolidayLIstApi, deleteHolidayApi } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import ConfirmationModal from '../components/ConfirmationModal';
import SearchInput from './SearchInput';

const HolidayManagement = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const [holidayData, setholidayData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState(null); // holds item to be deleted
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [searchText, setSearchText] = useState('');

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

    const filteredHolidayData = holidayData.filter(item =>
        item.holidayName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
    );


    const fetchLeaveData = () => {
        setLoading(true);
        dispatch(
            getHolidayLIstApi({ userId: userdata?.id }, (response) => {
                if (response.success) {
                    setholidayData(response.data || []);
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

    const confirmDelete = () => {
        dispatch(
            deleteHolidayApi({ userId: userdata?.id, id: deleteItem?._id }, (response) => {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                if (response.success) {
                    onRefresh();
                }
                setShowConfirmModal(false);
                setDeleteItem(null);
            })
        );
    };

    const renderItem = ({ item }) => (
        <View style={{ paddingHorizontal: wp(2) }}>
            <MaterialCommunityIcons
                onPress={() => {
                    setDeleteItem(item);
                    setShowConfirmModal(true);
                }}
                name={'close-circle'}
                size={hp(4)}
                color={themeMode === 'light' ? THEMECOLORS[themeMode].validation : THEMECOLORS[themeMode].accent}
                style={{ paddingHorizontal: wp(2), alignSelf: 'flex-end', zIndex: 999, position: 'relative', top: hp(2), left: wp(2),zIndex:10 }}
            />
            <TouchableOpacity
                style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}
                onPress={() => navigation.navigate('HolidayForm', { data: item })}
            >
                <View style={styles.cardHeader}>
                    <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {item.holidayName}
                    </Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {t('holidayDate')}: <Text style={styles.value}>{formatDate(item.date)}</Text>
                    </Text>
                    <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {t('description')}: <Text style={styles.value}>{item.description}</Text>
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('HolidayManagement')} />
            <View style={{ padding: wp(1), paddingHorizontal: hp(3) ,marginTop:wp(4)}}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('HolidayForm', { data: null })}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    margin: wp(2),
                    padding: wp(2),
                    backgroundColor: THEMECOLORS[themeMode].buttonBg,
                    borderRadius: wp(5),
                }}
            >
                <Text
                    style={[
                        Louis_George_Cafe.bold.h7,
                        {
                            color: THEMECOLORS[themeMode].buttonText,
                            textTransform: 'capitalize',
                            lineHeight: wp(4),
                        },
                    ]}
                >
                    {t('add_new')}
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
                    data={filteredHolidayData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item._id}_${index}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
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
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                visible={showConfirmModal}
                message={t('areYouSureDelete')}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowConfirmModal(false);
                    setDeleteItem(null);
                }}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: wp(2)
    },
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#efefef',
        marginHorizontal: wp(2),
        marginVertical: wp(1),

    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
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
export default HolidayManagement;
