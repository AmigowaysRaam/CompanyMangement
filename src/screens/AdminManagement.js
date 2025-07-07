import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdminAction, getAdminList } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from 'react-native-toast-message';
import SearchInput from './SearchInput';

const AdminManagement = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);

    const [adminList, setAdminList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [searchText, setSearchText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchAdminData();
        }, [userdata])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchAdminData = () => {
        setLoading(true);
        dispatch(
            getAdminList({ userid: userdata?.id }, (response) => {
                if (response.success) {
                    setAdminList(response.data || []);
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchAdminData();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDeleteAdmin = (item) => {
        setSelectedAdmin(item);
        setModalVisible(true);
    };

    const confirmDeleteAdmin = () => {
        setModalVisible(false);
        if (selectedAdmin) {
            dispatch(deleteAdminAction({ id: selectedAdmin._id, userid: userdata?.id }, (response) => {
                Toast.show({
                    type: response?.success ? 'success' : 'error',
                    text1: response?.message,
                });
                if (response.success) {
                    fetchAdminData();
                }
            }));
            setSelectedAdmin(null);
        }
    };

    const filteredAdminList = adminList.filter((admin) => {
        const lowerSearch = searchText.toLowerCase();
        return (
            admin?.fullName?.toLowerCase().includes(lowerSearch) ||
            admin?.email?.toLowerCase().includes(lowerSearch) ||
            admin?.phone?.toLowerCase().includes(lowerSearch)
        );
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", borderBottomWidth: wp(0.1), borderColor: "#ccc", marginBottom: wp(4) }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        source={item?.imageUrl ? { uri: item?.imageUrl } : null}
                        style={styles.profileImage}
                    />
                    <View>
                        <Text style={[Louis_George_Cafe.bold.h5, styles.name, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {item?.fullName || 'Admin'}
                        </Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AdminCreating', { data: item })}>
                        <Text style={[Louis_George_Cafe.bold.h5, styles.name, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {'edit'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDeleteAdmin(item)}>
                        <Text style={[Louis_George_Cafe.bold.h5, styles.name, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {'delete'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <MaterialCommunityIcons
                    name="email-outline"
                    size={wp(5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={styles.icon}
                />
                <Text style={[Louis_George_Cafe.regular.h7, styles.info, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item?.email || 'Not available'}
                </Text>
            </View>

            <View style={styles.row}>
                <MaterialCommunityIcons
                    name="phone-outline"
                    size={wp(5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={styles.icon}
                />
                <Text style={[Louis_George_Cafe.regular.h7, styles.info, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item?.phone || 'Not available'}
                </Text>
            </View>

            <View style={styles.row}>
                <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={wp(5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={styles.icon}
                />
                <Text style={[Louis_George_Cafe.regular.h7, styles.info, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    Last Login: {formatDate(item?.lastLoginAt)}
                </Text>
            </View>

            <View style={styles.row}>
                <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={wp(5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={styles.icon}
                />
                <Text style={[Louis_George_Cafe.regular.h7, styles.info, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item?.lastLoginLocation || 'Unknown'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('AdminManagement')} />
            <TouchableOpacity
                onPress={() => navigation.navigate('AdminCreating', { data: null })}
                style={[styles.addButton, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
            >
                <Text style={[styles.addButtonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                    {t('add_new')}
                </Text>
                <MaterialCommunityIcons
                    name="plus-circle"
                    size={hp(2.5)}
                    color={THEMECOLORS[themeMode].buttonText}
                    style={{ paddingLeft: wp(2) }}
                />
            </TouchableOpacity>

            <View style={{ padding: wp(1), paddingHorizontal: hp(2), marginTop: wp(0) }}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>

            {
                loading ? (
                    <ActivityIndicator
                        size="large"
                        color={THEMECOLORS[themeMode].textPrimary}
                        style={{ marginTop: hp(10) }}
                    />
                ) : (
                    <FlatList
                        data={filteredAdminList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item._id}_${index}`}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
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
                )
            }
            <ConfirmationModal
                visible={isModalVisible}
                message={`Are you sure you want to delete ${selectedAdmin?.fullName || 'this admin'}?`}
                onConfirm={confirmDeleteAdmin}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(1)
    },
    listContainer: {
        paddingBottom: hp(10),
    },
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#e1e1e1',
        marginHorizontal: wp(2),
        marginVertical: wp(1.5),
    },
    name: {
        marginBottom: hp(1),
        textTransform: 'capitalize',
    },
    profileImage: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(7),
        borderColor: '#fff',
        marginRight: wp(4)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.9),
    },
    icon: {
        marginRight: wp(2),
    },
    info: {
        fontSize: wp(4),
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
        fontSize: wp(4.5),
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        margin: wp(3),
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        borderRadius: wp(6),
        elevation: 3,
    },
    addButtonText: {
        fontSize: wp(3.8),
        fontFamily: Louis_George_Cafe.bold.h7.fontFamily,
        textTransform: 'capitalize',
    },
});

export default AdminManagement;
