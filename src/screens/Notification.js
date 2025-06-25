import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
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
import { useNavigation } from '@react-navigation/native';
 
const NotificationList = () => {   

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: t('notifications.welcomeTitle'),
            description: t('notifications.welcomeDescription'),
            image: require('../assets/animations/Isolation_shield.png'),
        },
        {
            id: 2,
            title: t('notifications.updateTitle'),
            description: t('notifications.updateDescription'),
            image: require('../assets/animations/Isolation_shield.png'),
        },
        {
            id: 3,
            title: t('notifications.offerTitle'),
            description: t('notifications.offerDescription'),
            image: require('../assets/animations/Isolation_shield.png'),
        },
    ]);

    const [refreshing, setRefreshing] = useState(false);

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate a network request
        setTimeout(() => {
            // Here you can make an API call or reset state
            setRefreshing(false);
        }, 200);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.notificationCard, { backgroundColor: THEMECOLORS[themeMode].cardBackground }]}>
            <Image source={item.image} style={styles.notificationImage} />
            <View style={styles.notificationTextContainer}>
                <Text style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].primaryText }]}>
                    {item.title}
                </Text>
                <Text style={[Louis_George_Cafe.regular.h8, { color: THEMECOLORS[themeMode].primaryText }]}>
                    {item.description}
                </Text>
            </View>
            <TouchableOpacity style={styles.closeIconContainer} onPress={() => dismissNotification(item.id)}>
                <Icon name="close-circle" size={wp(5)} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('notifications')} />
            <FlatList
                data={notifications}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                style={styles.list}
                contentContainerStyle={notifications.length === 0 && styles.emptyListContent}
                ListEmptyComponent={
                    <Text style={[Louis_George_Cafe.bold.h4, styles.noNotificationText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        {t('notifications_empty')}
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
        </View>
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
        alignItems: 'flex-start',
        position: 'relative',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    notificationImage: {
        width: wp(14),
        height: wp(14),
        marginRight: wp(3),
        borderRadius: wp(2),
    },
    notificationTextContainer: {
        flex: 1,
        paddingRight: wp(5),
    },
    closeIconContainer: {
        position: 'absolute',
        top: wp(1),
        right: wp(2),
        zIndex: 1,
    },
    
    noNotificationText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

export default NotificationList;
