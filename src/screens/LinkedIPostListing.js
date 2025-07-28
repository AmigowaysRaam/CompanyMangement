import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl,
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
import { useNavigation, useRoute } from '@react-navigation/native';

const LinkedIPostListing = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const accessToken = route.params?.accessToken;
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    // Fetch posts from LinkedIn API using the access token
    const fetchPosts = async () => {
        try {
            // Step 1: Get the authenticated user's ID
            const userResponse = await fetch('https://api.linkedin.com/v2/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json',
                },
            });
    
            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                console.error(`Failed to fetch user details: ${userResponse.status}`, errorText);
                alert(`Error fetching user details: ${userResponse.status} - ${errorText}`);
                return;
            }
    
            const userData = await userResponse.json();
            const userId = userData.id; // This is the LinkedIn user ID
    
            // Step 2: Use the user ID to fetch the user's posts
            const postsResponse = await fetch(`https://api.linkedin.com/v2/ugcPosts?authors=urn:li:person:${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json',
                },
            });
    
            if (postsResponse.ok) {
                const postsData = await postsResponse.json();
                console.log("Fetched LinkedIn posts:", postsData);
                setPosts(postsData.elements); // Assuming posts are in 'elements' field
            } else {
                const errorText = await postsResponse.text();
                console.error(`Failed to fetch posts: ${postsResponse.status}`, errorText);
                alert(`Error: ${postsResponse.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            alert('Error fetching posts, please try again later.');
        }
    };
    
    

    useEffect(() => {
        fetchPosts();
    }, [accessToken]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
        setRefreshing(false);
    };

    const dismissNotification = (id) => {
        setPosts(prev => prev.filter(post => post.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={[styles.notificationCard, { backgroundColor: THEMECOLORS[themeMode].cardBackground }]}>
            <Image source={{ uri: item.author.profilePicture.displayImage}} style={styles.notificationImage} />
            <View style={styles.notificationTextContainer}>
                <Text style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].primaryText }]}>
                    {item.author.firstName.localized.en_US} {item.author.lastName.localized.en_US}
                </Text>
                <Text style={[Louis_George_Cafe.regular.h8, { color: THEMECOLORS[themeMode].primaryText }]}>
                    {item.specificContent.com.linkedin.ugc.ShareContent.text}
                </Text>
            </View>
            <TouchableOpacity style={styles.closeIconContainer} onPress={() => dismissNotification(item.id)}>
                <Icon name="close-circle" size={wp(5)} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('post of linkedin')} />
            <FlatList
                data={posts}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                style={styles.list}
                contentContainerStyle={posts.length === 0 && styles.emptyListContent}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1, paddingHorizontal: wp(2), paddingVertical: wp(2),
    },
    notificationCard: {
        flexDirection: 'row', padding: wp(3),
        borderRadius: wp(3), marginBottom: hp(2), alignItems: 'flex-start',
        position: 'relative', shadowColor: '#000', shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3,
    },
    notificationImage: {
        width: wp(14), height: wp(14), marginRight: wp(3), borderRadius: wp(2),
    },
    notificationTextContainer: {
        flex: 1, paddingRight: wp(5),
    },
    closeIconContainer: {
        position: 'absolute', top: wp(1), right: wp(2),
        zIndex: 1,
    },
    noNotificationText: {
        textAlign: 'center', marginTop: hp(10),
    }, 
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

export default LinkedIPostListing;
