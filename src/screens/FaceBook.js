import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Alert,
} from 'react-native';
import { LoginButton, AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import { wp } from '../resources/dimensions';
import HeaderComponent from '../components/HeaderComponent';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';

const FaceBook = () => {
  const { themeMode } = useTheme();

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        Alert.alert('Login cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
          Alert.alert('Something went wrong obtaining access token');
        } else {
          const profile = await Profile.getCurrentProfile();
          Alert.alert('Logged in!', `Hi ${profile?.name}!`);
          // Now you can use the accessToken to authenticate with your backend
        }
      }
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <>
      <HeaderComponent title="FaceBook" showBackArray={true} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={[styles.container, {
          backgroundColor: THEMECOLORS[themeMode].background
        }]}
      >
        <View style={styles.loginContainer}>
          <LoginButton
            onLoginFinished={(error, result) => {
              alert(JSON.stringify(result));
              if (error) {
                Alert.alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                Alert.alert("Login was cancelled");
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  alert(JSON.stringify(data))
                  Profile.getCurrentProfile().then(profile => {
                    Alert.alert("Welcome!", `Hi ${profile?.name}`);
                  });
                });
              }
            }}
            onLogoutFinished={() => Alert.alert("User logged out")}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    width: wp(80),
    alignItems: 'center',
  },
});
export default FaceBook;
