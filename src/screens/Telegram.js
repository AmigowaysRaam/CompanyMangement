import React, { useRef, useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
// import TdClient from 'react-native-tdlib';
import { wp } from '../resources/dimensions'; // Ensure wp() returns numbers
import HeaderComponent from '../components/HeaderComponent'; // Your own component
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import LinkedInModal from 'react-native-linkedin';

const Telegram = () => {
  const [status, setStatus] = useState('Starting TDLib...');
  const [step, setStep] = useState('');
  const [phone, setPhone] = useState('+91 8110933318');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const linkedInRef = useRef(null);
  const { themeMode } = useTheme();

  // useEffect(() => {
  //   console.log('startTdLib:', typeof TdClient.startTdLib);  // Should be 'function'
  //   const initTelegram = async () => {
  //     try {
  //       console.log(JSON.stringify(TdClient),'TdClient')
  //       TdClient.startTdLib(
  //         {
  //           api_id: 24079547,
  //           api_hash: '63bc2eaf01dcf0b0ef575cddd03f7ccd',
  //           database_directory: '/tdlib',
  //         },
  //         async () => {
  //           setStatus('✅ TDLib started');
  //           await checkAuthState();

  //           TdClient.on('update', async (update) => {
  //             try {
  //               if (
  //                 update &&
  //                 update['@type'] === 'updateAuthorizationState'
  //               ) {
  //                 await checkAuthState(update.authorization_state);
  //               }
  //             } catch (err) {
  //               console.error('Update handler error:', err);
  //             }
  //           });
  //         },
  //         (err) => {
  //           console.error('❌ Failed to start TDLib:', err);
  //           setStatus('Failed to start TDLib');
  //         }
  //       );
  //     } catch (error) {
  //       console.error('❌ Error initializing Telegram:', error);
  //       setStatus('Initialization error');
  //     }
  //   };
  //   initTelegram();
  // }, []);


  return (
    <>
      <HeaderComponent title="Telegram" showBackArray={true} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={[styles.container, {
          backgroundColor: THEMECOLORS[themeMode].background
        }]}
      >
        <LinkedInModal
          ref={linkedInRef}
          clientID="86106fhlniezg7"
          clientSecret="WPL_AP1.5SqkPCUdjrSwCHvA.q+3TWQ=="
          redirectUri="https://amigo.scriptzol.in/auth/linkedin"
          onSuccess={(token) => console.log('✅ LinkedIn token:', token)}
          onError={(err) => console.error('❌ LinkedIn error:', err)}
          shouldGetAccessToken={true}
          permissions={['openid', 'profile', 'email', 'w_member_social']}  // <-- add scopes here
          renderButton={() => (
            <TouchableOpacity
              onPress={() => linkedInRef.current?.open()}
              style={{
                padding: 12,
                backgroundColor: '#0077B5',
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                Login with LinkedIn
              </Text>
            </TouchableOpacity>
          )}
        />

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
  coverBox: {
    width: Math.round(wp(85)),
    borderRadius: Math.round(wp(6)),
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    width: '100%',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,

  },
  statusText: {
    color: '#fff',
    fontSize: 16,

  },
});

export default Telegram;
