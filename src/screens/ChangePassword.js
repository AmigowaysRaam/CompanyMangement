import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordApiCall } from '../redux/authActions';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const ChangePassword = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const userdata = useSelector((state) => state.auth.user?.data);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  const [oldPassword, setOldPassword] = useState(__DEV__ ? '1234' : "");
  const [newPassword, setNewPassword] = useState(__DEV__ ? '123456' : "");
  const [confirmPassword, setConfirmPassword] = useState(__DEV__ ? '123456' : "");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    const isLengthValid = newPassword.length >= 6 && confirmPassword.length >= 6;
    const isMatch = newPassword === confirmPassword;
    const isValid = oldPassword && isLengthValid && isMatch;

    if (!isLengthValid) {
      ToastAndroid.show(t('password_min_length'), ToastAndroid.SHORT);
      return;
    }

    if (!isMatch) {
      ToastAndroid.show(t('password_mismatch'), ToastAndroid.SHORT);
      return;
    }

    if (!isValid) {
      ToastAndroid.show(t('fill_required_fields'), ToastAndroid.SHORT);
      return;
    }

    const params = {
      userid: userdata?.id,
      old_password: oldPassword,
      new_password: newPassword,
    };

    setIsLoading(true);
    dispatch(changePasswordApiCall(params, (response) => {
      ToastAndroid.show(t(response.message), ToastAndroid.SHORT);
      if (response.success) {
        setTimeout(() => navigation.goBack(), 500);
      }
      setIsLoading(false);
    }));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <HeaderComponent title={t('change_password')} showBackArray={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <View style={styles.headerRow}>
              <Image
                resizeMode="contain"
                source={require('../../src/assets/animations/changpasscode.png')}
                style={{ width: wp(15), height: hp(15) }}
              />
              <Text
                numberOfLines={2}
                style={[isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.bold.h7, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}
              >
                {t('change_password_description')}
              </Text>
            </View>

            <Text style={[Louis_George_Cafe.bold.h8, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
              {t('enter_old_password')}
            </Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder={t('old_password')}
            />

            <Text style={[Louis_George_Cafe.bold.h8, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
              {t('enter_new_password')}
            </Text>
            <TextInput
              maxLength={14}
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('new_password')}
            />

            <Text style={[Louis_George_Cafe.bold.h8, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
              {t('confirm_new_password')}
            </Text>
            <TextInput
              maxLength={14}
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('confirm_password')}
            />

            {confirmPassword && newPassword !== confirmPassword && (
              <Text style={styles.warningText}>{t('password_mismatch')}</Text>
            )}

            {(newPassword.length > 0 && newPassword.length < 6) && (
              <Text style={styles.warningText}>{t('password_min_length')}</Text>
            )}

            {isLoading ? (
              <ActivityIndicator size={wp(10)} />
            ) : (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor:
                      oldPassword && newPassword.length >= 6 && newPassword === confirmPassword
                        ? THEMECOLORS[themeMode].primaryApp
                        : THEMECOLORS[themeMode].tabInActive,
                  },
                ]}
                onPress={handleChangePassword}
                disabled={
                  !oldPassword || newPassword.length < 6 || confirmPassword.length < 6 || newPassword !== confirmPassword
                }
              >
                <Text style={[isTamil ? Louis_George_Cafe.bold.h8 : Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].white }]}>
                  {t('change_password')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(4),
    width: wp(90),
    alignSelf: 'center',
    paddingHorizontal: wp(1)
  },
  label: {
    marginBottom: hp(1),
    marginHorizontal: hp(3),
  },
  input: {
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    padding: wp(3),
    backgroundColor: '#D7E3FF',
    borderRadius: wp(2),
    fontSize: 16,
  },
  warningText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: hp(1),
  },
  submitButton: {
    width: '85%',
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    borderRadius: wp(5),
    alignSelf: 'center',
  },
});

export default ChangePassword;
