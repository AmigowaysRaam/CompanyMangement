import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
  Image, FlatList, RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinkedInModal from 'react-native-linkedin';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import CreateLinkedinPostModal from '../components/CreateLinkedinPostModal';
import LinkedinOrganizationList from './ListOrganizationList';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '../components/ConfirmationModal';
import { useNavigation } from '@react-navigation/native';

const Linkedin = () => {
  const linkedInRef = useRef(null);
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [orgsList, setOrgsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [seelctOrg, setseelctOrg] = useState(null);
  // New: confirmation modal visibility state
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('linkedin_token');
        const storedProfile = await AsyncStorage.getItem('linkedin_profile');

        if (storedToken && storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setAccessToken(storedToken);
          setProfile(parsedProfile);
          await fetchUserPosts(storedToken, parsedProfile.id);
          await fetchLinkedInPages(storedToken);
        }
      } catch (error) {
        console.error('Error loading stored LinkedIn data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStoredData();
  }, []);

  const fetchUserPosts = useCallback(async (token, userId) => {
    try {
      const url = `https://api.linkedin.com/v2/shares?q=owners&owners=${encodeURIComponent(`urn:li:person:${userId}`)}&sharesPerOwner=100`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      if (res.status === 401) throw new Error('Unauthorized');
      const json = await res.json();
      // alert(JSON.stringify(json))
      setPosts(json.elements || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      Alert.alert('Error', 'Session expired. Please login again.');
      handleLogout();
    }
  }, []);

  const fetchLinkedInPages = async (token) => {
    try {
      const url =
        'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(*,organization~(id,localizedName,logoV2(original~:playableStreams))))';
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      if (res.status === 401) throw new Error('Unauthorized');
      const json = await res.json();
      setOrgsList(json.elements || []);
    } catch (err) {
      console.error('Error fetching pages:', err);
      Alert.alert('Error', 'Session expired. Please login again.');
      handleLogout();
    }
  };

  const handleCreateOrgPost = (item) => {
    setModalVisible(true);
    setseelctOrg(item)
  }

  if (seelctOrg && modalVisible) {
    return (
      <CreateLinkedinPostModal accessToken={accessToken} selctedOrg={seelctOrg} isVisible={modalVisible} onCancel={() => setModalVisible(false)} />
    )
  }

  const fetchLinkedInProfile = async (tokenResponse) => {
    try {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      await AsyncStorage.setItem('linkedin_token', token);
      const meRes = await fetch(
        'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,localizedHeadline,profilePicture(displayImage~:playableStreams))',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );
      const meJson = await meRes.json();
      const imgEl = meJson.profilePicture?.['displayImage~']?.elements?.slice(-1)[0]?.identifiers?.[0]?.identifier;
      const emailRes = await fetch(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'cache-control': 'no-cache',
          },
        }
      );

      const emailJson = await emailRes.json();
      const email = emailJson?.elements?.[0]?.['handle~']?.emailAddress;
      const profileData = {
        id: meJson.id,
        name: `${meJson.localizedFirstName} ${meJson.localizedLastName}`,
        headline: meJson.localizedHeadline,
        picture: imgEl,
        email,
      };
      setProfile(profileData);
      await AsyncStorage.setItem('linkedin_profile', JSON.stringify(profileData));
      fetchUserPosts(token, meJson.id);
      fetchLinkedInPages(token);
    } catch (err) {
      console.error('Profile fetch error:', err);
      Alert.alert('Error', 'Failed to fetch profile.');
    }
  };

  const handleLogout = async () => {
    setLogoutConfirmVisible(false); // close confirm modal
    await AsyncStorage.removeItem('linkedin_token');
    await AsyncStorage.removeItem('linkedin_profile');
    setAccessToken(null);
    setProfile(null);
    setPosts([]);
    setOrgsList([]);
  };

  const handleLogoutPress = () => {
    // Show confirmation modal on logout press
    setLogoutConfirmVisible(true);
  };

  const onRefresh = async () => {
    if (!accessToken || !profile?.id) return;
    setRefreshing(true);
    await Promise.all([fetchUserPosts(accessToken, profile.id), fetchLinkedInPages(accessToken)]);
    setRefreshing(false);
  };

  const renderPostItem = ({ item }) => {
    const txt = item.text?.text || 'No content available';
    return (
      <View style={styles.postItem}>
        <Text style={styles.postText}>{txt}</Text>
      </View>
    );
  };

  const renderLoader = () => (
    <View style={{ padding: wp(5) }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: themeMode === 'dark' ? '#333' : '#ddd',
            height: hp(8),
            marginVertical: wp(2),
            borderRadius: wp(2),
          }}
        />
      ))}
    </View>
  );
  return (
    <>
      <HeaderComponent
        title="LinkedIn"
        showBackArray
        rightSideArr={profile ? 'logout' : 'login'}
        rIconFunction={profile ? handleLogoutPress : () => linkedInRef.current.open()}
      />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
      >
        {isLoading ? (
          renderLoader()
        ) : !profile ? (
          <View style={styles.loginContainer}>
            <LinkedInModal
              containerStyle={styles.container}
              wrapperStyle={styles.wrapper}
              closeStyle={styles.closeButton}
              ref={linkedInRef}
              clientID="86106fhlniezg7"
              clientSecret="WPL_AP1.5SqkPCUdjrSwCHvA.q+3TWQ=="
              redirectUri="https://amigo.scriptzol.in/auth/linkedin"
              onSuccess={fetchLinkedInProfile}
              onError={(err) => {
                console.error('LinkedIn error:', err);
                Alert.alert('Error', 'LinkedIn auth failed.');
              }}
              shouldGetAccessToken
              permissions={[
                'openid',
                'profile',
                'r_basicprofile',
                'email',
                'r_ads',
                'r_ads_reporting',
                'r_organization_social',
                'r_organization_admin',
                'rw_organization_admin',
                'w_organization_social',
                'w_member_social',
                'rw_ads',
                'rw_events',
                'r_events',
                'r_1st_connections_size',
              ]}
              renderButton={() => (
                <TouchableOpacity onPress={() => linkedInRef.current.open()} style={styles.linkedinButton}>
                  <Text style={styles.linkedinText}>Sign in with LinkedIn</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item, i) => item.id || i.toString()}
            renderItem={renderPostItem}
            ListHeaderComponent={
              <>
                <TouchableOpacity style={styles.profileContainer}
                // onPress={() => navigation.navigate('LinkedIPostListing', { posts })}
                >
                  <Image source={{ uri: profile.picture }} style={styles.profileImage} />
                  <View>
                    <Text style={[Louis_George_Cafe.bold.h7, styles.profileName, {
                      color: THEMECOLORS[themeMode].textPrimary

                    }]}>{profile.name}</Text>
                    <Text style={[Louis_George_Cafe.regular.h7, styles.profileHeadline, {
                      color: THEMECOLORS[themeMode].textPrimary
                    }]}>{profile.headline}</Text>
                  </View>
                </TouchableOpacity>
                <LinkedinOrganizationList profile={profile} organizations={orgsList} onCreatePost={(org) => handleCreateOrgPost(org)} />
              </>
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: wp(10) }}
          />
        )}
      </KeyboardAvoidingView>
      {/* Confirmation modal for logout */}
      <ConfirmationModal
        visible={logoutConfirmVisible}
        message={t('Are you sure you want to logout?')}
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirmVisible(false)}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  loginContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  linkedinButton: {
    padding: wp(3), backgroundColor: '#0077B5', borderRadius: 5,
    width: wp(60), alignItems: 'center', marginVertical: wp(4), alignSelf: 'center',
  }, linkedinText: { color: '#fff', fontWeight: 'bold', fontSize: wp(4) },
  profileContainer: {
    flexDirection: 'row', alignItems: 'center', padding: wp(4), borderBottomWidth: 1,
    borderColor: '#ccc', marginBottom: wp(3), width: wp(95), justifyContent: 'center',
    alignSelf: 'center',
  },
  profileImage: { width: wp(14), height: wp(14), borderRadius: wp(7), marginRight: hp(2) },
  profileName: { fontSize: wp(4), fontWeight: '600', },
  profileHeadline: { fontSize: wp(3.2), color: '#444', marginTop: wp(1) },
  postItem: {
    backgroundColor: '#f9f9f9', marginHorizontal: wp(5), marginVertical: wp(1), padding: wp(3), borderRadius: 6, borderWidth: 1, borderColor: '#ddd',
  },
  postText: { fontSize: wp(3.5), },
});

// Styles for ConfirmationModal
const stylesModal = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center', width: wp(100), alignSelf: 'center',
  },
  container: {
    borderRadius: wp(4), padding: wp(5), width: wp(95), position: 'absolute',
    bottom: wp(1), alignItems: 'center', borderWidth: wp(0.3),
  },
  message: {
    fontSize: wp(4), marginBottom: hp(2), textAlign: 'center',
  },
  buttonRow: { flexDirection: 'row' },
  confirmBtn: {
    width: wp(32), paddingVertical: hp(1), paddingHorizontal: wp(5), borderRadius: wp(2), alignItems: 'center', marginHorizontal: wp(3),
  },
  cancelBtn: {
    width: wp(32),
    alignItems: 'center', paddingVertical: hp(1), paddingHorizontal: wp(5), borderRadius: wp(2),
  }, confirmText: { color: '#fff', fontWeight: 'bold' },
  cancelText: { fontWeight: 'bold' },
});

export default Linkedin;
