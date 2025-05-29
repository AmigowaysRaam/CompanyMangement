import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import InitialRouter from './src/navigations/initial-router';
import { WallpaperProvider } from './src/context/WallpaperContext';
import { LanguageProvider } from './src/context/Language';
import { ThemeProvider } from './src/context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/resources/config/i18';
import { Provider as PaperProvider } from 'react-native-paper';
import VersionCheck from 'react-native-version-check';
import NetInfo from '@react-native-community/netinfo';
import { Louis_George_Cafe } from './src/resources/fonts';
import { wp } from './src/resources/dimensions';

if (Platform.OS === 'ios') {
  VersionCheck.setAppID('1234567890'); // Replace with your actual App Store ID
}

export default function App() {
  const [isOffline, setIsOffline] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  const [fontsLoaded] = useFonts({
    Louis_George_Cafe: require('./assets/fonts/Louis_George_Cafe.ttf'),
    Louis_George_Cafe_Bold: require('./assets/fonts/Louis_George_Cafe_Bold.ttf'),
    Louis_George_Cafe_Regular: require('./assets/fonts/Louis_George_Cafe_Regular.ttf'),
    Louis_George_Cafe_Light: require('./assets/fonts/Louis_George_Cafe_Light.ttf'),
  });

  // Check internet connection on mount and listen for changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = !!state.isConnected;
      setIsOffline(!isConnected);
      setCheckingConnection(false); // initial check complete
    });

    return () => unsubscribe();
  }, []);

  // Wait for both fonts and connection check
  if (!fontsLoaded || checkingConnection) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading App...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <LanguageProvider>
            <WallpaperProvider>
              <ThemeProvider>
                <SafeAreaProvider>
                  <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
                    {!isOffline ? (
                      <>
                        <InitialRouter />
                        <Toast ref={(ref) => Toast.setRef(ref)} />
                      </>
                    ) : (
                      <NoInternetModal />
                    )}
                  </SafeAreaView>
                </SafeAreaProvider>
              </ThemeProvider>
            </WallpaperProvider>
          </LanguageProvider>
        </Provider>
      </I18nextProvider>
    </PaperProvider>
  );
}

// 🧱 Custom Modal Component
const NoInternetModal = () => {
  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
          <Text style={[Louis_George_Cafe.bold.h5, styles.modalTitle]}>No Internet Connection</Text>
          <Text style={[Louis_George_Cafe.bold.h7, styles.modalBody]}>
            Please check your mobile network or Wi-Fi settings.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: wp(10),
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    // fontSize: 20,
    color: 'red',
    marginBottom: 10,
  },
  modalBody: {
    // fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});
