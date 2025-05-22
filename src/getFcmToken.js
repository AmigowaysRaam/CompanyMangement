import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get FCM token
const getFCMToken = async () => {
    try {
        // Request permission for notifications (if not already granted)
        const authStatus = await messaging().requestPermission();

        // Check if permission is granted
        const isAuthorized =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (isAuthorized) {
            // Get FCM token
            const token = await messaging().getToken();
            console.log('FCM Token:', token);

            // Save the token to AsyncStorage
            await AsyncStorage.setItem('fcm_token', token);

            // Return the token
            return token;
        } else {
            console.warn('Notification permission not granted');
            return null;
        }
    } catch (error) {
        console.error('Error fetching FCM token:', error);
        return null;
    }
};

export default getFCMToken;
