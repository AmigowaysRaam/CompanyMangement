import React, { useState, useEffect, useCallback } from 'react';
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
import { getChatMessages, sendChatMessage } from '../redux/authActions';
import { t } from 'i18next';

const GroupChatScreen = ({ route }) => {

    const { themeMode } = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { chatId, projectName } = route.params;

    const currentUserEmail = 'ram@gmail.com'; // Replace this with dynamic user data in production
    const userId = __DEV__ ? "6852bee3cf20b70d77a5dfe0" : userdata?.id;

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) navigation.goBack();
    });

    const fetchChatListData = () => {
        dispatch(getChatMessages(userId, chatId, (response) => {
            if (response.success) {
                const sortedMessages = [...response?.data?.messages].sort((a, b) => {
                    const aTime = new Date(a.timestamp).getTime();
                    const bTime = new Date(b.timestamp).getTime();
                    return bTime - aTime; // newest first
                });
                setMessages(sortedMessages);
            }
        }));
    };

    const handleSend = () => {

        if (!message.trim()) return;
        const tempMessage = {
            id: Date.now().toString(),
            sender: currentUserEmail,
            content: message,
            timestamp: new Date().toISOString(),
            position: 'right',
        };

        setMessages(prev => [tempMessage, ...prev]);
        setMessage('');

        const payload = {
            senderId: userId,
            chatId,
            content: message,
        };

        dispatch(sendChatMessage(payload, (response) => {
            if (response.success) fetchChatListData();
        }));
    };

    useFocusEffect(
        useCallback(() => {
            fetchChatListData();
        }, [userdata])
    );

    const handleNavigatSettings = () => {
        navigation.navigate('GroupChatScren', {
            chatId, projectName
        })
    }

    const renderItem = ({ item }) => {
        const isOwnMessage = item.position === 'right';
        return (
            <View style={styles.chatItemContainer}>
                <View style={[
                    styles.messageRow,
                    { flexDirection: isOwnMessage ? 'row-reverse' : 'row' }
                ]}>
                    <View style={styles.messageContent}>
                        {!isOwnMessage && (
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={{ uri: item.profilePic }} style={styles.avatar} />
                                <Text style={[
                                    Louis_George_Cafe.regular.h7,
                                    styles.senderName,
                                    {
                                        // color: THEMECOLORS[themeMode].validation,
                                        marginLeft: wp(1),
                                        //   marginTop: wp(1) 
                                    }
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
                            }
                        ]}>
                            <Text style={[
                                styles.messageText,
                                {
                                    color: isOwnMessage
                                        ? THEMECOLORS[themeMode].white
                                        : THEMECOLORS[themeMode].black,
                                }
                            ]}>
                                {item.content}
                            </Text>
                            <View style={{
                                flexDirection:"row",
                                alignItems:"center",
                                alignSelf:"flex-end",
                                justifyContent:"space-between"
                            }}>
                                <Text style={[
                                    styles.timestamp,
                                    {
                                        color: isOwnMessage
                                            ? THEMECOLORS[themeMode].white
                                            : THEMECOLORS[themeMode].black,
                                    }
                                ]}>
                                    {new Date(item.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}

                                </Text>
                                {isOwnMessage &&
                                    <MaterialCommunityIcons
                                        name="check"
                                        size={hp(1.8)}
                                        color={THEMECOLORS[themeMode].white}
                                        style={{marginLeft:wp(2)}}
                                    />
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <HeaderComponent
                title={projectName}
                showBackArray={true}
                onTitleClick={() =>
                    // alert(chatId)
                    handleNavigatSettings()
                }
            />
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                        backgroundColor: themeMode !== 'dark' ? '#E5E5E5' : '#eee'
                    }
                ]}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder={t('type_a_message')}
                        style={[styles.input, {
                            // color: THEMECOLORS[themeMode].textPrimary,
                            // backgroundColor: 'red'
                        }]}
                    placeholderTextColor={THEMECOLORS[themeMode].primaryApp}
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
        borderRadius: wp(2),
        marginHorizontal: wp(3),
        marginVertical: wp(1),
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
