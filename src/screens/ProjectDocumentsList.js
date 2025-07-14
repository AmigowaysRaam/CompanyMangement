import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Linking,
    ActivityIndicator,
    Alert
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
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getProjectDosc } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProjectDocumentsList = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const route = useRoute();
    const projectData = route.params?.data;

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);  // <-- loading state

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchHomeData = () => {
        // alert(JSON.stringify(projectData))
        setLoading(true);
        let payload = {
            userid: userdata?.id,
            projectId: projectData?.id || projectData?._id
        };
        dispatch(
            getProjectDosc(payload, (response) => {
                if (response.success) {
                    setNotifications(response?.data);
                } else {
                    Alert.alert(t('error'), t('failed_to_load_documents'));
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchHomeData();
    };

    // Fetch data on screen focus or when userdata changes
    useFocusEffect(
        React.useCallback(() => {
            fetchHomeData();
        }, [userdata])
    );

    const handleDownload = (url) => {
        if (!url) return;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(t('error'), t('cannot_open_url'));
                }
            })
            .catch((err) => {
                console.error('An error occurred', err);
                Alert.alert(t('error'), t('something_went_wrong'));
            });
    };

    const renderItem = ({ item }) => (
        <View style={[styles.notificationCard, { backgroundColor: THEMECOLORS[themeMode].cardBackground }]}>
            {item.image ? (
                <Image source={item.image} style={styles.notificationImage} />
            ) : (
                <MaterialCommunityIcons
                    name="file-document"
                    size={hp(4)}
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={{ marginRight: wp(3) }}
                />
            )}
            <View style={styles.notificationTextContainer}>
                <Text style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].primaryText }]}>
                    {item.name}
                </Text>
                <Text style={[Louis_George_Cafe.regular.h8, { color: THEMECOLORS[themeMode].primaryText }]}>
                    {item.type}
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleDownload(item.url)}>
                <MaterialCommunityIcons
                    name="download-circle-outline"
                    size={hp(5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('ProjectDocumentsList')} />

            {loading ? (
                <View style={[{ marginTop: hp(10) }]}>
                    <ActivityIndicator size="large" color={COLORS.button_bg_color} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={renderItem}
                    style={styles.list}
                    contentContainerStyle={notifications.length === 0 && styles.emptyListContent}
                    ListEmptyComponent={
                        <Text style={[Louis_George_Cafe.bold.h4, styles.noNotificationText, { color: THEMECOLORS[themeMode].textPrimary }]}>
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
                />
            )
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
        paddingHorizontal: wp(2),
        paddingVertical: wp(2),
    },
    notificationCard: {
        flexDirection: 'row',
        padding: wp(3),
        borderRadius: wp(3),
        marginBottom: hp(2),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        justifyContent: "center"
    },
    notificationImage: {
        width: hp(6),
        height: hp(6),
        marginRight: wp(3),
        borderRadius: wp(1),
        resizeMode: 'cover'
    },
    notificationTextContainer: {
        flex: 1,
        paddingRight: wp(5),
    },
    noNotificationText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProjectDocumentsList;
