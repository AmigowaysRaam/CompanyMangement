import React, { } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { useFonts } from 'expo-font';
import firebase from '@react-native-firebase/app';
import Toast from 'react-native-toast-message';
import InitialRouter from './src/navigations/initial-router';
import { WallpaperProvider } from './src/context/WallpaperContext';
import { LanguageProvider } from './src/context/Language';

export default function App() {
  const [fontsLoaded] = useFonts({
    Louis_George_Cafe: require('./assets/fonts/Louis_George_Cafe.ttf'),
    Louis_George_Cafe_Bold: require('./assets/fonts/Louis_George_Cafe_Bold.ttf'),
    Louis_George_Cafe_Regular: require('./assets/fonts/Louis_George_Cafe_Regular.ttf'),
    Louis_George_Cafe_Light: require('./assets/fonts/Louis_George_Cafe_Light.ttf'),
  });


  return fontsLoaded ? (
    <Provider store={store}>
      <LanguageProvider>
        <WallpaperProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
              <InitialRouter />
              <Toast ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaView>
          </SafeAreaProvider>
        </WallpaperProvider>
      </LanguageProvider>
    </Provider>
  ) : (
    <Text>Loading Fonts...</Text>
  );
}
