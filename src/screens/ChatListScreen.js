import React, { useState,  } from 'react';
import {
    View,Text,StyleSheet,FlatList,Image, TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../components/HeaderComponent';
import SearchInput from './SearchInput';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getChatListApi,  } from '../redux/authActions';
import { useFocusEffect } from '@react-navigation/native';

const ChatListScreen = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [chats, setChats] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchHomeData();
        setTimeout(() => setRefreshing(false), 1000);
    };


    const fetchHomeData = () => {
        setLoading(true);
        dispatch(
            getChatListApi(userdata?.id, (response) => {
                if (response.success) {
                    setChats(response?.data)
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    // Fetch data on screen focus or when userdata changes
    useFocusEffect(
        React.useCallback(() => {
            // alert(JSON.stringify(userdata))
            fetchHomeData();
        }, [userdata])
    );

    const staticMapItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const renderStaticMapItem = () => {
        return staticMapItems.map((item, index) => (
            <View
                key={index}
                style={{
                    backgroundColor: themeMode === 'dark' ? "#222" : "#f1f1f1",
                    width: wp(90),
                    height: hp(10),
                    borderRadius: wp(3),
                    alignSelf: "center",
                    marginVertical: wp(2),
                }}
            />
        ));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatCard}>
            <Image
                source={item.profilePic ? { uri: item.profilePic } : require('../../src/assets/animations/anew.png')}
                style={styles.avatar}
            />
            <View style={styles.chatInfo}>
                <Text style={[styles.chatName, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item.name}
                </Text>
                <Text style={[styles.chatLastSeen, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item.lastMessage}
                </Text>
            </View>
            <Text style={[Louis_George_Cafe.regular.h8, {
                color: THEMECOLORS[themeMode].white,
                backgroundColor: THEMECOLORS[themeMode].primaryApp, borderRadius: wp(4), paddingHorizontal: wp(1.5), marginHorizontal: wp(4),
            }]}>
                {1}
            </Text>
            <View>
                <Text style={[styles.lastMessage, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {item.lastSeen}
                </Text>
                <MaterialCommunityIcons name={"check-all"} size={hp(2)} color={THEMECOLORS[themeMode].primary} style={{ marginVertical: wp(2) }} />
            </View>

        </TouchableOpacity>
    );

    return (
        <>
            <HeaderComponent title={t('Chats')} showBackArray={true} />
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                {/* <ThemeToggle/> */}
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
                {
                    loading ?
                        renderStaticMapItem() :
                        <>
                            <FlatList
                                data={filteredChats}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingBottom: hp(2) }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        tintColor={THEMECOLORS[themeMode].primaryApp}
                                        colors={['#013CA3']}
                                    />
                                }
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>{t('no_data')}</Text>
                                    </View>
                                }
                            />
                        </>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        borderBottomWidth: wp(0.2),
        borderColor: '#CCC',
    },
    avatar: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        marginRight: wp(3),
        padding: wp(2)
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chatName: {
        fontSize: wp(3.8),
        fontFamily: Louis_George_Cafe.bold?.h9.fontFamily,
    },
    chatLastSeen: {
        fontSize: wp(3),
        marginTop: hp(0.5),
        fontFamily: Louis_George_Cafe.regular?.h9.fontFamily,
    },
    lastMessage: {
        fontSize: wp(3),
        fontFamily: Louis_George_Cafe.regular?.h9.fontFamily,
    },
    emptyContainer: {
        paddingTop: hp(5),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: wp(4),
        color: '#555',
    },
});

export default ChatListScreen;
