import React, { useEffect, useRef, useState } from 'react';
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
import { changeMpinCall } from '../redux/authActions';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';

const ChangeMpin = () => {

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

  const [oldMpin, setOldMpin] = useState(__DEV__ ? ['1', '2', '3', '4'] : ['', '', '', '']);
  const [newMpin, setNewMpin] = useState(__DEV__ ? ['1', '2', '1', '2'] : ['', '', '', '']);
  const [confirmMpin, setConfirmMpin] = useState(__DEV__ ? ['1', '2', '1', '2'] : ['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const oldRefs = [useRef(), useRef(), useRef(), useRef()];
  const newRefs = [useRef(), useRef(), useRef(), useRef()];
  const confirmRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (text, index, type) => {
    if (text.length > 1) return;

    const pins = {
      old: [...oldMpin],
      new: [...newMpin],
      confirm: [...confirmMpin],
    };

    pins[type][index] = text;
    if (type === 'old') setOldMpin(pins.old);
    if (type === 'new') setNewMpin(pins.new);
    if (type === 'confirm') setConfirmMpin(pins.confirm);

    const refs = {
      old: oldRefs,
      new: newRefs,
      confirm: confirmRefs,
    }[type];

    if (text && index < 3) refs[index + 1].current?.focus();
    if (!text && index > 0) refs[index - 1].current?.focus();
  };

  const isComplete = (pin) => pin.every(d => d !== '');
  const isNewMatch = newMpin.join('') === confirmMpin.join('');

  const handleChangeMpin = async () => {
    if (!isComplete(oldMpin) || !isComplete(newMpin) || !isComplete(confirmMpin)) return;

    if (!isNewMatch) {
      ToastAndroid.show(t('mpin_mismatch'), ToastAndroid.SHORT);
      return;
    }
    const params = {
      userid: userdata?.id,
      old_mpin: oldMpin.join(''),
      new_mpin: newMpin.join(''),
      // confirm_mpin: confirmMpin.join(''),
    };

    setIsLoading(true);
    dispatch(changeMpinCall(params, (response) => {
      ToastAndroid.show(t(response.message), ToastAndroid.SHORT);
      if (response.success) {
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      }
      setIsLoading(false);
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <HeaderComponent title={t('change_mpin')} showBackArray={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <View style={{
              flexDirection: "row", alignItems: "center", marginVertical: wp(4), width: wp(90),
              alignSelf: "center"
            }}>
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="contain"
                  source={require('../../src/assets/animations/chanegmpin.png')}
                  style={{
                    width: wp(15),
                    height: hp(15),
                  }}
                />
              </View>
              <Text numberOfLines={2} style={[isTamil ? Louis_George_Cafe.bold.h9 : Louis_George_Cafe.bold.h7, styles.label,
              { color: THEMECOLORS[themeMode].textPrimary }
              ]}>
                {t('change_mpin_description')}
              </Text>
            </View>


            <Text style={[Louis_George_Cafe.bold.h8, styles.label,
            { color: THEMECOLORS[themeMode].textPrimary }
            ]}>
              {t('enter_old_mpin')}
            </Text>
            <View style={styles.otpContainer}>
              {oldMpin.map((digit, index) => (
                <TextInput
                  key={`old-${index}`}
                  ref={oldRefs[index]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index, 'old')}
                />
              ))}
            </View>

            <Text style={[Louis_George_Cafe.bold.h8, styles.label,
            { color: THEMECOLORS[themeMode].textPrimary }
            ]}>
              {t('enter_new_mpin')}
            </Text>
            <View style={styles.otpContainer}>
              {newMpin.map((digit, index) => (
                <TextInput
                  key={`new-${index}`}
                  ref={newRefs[index]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index, 'new')}
                />
              ))}
            </View>
            <Text style={[Louis_George_Cafe.bold.h8, styles.label,
            { color: THEMECOLORS[themeMode].textPrimary }
            ]}>
              {t('confirm_new_mpin')}
            </Text>
            <View style={styles.otpContainer}>
              {confirmMpin.map((digit, index) => (
                <TextInput
                  key={`confirm-${index}`}
                  ref={confirmRefs[index]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index, 'confirm')}
                />
              ))}
            </View>

            {isComplete(confirmMpin) && !isNewMatch && (
              <Text style={[Louis_George_Cafe.regular.h6, styles.mismatchText]}>{t('mpin_mismatch')}</Text>
            )}

            {isLoading ? (
              <ActivityIndicator size={wp(10)} />
            ) : (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor:
                      isComplete(oldMpin) && isComplete(newMpin) && isComplete(confirmMpin) && isNewMatch
                        ? THEMECOLORS[themeMode].primaryApp
                        : THEMECOLORS[themeMode].tabInActive,
                  },
                ]}
                onPress={handleChangeMpin}
                disabled={
                  !isComplete(oldMpin) || !isComplete(newMpin) || !isComplete(confirmMpin) || !isNewMatch
                }
              >
                <Text style={[Louis_George_Cafe.bold.h5, {
                  color: isComplete(oldMpin) && isComplete(newMpin) && isComplete(confirmMpin) && isNewMatch ? THEMECOLORS[themeMode].white :
                    THEMECOLORS[themeMode].black
                }]}>
                  {t('change_mpin')}
                </Text>
              </TouchableOpacity>
            )}
            {/* <ThemeToggle /> */}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2)
    // justifyContent: "center"
  },
  title: {
    alignSelf: 'center',
    marginVertical: wp(4),
  },
  label: {
    marginBottom: hp(1),
    marginHorizontal: hp(3)
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
    marginBottom: hp(2),
  },
  otpInput: {
    width: wp(15),
    height: wp(15),
    backgroundColor: '#D7E3FF',
    borderRadius: wp(2),
    textAlign: 'center',
    fontSize: 20,
  },
  submitButton: {
    width: '70%',
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    borderRadius: wp(5),
    alignSelf: 'center',
  },
  mismatchText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: hp(1),
  },
});

export default ChangeMpin;
