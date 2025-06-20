import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput,
    TouchableOpacity, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatListApi, getChatMessages } from '../redux/authActions';

const GroupChatScreen = ({ route }) => {

    const { themeMode } = useTheme();
    const [message, setMessage] = useState('');
    const { chatId, projectName } = route.params;
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const [messages, setMessages] = useState([
        {
            id: '1',
            sender: 'ram@gmail.com',
            name: 'Ram',
            content: 'Hey team, how’s it going?',
            timestamp: '10:00 AM',
            profilePic: 'https://www.alpha-verse.com/assets/images/wallpapers/bg-1.png',
        },
        {
            id: '2',
            sender: 'divyaTest@gmail.com',
            name: 'Divya',
            content: 'All good here!',
            timestamp: '10:01 AM',
            profilePic: 'https://www.alpha-verse.com/assets/images/wallpapers/bg-1.png',
        },
    ]);

    const currentUserEmail = 'ram@gmail.com'; // Replace with dynamic user info in production

    const handleSend = () => {
        if (message.trim() === '') return;

        const newMessage = {
            id: Date.now().toString(),
            sender: currentUserEmail,
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([newMessage, ...messages]); // Prepend message
        setMessage('');
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchChatListData();
        }, [userdata])
    );


    const fetchChatListData = () => {
        // setLoading(true);
        const userId = __DEV__ ? "6852bee3cf20b70d77a5dfe0" : userdata?.id;

        dispatch(getChatMessages(userId,chatId, (response) => {
            alert(JSON.stringify(response.data.messages,null,2))
            if (response.success) {
                setMessages(response?.data?.messages);
            }
            // setLoading(false);
            // setRefreshing(false);
        }));
    };

    const renderItem = ({ item }) => {
        const isOwnMessage = item.sender === currentUserEmail;

        return (
            <View style={styles.chatItemContainer}>
                <View style={[
                    styles.messageRow,
                    { flexDirection: isOwnMessage ? 'row-reverse' : 'row' }
                ]}>

                    <View style={styles.messageContent}>
                    {!isOwnMessage && (
                                <View style={{ flexDirection: 'row',
                                //  backgroundColor:"red" 
                                 }}>
                                    <Image
                                        source={{ uri: item.profilePic }}
                                        style={styles.avatar}
                                    />
                                    <Text style={[Louis_George_Cafe.regular.h7,
                                    styles.senderName,
                                    { color: THEMECOLORS[themeMode].textSecondary, marginLeft: wp(1), marginTop: wp(1) }
                                    ]}>
                                        {item.name}
                                    </Text>
                                </View>
                            )}
                        <View style={[
                            styles.messageContainer,
                            {
                                backgroundColor: isOwnMessage
                                    ? THEMECOLORS[themeMode].primaryApp
                                    : '#ccc',
                                // alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                            }
                        ]}>
                           

                            <Text style={[
                                styles.messageText,
                                {
                                    color: isOwnMessage
                                        ? THEMECOLORS[themeMode].white
                                        : THEMECOLORS[themeMode].textPrimary,
                                }
                            ]}>
                                {item.content}
                            </Text>
                            <Text style={[
                                styles.timestamp,
                                {
                                    color: isOwnMessage
                                        ? THEMECOLORS[themeMode].white
                                        : THEMECOLORS[themeMode].textSecondary,
                                }
                            ]}>
                                {item.timestamp}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <HeaderComponent title={projectName} showBackArray={true} onTitleClick={() => alert(chatId)} />
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={hp(10)}
            >
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: hp(1) }}
                    inverted
                />
                <View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: THEMECOLORS[themeMode].inputBackground
                            || (themeMode === 'dark' ? '#333' : '#eee')
                    }
                ]}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message"
                        placeholderTextColor={THEMECOLORS[themeMode].textSecondary}
                        style={[styles.input, { color: THEMECOLORS[themeMode].textPrimary }]}
                    />
                    <TouchableOpacity onPress={handleSend}>
                        <MaterialCommunityIcons
                            name="send"
                            size={hp(3)}
                            color={THEMECOLORS[themeMode].primaryApp}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    chatItemContainer: {
        width: '100%',
        // paddingHorizontal: wp(3),
        marginVertical: hp(0.5),
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    messageContent: {
        maxWidth: wp(75),
        marginHorizontal: wp(2),
    },
    senderName: {
        marginBottom: hp(0.3),
        fontWeight: '600',
        fontFamily: Louis_George_Cafe.regular?.h9.fontFamily,
    },
    messageContainer: {
        padding: wp(2),
        borderRadius: wp(4),
        // paddingHorizontal: wp(7)
    },
    messageText: {
        fontSize: wp(3.5),
        fontFamily: Louis_George_Cafe.regular?.h9.fontFamily,
    },
    timestamp: {
        fontSize: wp(1.8),
        textAlign: 'right',
        marginTop: hp(0.5),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.4),
        marginHorizontal: wp(1),
        borderRadius: wp(4),
    },
    input: {
        flex: 1,
        fontSize: wp(3.5),
        fontFamily: Louis_George_Cafe.regular?.h9.fontFamily,
        marginRight: wp(2),
    },
    avatar: {
        width: wp(5),
        height: wp(5),
        borderRadius: wp(4),
        marginTop: hp(0.5),
    },
});

export default GroupChatScreen;
