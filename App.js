import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text } from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from './src/resources/dimensions';
import { Louis_George_Cafe } from './src/resources/fonts';

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
                    {isOffline &&
                      <LinearGradient
                        colors={['#c00', 'orange']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.coverImage}
                      >
                        <Text style={[Louis_George_Cafe.bold.h7, styles.offlineText]}>
                          {`${'No Internet Connection'} ..!`}
                        </Text>
                      </LinearGradient>
                    }
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

const styles = StyleSheet.create({
  coverImage: {
    alignItems: "center",
    justifyContent: 'center',
    width: wp(90),
    borderBottomRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    height: wp(12), position: "absolute", bottom: wp(5), alignSelf: "center"
  },
  offlineText: {
    color: '#fff',
  },
});
