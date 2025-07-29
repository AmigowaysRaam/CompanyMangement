import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList,
  Text, View, TextInput, TouchableOpacity
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { hp, wp } from '../resources/dimensions';
import { useRoute } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LinkedInChatScreen = () => {

  const { themeMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null); // <-- Ref for FlatList
  const route = useRoute();
  const chatItem = route.params?.data;
  const UNIPILE_API_KEY = 'fRH98sg7.CLwZfAPGcg/w0MFME/J61iF1K+6YlIhCMZqxwZ2w7To=';

  useEffect(() => {
    fetchMessages();
  }, []);
  // Scroll to bottom on message updates
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `https://api16.unipile.com:14657/api/v1/chats/${chatItem?.id}/messages`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-KEY': UNIPILE_API_KEY,
          },
        }
      );
      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ API error: ${res.status} - ${err}`);
        return;
      }
      const data = await res.json();
      setMessages(data.items || []);
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };
  const renderMessage = ({ item }) => {
    const isSender = item.is_sender === 1;
    const containerStyle = isSender ? styles.messageRight : styles.messageLeft;
    const bubbleStyle = isSender ? styles.bubbleRight : styles.bubbleLeft;
    const textStyle = isSender ? styles.textRight : styles.textLeft;
    const formatTimestamp = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
      });
    };
    return (
      <View style={[styles.messageContainer, containerStyle]}>
        <View style={[styles.bubble, bubbleStyle]}>
          <Text style={[Louis_George_Cafe.regular.h8, textStyle]}>{item?.text}</Text>
          <Text style={[Louis_George_Cafe.regular.h9, { fontSize: wp(2) }, textStyle]}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const form = new FormData();
    form.append('text', newMessage);
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-KEY': UNIPILE_API_KEY,
      },
      body: form,
    };
    try {
      setSending(true);
      const res = await fetch(
        `https://api16.unipile.com:14657/api/v1/chats/${chatItem?.id}/messages`,
        options
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      // console.log('✅ Message sent:', data);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('❌ Error sending message:', err.message);
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <HeaderComponent title={chatItem?.mailbox_name || chatItem?.subject || 'Chat'} showBackArray={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
      >
        {loading ? (
          <ActivityIndicator size="large" color={THEMECOLORS[themeMode].text} />
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={[...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.listContent}
              onLayout={scrollToBottom}
            />
            <View style={styles.inputContainer}>
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
                style={[Louis_George_Cafe.bold.h6, styles.textInput]}
                placeholderTextColor="#666"
              />
              {sending && (
                <ActivityIndicator
                  size={wp(6)}
                  color="#4f93ff"
                  style={styles.textInput}
                />
              )}
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={sending || !newMessage.trim()}
              >
                <MaterialCommunityIcons name={sending ? "send" : 'send'} size={hp(3)} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: wp(3) },
  listContent: { paddingVertical: 10 },
  messageContainer: { flexDirection: 'row', marginVertical: 5 },
  messageLeft: { justifyContent: 'flex-start' },
  messageRight: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  bubble: {
    maxWidth: '75%', padding: 10, borderRadius: 12,
  },
  bubbleLeft: {
    backgroundColor: '#e0e0e0', borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: '#4f93ff', borderTopRightRadius: 0,
  },
  textLeft: { color: '#000' }, textRight: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(2), paddingVertical: wp(2), borderTopWidth: 1, borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f2f2f2', borderRadius: 20, paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginRight: 10, fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4f93ff', paddingHorizontal: wp(2), paddingVertical: wp(2),
    borderRadius: wp(5),
  },
  sendButtonText: { color: '#fff', fontSize: 15, fontWeight: '600', },
});

export default LinkedInChatScreen;
