import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { COLORS } from '../resources/Colors';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskList } from '../redux/authActions';

const TaskManagement = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchTaskList = () => {
        setLoading(true);
        dispatch(
            getTaskList(userdata?.id, (response) => {
                if (response.success) {
                    setNotifications(response.data);
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchTaskList();
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTaskList();
        }, [userdata])
    );

    // Convert ISO date to readable format
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    const renderPriorityIcon = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return <Icon name="alert-circle" size={wp(10)} color="#e74c3c" />;
            case 'medium':
                return <Icon name="warning" size={wp(10)} color="#f39c12" />;
            case 'low':
                return <Icon name="checkmark-circle" size={wp(10)} color="#27ae60" />;
            default:
                return null;
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].cardBackground }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreateTask', { taskId: item._id })}
        >
            {/* <Text>{JSON.stringify( item._id)}</Text> */}
            <View style={styles.cardHeader}>
                <Text style={[Louis_George_Cafe.bold.h4, { color: THEMECOLORS[themeMode].primaryText, flex: 1 }]}>
                    {item.title || t('no_title')}
                </Text>
                {renderPriorityIcon(item.priority)}
            </View>

            <Text style={[Louis_George_Cafe.regular.h8, { color: THEMECOLORS[themeMode].primaryText, marginTop: hp(0.5) }]}>
                {item.description || t('no_description')}
            </Text>

            <View style={styles.infoRow}>
                <Icon name="calendar-outline" size={16} color={THEMECOLORS[themeMode].secondaryText} />
                <Text style={[Louis_George_Cafe.regular.h7, { color: THEMECOLORS[themeMode].secondaryText, marginLeft: wp(1) }]}>
                    {formatDate(item.startDate)}
                </Text>
            </View>

            {item.project?.projectName && (
                <View style={styles.infoRow}>
                    <Icon name="briefcase-outline" size={16} color={THEMECOLORS[themeMode].secondaryText} />
                    <Text style={[Louis_George_Cafe.regular.h6, { color: THEMECOLORS[themeMode].secondaryText, marginLeft: wp(1) }]}>
                        {item.project.projectName}
                    </Text>
                </View>
            )}

            {item.client?.name && (
                <View style={styles.infoRow}>
                    <Icon name="people-outline" size={16} color={THEMECOLORS[themeMode].secondaryText} />
                    <Text style={[Louis_George_Cafe.regular.h6, { color: THEMECOLORS[themeMode].secondaryText, marginLeft: wp(1) }]}>
                        {item.client.name}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('tasks_management')} />
            {
                loading ?
                    <ActivityIndicator size={wp(10)} style={{marginTop:hp(20)}} />

                    :
                    <>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('CreateTask', { taskId: null })}
                            style={[styles.addButton, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                        >
                            <Text style={[Louis_George_Cafe.regular.h7, { color: THEMECOLORS[themeMode].buttonText }]}>
                                {t('add_task')}
                            </Text>
                        </TouchableOpacity>

                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item._id || item.id?.toString() || Math.random().toString()}
                            renderItem={renderItem}
                            contentContainerStyle={notifications.length === 0 && styles.emptyListContent}
                            ListEmptyComponent={
                                <Text style={[Louis_George_Cafe.bold.h4, styles.noDataText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('no_data')}
                                </Text>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[COLORS.button_bg_color]}
                                    tintColor={COLORS.button_bg_color}
                                />
                            }
                            style={styles.list}
                        />

                    </>
            }




        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        alignSelf: 'flex-end',
        margin: wp(4),
        paddingVertical: hp(1),
        paddingHorizontal: wp(6),
        borderRadius: wp(5),
    },
    list: {
        flex: 1,
        paddingHorizontal: wp(3),
    },
    card: {
        backgroundColor: COLORS.white,
        padding: wp(4),
        borderRadius: wp(2),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.8),
    },
    noDataText: {
        textAlign: 'center',
        marginTop: hp(2),
    },
    emptyListContent: {
        // flexGrow: 1,
        justifyContent: 'center',
    },
});

export default TaskManagement;
