import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { wp } from '../resources/dimensions';
import { useNavigation } from '@react-navigation/native';
const LinkedInChatList = () => {


  const { themeMode } = useTheme();
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  // Your Unipile API key
  const UNIPILE_API_KEY = 'fRH98sg7.CLwZfAPGcg/w0MFME/J61iF1K+6YlIhCMZqxwZ2w7To=';
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('https://api16.unipile.com:14657/api/v1/chats?account_type=LINKEDIN', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-KEY': UNIPILE_API_KEY,
          },
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ Error ${res.status}:`, errorText);
          return;
        }
        const data = await res.json();
        console.log('✅ Chat list:', JSON.stringify(data.items, null, 2));
        setChats(data.items || []);
      } catch (err) {
        console.error('❌ Failed to fetch chats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const renderItem = ({ item }) => {
    const title = item.mailbox_name || item.subject || 'No subject';
    const timestamp = new Date(item.timestamp).toLocaleString();
    // console?.log(item?.id,item?.account_id)
    // item?.id == 'abl-Je_jUmCLAmYJQGESHQ' ? "rte":""
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => navigation?.navigate('LinkedInChatScreen', { data: item })}>
        <Text style={styles.chatTitle}>{title}</Text>
        <Text style={styles.chatTimestamp}>{timestamp}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderComponent title="Linkedin Chats" showBackArray={true} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
      >
        {loading ? (
          <ActivityIndicator size="large" color={THEMECOLORS[themeMode].text} />
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: wp(5),
  },
  listContent: { paddingVertical: 10, },
  chatItem: {
    marginBottom: 15, borderBottomWidth: 1, borderColor: '#ccc',
    paddingBottom: 10,
  }, chatTitle: {
    fontSize: 16, fontWeight: '600',
  },
  chatTimestamp: { fontSize: 12, color: '#999', marginTop: 4, },
});

export default LinkedInChatList;
