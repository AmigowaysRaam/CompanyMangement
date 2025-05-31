import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, Text } from 'react-native';
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
import NoInternetBanner from './src/screens/NointernetBanner';

if (Platform.OS === 'ios') {
  VersionCheck.setAppID('1234567890'); // Replace with your actual App Store ID
}

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

  const [fontsLoaded] = useFonts({
    Louis_George_Cafe: require('./assets/fonts/Louis_George_Cafe.ttf'),
    Louis_George_Cafe_Bold: require('./assets/fonts/Louis_George_Cafe_Bold.ttf'),
    Louis_George_Cafe_Regular: require('./assets/fonts/Louis_George_Cafe_Regular.ttf'),
    Louis_George_Cafe_Light: require('./assets/fonts/Louis_George_Cafe_Light.ttf'),
  });

  // Listen for internet connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  if(isOffline){
    return (
      <NoInternetBanner />
    )
  }

  return fontsLoaded ? (
    <PaperProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <LanguageProvider>
            <WallpaperProvider>
              <ThemeProvider>
                <SafeAreaProvider>
                  <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
                    <InitialRouter />
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                  </SafeAreaView>
                </SafeAreaProvider>
              </ThemeProvider>
            </WallpaperProvider>
          </LanguageProvider>
        </Provider>
      </I18nextProvider>
    </PaperProvider>
  ) : (
    <Text>Loading Fonts...</Text>
  );
}
