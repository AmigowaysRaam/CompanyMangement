// src/hooks/useAndroidBackHandler.js
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useCallback } from 'react';

/**
 * Handles Android hardware back button press on focused screens.
 * @param {Function} callback - Function to call on back press.
 * @param {boolean} [enabled=true] - Whether to enable the back handler.
 */
export const useAndroidBackHandler = (callback, enabled = true) => {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      const onBackPress = () => {
        if (typeof callback === 'function') {
          callback();
          return true;
        }
        return false; // allow default behavior if no callback
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [callback, enabled])
  );
};
