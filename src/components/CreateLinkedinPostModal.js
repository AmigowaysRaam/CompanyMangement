import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  Image, StyleSheet, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { hp, wp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import { Louis_George_Cafe } from '../resources/fonts';
import OrganizationPostsList from './OrganizationPostsList';
// import ScheduledPostsList from './ScheduledPostsList'; // Optional when ready
import { THEMECOLORS } from '../resources/colors/colors';
import NewLinkedinPostForm from './NewLinkedinPostForm';

const CreateLinkedinPost = ({ onCancel, selctedOrg, accessToken, }) => {
  const { themeMode } = useTheme();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'scheduled' | 'create'



  const handlePost = () => {
    setCurrentView('dashboard'); // Go back to dashboard after post
  };

  const orgLogo =
    selctedOrg?.logoV2?.['original~']?.elements?.[0]?.identifiers?.[0]?.identifier || null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, {
        // style={{ backgroundColor: THEMECOLORS[themeMode].background }}
        backgroundColor: THEMECOLORS[themeMode].background
      }]}>
        <View style={styles.header}>
          {currentView !== 'create' ? (
            <>
              <MaterialCommunityIcons
                name="chevron-left"
                size={wp(7)}
                color={THEMECOLORS[themeMode].textPrimary}
                onPress={onCancel}
                style={styles.closeButton}
              />

              {orgLogo && (
                <Image source={{ uri: orgLogo }} style={styles.orgLogo} />
              )}

              <Text
                style={[
                  Louis_George_Cafe.bold.h8,
                  styles.title,
                  {
                    maxWidth: wp(45),
                    color: THEMECOLORS[themeMode].textPrimary
                  },
                ]}
              // numberOfLines={1}
              >
                {selctedOrg?.localizedName || 'Organization'}
              </Text>
              {/* Show "New Post" only if NOT in 'create' view */}
              <TouchableOpacity
                onPress={() => setCurrentView('create')}
                style={{
                  backgroundColor: THEMECOLORS[themeMode].primaryApp,
                  paddingHorizontal: wp(4),
                  borderRadius: wp(4),
                  alignItems: 'center',
                  height: wp(8),
                  marginLeft: 'auto', // push to right
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    Louis_George_Cafe.regular.h7,
                    styles.title,
                    { color: '#FFF', lineHeight: hp(3.5) },
                  ]}
                >
                  New Post
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // If in 'create' view, show just a close icon
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={wp(8)}
                  color={THEMECOLORS[themeMode].textPrimary}
                  onPress={() => setCurrentView('dashboard')}
                  style={styles.closeButton}
                />
                <Text
                  style={[
                    Louis_George_Cafe.bold.h8,
                    styles.title,
                    {
                      maxWidth: wp(80),
                      color: THEMECOLORS[themeMode].textPrimary

                    },
                  ]}
                  numberOfLines={1}
                >
                  {selctedOrg?.localizedName || 'Organization'}
                </Text>
              </View>
            </>
          )}
        </View>


        {/* Tabs (hidden during New Post view) */}
        {currentView !== 'create' && (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: THEMECOLORS[themeMode].primaryApp + 12,
              padding: wp(0),
              alignItems: 'center',
              justifyContent: 'center',
              height: wp(13),
            }}
          >
            <TouchableOpacity
              onPress={() => setCurrentView('dashboard')}
              style={[
                styles.tabButton,
                { backgroundColor: currentView === 'dashboard' ? THEMECOLORS[themeMode].primaryApp : '#ddd' },
              ]}
            >
              <Text style={[Louis_George_Cafe.bold.h7, styles.tabText, {
                color: currentView !== 'dashboard' ? "#000" : "#FFF"
              }]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentView('scheduled')}
              style={[
                styles.tabButton,
                {
                  backgroundColor: currentView === 'scheduled' ? THEMECOLORS[themeMode].primaryApp : '#ddd',
                },
              ]}
            >
              <Text style={[Louis_George_Cafe.bold.h7, styles.tabText, {
                color: currentView === 'scheduled' ? "#FFF" : "#000"
              }]}>Scheduled Posts</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Content View */}
        {currentView === 'create' ? (
          <NewLinkedinPostForm onClose={handlePost} org={selctedOrg} accessToken={accessToken} />
        ) : currentView === 'dashboard' ? (
          <OrganizationPostsList orgId={selctedOrg?.id} accessToken={accessToken} profile={selctedOrg} />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: wp(4.5), color: '#666' }}>
              Scheduled posts will appear here.
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateLinkedinPost;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFF',
    paddingHorizontal: wp(4),
    paddingTop: wp(4),
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(4),
    borderBottomWidth: wp(0.1),
    paddingBottom: wp(2),
    borderColor: '#ccc',
    // backgroundColor: 'red'
  },
  closeButton: {
    marginRight: wp(1),
  },
  orgLogo: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    marginRight: wp(2),
    borderWidth: wp(0.3),
    borderColor: '#000',
  },
  title: {
    flex: 1,
  },
  textArea: {
    height: hp(20),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp(2),
    padding: wp(3),
    textAlignVertical: 'top',
    fontSize: wp(4),
    marginBottom: wp(4),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(3),
    borderRadius: 10,
    backgroundColor: '#013CA3',
    marginBottom: wp(3),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: wp(2),
    fontSize: wp(4),
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: wp(4),
  },
  imagePreview: {
    width: wp(60),
    height: wp(60),
    resizeMode: 'cover',
    borderRadius: wp(2),
  },
  removeText: {
    color: 'red',
    marginTop: wp(2),
    textDecorationLine: 'underline',
  },
  icon: {
    marginRight: wp(2),
  },
  tabButton: {
    paddingHorizontal: wp(1),
    borderRadius: wp(2),
    width: wp(43),
    alignItems: 'center',
    height: wp(10),
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  tabText: {
    fontSize: wp(4),
  },
});
