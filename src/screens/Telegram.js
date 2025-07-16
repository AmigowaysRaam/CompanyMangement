import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  NativeModules,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import TdClient from 'react-native-tdlib';
import { Louis_George_Cafe } from '../resources/fonts'; // Ensure this is defined correctly
import { hp, wp } from '../resources/dimensions'; // Ensure wp() returns numbers
import HeaderComponent from '../components/HeaderComponent'; // Your own component
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
// import LinkedInModal from 'react-native-linkedin';

// import TdClient from 'react-native-tdlib';
// console.log('TdClient:', TdClient);

// console.log('NativeModules.TdClient:', NativeModules.TdClient);
// console.log('NativeModules.TdClient:', NativeModules.TdClient);
// console.log('typeof startTdLib:', typeof NativeModules.TdClient?.startTdLib);

const Telegram = () => {

  const [status, setStatus] = useState('Starting TDLib...');
  const [step, setStep] = useState('');
  const [phone, setPhone] = useState('+91 8110933318');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

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

  const checkAuthState = async (authState = null) => {
    try {
      const state = authState || (await TdClient.getAuthorizationState());
      if (!state || !state['@type']) return;

      switch (state['@type']) {
        case 'authorizationStateWaitPhoneNumber':
          setStatus('Enter your phone number');
          setStep('phone');
          break;

        case 'authorizationStateWaitCode':
          setStatus('Enter the code sent to Telegram');
          setStep('code');
          break;

        case 'authorizationStateReady':
          setStatus('🎉 Authenticated!');
          setStep('done');
          break;

        case 'authorizationStateWaitPassword':
          setStatus('2FA password required (not handled)');
          break;

        default:
          setStatus(`Waiting for: ${state['@type']}`);
      }
    } catch (err) {
      console.error('❌ Error checking auth state:', err);
    }
  };

  const handlePhoneSubmit = async () => {
    try {
      setLoading(true);
      await TdClient.login({ phoneNumber: phone });
      setStatus('Code sent...');
    } catch (err) {
      console.error('❌ Phone submit error:', err);
      setStatus('Failed to send code');
    } finally {
      setLoading(false);
    }
  };
  const { themeMode } = useTheme();


  const handleCodeSubmit = async () => {
    try {
      setLoading(true);
      await TdClient.verifyPhoneNumber(code);
      setStatus('Verifying code...');
    } catch (err) {
      console.error('❌ Code verification error:', err);
      setStatus('Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderComponent title="Telegram" showBackArray={true} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={[styles.container, {
          backgroundColor: THEMECOLORS[themeMode].background
        }]}
      >
        <LinearGradient
          colors={['#0088cc', '#1c92d2']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.coverBox}
        >
          <Text style={[Louis_George_Cafe?.bold?.h2 || styles.statusText, styles.offlineText, {
            lineHeight: hp(5)
          }]}>
            {status}
          </Text>
          {loading && (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 16 }} />
          )}

          {!loading && step === 'phone' && (
            <View style={styles.form}>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#eee"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.button} onPress={handlePhoneSubmit}>
                <Text style={styles.buttonText}>Send Code</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && step === 'code' && (
            <View style={styles.form}>
              <TextInput
                placeholder="Enter Code"
                placeholderTextColor="#eee"
                style={styles.input}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.button} onPress={handleCodeSubmit}>
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'done' && (
            <Text style={{ color: '#0f0', fontSize: 16, marginTop: 20 }}>
              ✅ You're logged in!
            </Text>
          )}
        </LinearGradient>
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
