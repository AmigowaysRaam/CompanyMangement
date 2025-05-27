import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserData() {
  return await AsyncStorage.getItem('user_data');
}

export const saveLanguage = async (language) => {
  await AsyncStorage.setItem('appLanguage', language);
};

export const getSavedLanguage = async () => {
  return await AsyncStorage.getItem('appLanguage');
};

export const setSiteData = async (sData) => {
  await AsyncStorage.setItem('siteData', sData);
};