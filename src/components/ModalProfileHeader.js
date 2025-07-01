import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';
import { THEMECOLORS } from '../resources/colors/colors';
import { COLORS } from '../resources/Colors';
import ProfileUploadPopUp from './ProfileUploadPopUp';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileHeader = ({ userdata, themeMode, onClose, navigation }) => {


  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <ImageBackground
      source={require('../../src/assets/animations/profile_bg.png')}
      resizeMode="stretch"
      style={{
        width: '100%', height: hp(26),
      }}
    >
      <ThemeToggle />
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: hp(4)
        }}
      >
        {/* Avatar Section */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            onPress={() => {
              setShowDropdown(true);
            }}
          >
            {userdata?.data?.profileImage?.trim() ? (
              <Image
                source={{ uri: userdata.data.profileImage }}
                style={{
                  width: wp(18),
                  height: wp(18),
                  borderRadius: wp(9),
                  borderWidth: wp(0.3),
                  borderColor: '#F9f9f9',
                }}
              />
            ) : (
              // 🧑 Initials Avatar
              <View
                style={{
                  width: wp(18),
                  height: wp(18),
                  borderRadius: wp(9),
                  backgroundColor: '#c9c9c9',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: wp(6),
                    color: THEMECOLORS[themeMode].primaryApp,
                    fontWeight: 'bold',
                  }}
                >
                  {getInitials(userdata?.data?.full_name)}
                </Text>
              </View>
            )}

            {/* ✏️ Pencil Icon */}
            <MaterialCommunityIcons
              name="pencil-outline"
              size={wp(4)}
              color={COLORS.button_bg_color}

              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: THEMECOLORS[themeMode].white,
                borderRadius: wp(5),
                padding: wp(1),
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginLeft: wp(5) }}>
          {
            userdata?.data?.full_name &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="person" size={wp(5)} color={THEMECOLORS[themeMode].white} />
              <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h7, { color: THEMECOLORS[themeMode].white, marginLeft: 5, lineHeight: wp(7), textTransform: "capitalize" }]}>
                {userdata?.data?.full_name}
              </Text>
            </View>
          }

          {userdata?.data?.userid &&
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Icon name="badge" size={wp(4)} color={THEMECOLORS[themeMode].white} />
              <Text style={[Louis_George_Cafe.regular.h7, { color: THEMECOLORS[themeMode].white, marginLeft: 5, textTransform: 'capitalize', lineHeight: wp(7) }]}>
                {userdata?.data?.userid}
              </Text>
            </View>
          }
          {
            userdata?.data?.lastLoginLocation &&
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Icon name="location-pin" size={wp(4)} color={THEMECOLORS[themeMode].white} />
              <Text style={[Louis_George_Cafe.regular.h7, { color: THEMECOLORS[themeMode].white, marginLeft: 5, textTransform: 'capitalize', lineHeight: wp(7) }]}>
                {userdata?.data?.lastLoginLocation}
              </Text>
            </View>}

          {/* {
            userdata?.data?.lastLoginLocation &&
            <Text
              numberOfLines={1}
              style={[
                Louis_George_Cafe.bold.h8,
                {
                  color: THEMECOLORS[themeMode].white,
                  textTransform: 'capitalize',
                  lineHeight: wp(7),
                },
              ]}
            >
              {`📍${userdata?.data?.lastLoginLocation}`}
            </Text>
          } */}
        </View>
      </View>
      {showDropdown &&
        <ProfileUploadPopUp
          option={{}}
          isVisible={showDropdown}
          onCancel={() => setShowDropdown(false)}
        />
      }

    </ImageBackground>
  );
};

export default ProfileHeader;
