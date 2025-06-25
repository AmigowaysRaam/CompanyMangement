import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { changeTaskStatus, getTaskAssignedArray } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { MaterialIcons } from '@expo/vector-icons';
import DropdownModal from '../components/DropDownModal';

const AssignedTask = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const [projectStatus, setProjectStatus] = useState('');

    const [tid, setTaskId] = useState(null);


    const [leaveData, setLeaveData] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projectStatusArrShow, setShowprojectStatusDropdownVisible] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            fetchAssignedtask();
        }, [userdata])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchAssignedtask = () => {
        setLoading(true);
        dispatch(
            getTaskAssignedArray({ userid: userdata?.id }, (response) => {
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
        fetchAssignedtask();
    };

    const projectStatusArr = [

        { label: t('pending'), value: 'Pending' },
        { label: t('inprogress'), value: 'In Progress' },
        { label: t('completed'), value: 'Completed' },
    ]

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    const handleOpenChangeStatus = (item) => {
        setTaskId(item?._id)
        setShowprojectStatusDropdownVisible(true);
    }


    const handleChangeStatus = (item) => {
        // setShowprojectStatusDropdownVisible(true);
        // alert(item)
        let payLoad = {
            taskId: tid,
            userid: userdata?.id,
            taskStatus: item,
        }
        dispatch(
            changeTaskStatus(payLoad, (response) => {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                setTaskId(null)
                if (response.success) {
                    onRefresh();
                }
            })
        );
        // alert(JSON.stringify(payLoad, null, 2))
    }


    const renderItem = ({ item }) => {
        const isExpanded = expandedItems[item._id] || false;

        return (
            <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
                <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.cardHeader}>
                    <Text style={[Louis_George_Cafe.bold.h4, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {item?.title}
                    </Text>
                    <MaterialIcons
                        name={isExpanded ? 'expand-less' : 'expand-more'}
                        size={wp(10)}
                        color={THEMECOLORS[themeMode].textPrimary}
                    />
                </TouchableOpacity>
                <View style={styles.cardContent}>
                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>{t('description')}: <Text style={styles.value}>{item.description}</Text></Text>
                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>{t('startDate')}: <Text style={styles.value}>{formatDate(item.startDate)}</Text></Text>
                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>{t('priority')}: <Text style={styles.value}>{item.priority}</Text></Text>
                    <View style={{
                        flexDirection: "row", alignItems: "center",marginTop:wp(1)
                    }}>
                        <Text style={[Louis_George_Cafe.regular.h6, styles.itemText]}>{t('status')}:
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleOpenChangeStatus(item)}
                            style={{
                                flexDirection: "row", alignItems: "center",
                                backgroundColor: "#F2E8FF", paddingHorizontal: wp(1), 
                                marginHorizontal:wp(1),
                                borderRadius: wp(2)
                            }}>
                            <Text style={[Louis_George_Cafe.bold.h6, {
                                backgroundColor: "#F2E8FF", padding: wp(2), borderRadius: wp(2)
                            }]}>{item?.taskStatus}
                            </Text>
                            <MaterialIcons
                                name={'edit'}
                                size={wp(6)}
                                color={THEMECOLORS[themeMode].textPrimary}
                            />
                        </TouchableOpacity>

                    </View>

                    {isExpanded && (
                        <>
                            {/* Employee Info */}
                            {item.employee && (
                                <>
                                    <Text style={styles.sectionTitle}>{t('employeeDetails')}:</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>👤 {item.employee.full_name}</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>📧 {item.employee.email}</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>📞 {item.employee.phone}</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>🏢 {item.employee.city}, {item.employee.state_province}</Text>
                                </>
                            )}

                            {/* Client Info */}
                            {item.client && (
                                <>
                                    <Text style={styles.sectionTitle}>{t('clientDetails')}:</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>🏢 {item.client.name}</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>📧 {item.client.email}</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>🌐 {item.client.website}</Text>
                                </>
                            )}

                            {/* Project Info */}
                            {item.project && (
                                <>
                                    <Text style={styles.sectionTitle}>{t('projectDetails')}:</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>📁 {item.project.projectName}</Text>
                                    <Text style={[Louis_George_Cafe.regular.h7, styles.itemText]}>📅 {formatDate(item.project.startDate)}</Text>
                                </>
                            )}
                        </>
                    )}
                </View>
            </View >
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('AssignedTask')} />
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
                    keyExtractor={(item, index) => `${item._id}_${index}`}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {t('noTaskData')}
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
            <DropdownModal
                selectedValue={projectStatus}
                visible={projectStatusArrShow}
                items={projectStatusArr}
                onSelect={(item) => {
                    handleChangeStatus(item.value);
                    setShowprojectStatusDropdownVisible(false);
                }}
                onCancel={() => setShowprojectStatusDropdownVisible(false)}
                title={t('projectStatus')}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    listContainer: {
        paddingBottom: hp(10),
    },

    card: {
        borderRadius: wp(3),
        padding: wp(2),
        borderWidth: 1,
        borderColor: '#efefef',
        marginHorizontal: wp(2),
        marginVertical: wp(1.5),
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Android shadow
        // elevation: 6,
        // backgroundColor: '#000', // Required for shadow to be visible on Android
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1),
        backgroundColor: "#F2E8FF",
        paddingHorizontal: wp(2),
        borderRadius: wp(2),
        paddingVertical: wp(2)
    },
    cardContent: {
        marginTop: hp(0.5),
    },
    
    itemText: {
        // fontSize: 15,
        marginBottom: hp(0.6),
        color: '#555',
        margin: wp(1)
    },
    value: {
        fontWeight: '600',
        color: '#000',
        margin:wp(4)
    },
    sectionTitle: {
        marginTop: hp(1),
        fontWeight: '700',
        fontSize: 16,
        color: '#222',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});

export default AssignedTask;
