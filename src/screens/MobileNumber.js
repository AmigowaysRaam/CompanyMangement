import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe, } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { useNavigation } from '@react-navigation/native';
import { useCurrentLocation } from '../../src/hooks/location'
import { useRoute,  } from '@react-navigation/native';
import { getOtpByMobilenumber } from '../redux/authActions';
import { useDispatch } from 'react-redux';

const MobileNumber = () => {

  const [mobileNumber, setMobileNumber] = useState(__DEV__ ? "9876543210" : '');
  const navigation = useNavigation();
  const { location, locationError, countryCode, dialCode } = useCurrentLocation();
  const [dialcodePin, setdialcode] = useState(dialCode);
  const route = useRoute();
  const loginData = route?.params?.response?.data;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setdialcode(dialCode)
  }, [dialCode])

  const handleNavigateVerifyOtp = () => {
    
    setIsLoading(true)

    let params = {
      userid: loginData?.id,
      phone: mobileNumber
    }

    dispatch(getOtpByMobilenumber(params, (response) => {
      if (response.success) {
        navigation.replace('VerifyOtp', { response })
      }
      setIsLoading(false);
    }));

  }



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={require('../../src/assets/animations/mobile_img.png')}
                style={{
                  width: wp(90),
                  height: hp(40),
                  margin: wp(2),
                }}
              />
            </View>
            <Text style={[Louis_George_Cafe.bold.h5, { alignSelf: "center" }]}>
              Enter Your Mobile Number
            </Text>
            <Text style={[Louis_George_Cafe.regular.h8, {
              alignSelf: "center",
              margin: wp(2),
            }]}>
              We’ll send you a confirmation code
            </Text>

            {/* Phone input with flag and code */}
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Image
                  source={require('../../src/assets/animations/india_flag.png')}
                  style={styles.flag}
                />
                <Text style={[Louis_George_Cafe.regular.h9, styles.countryCode]}>{dialcodePin}</Text>
              </View>
              <View style={styles.verticalLine} />
              <TextInput
              editable={!isLoading}
                style={[Louis_George_Cafe.regular.h7, styles.mobileInput, {
                }]}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            {
              isLoading ?
                <ActivityIndicator />
                :
                <TouchableOpacity
                  style={[styles.getOtpButton, { backgroundColor: COLORS.button_bg_color }]}
                  onPress={() => handleNavigateVerifyOtp()}
                  disabled={mobileNumber.length < 10}
                >
                  <Text style={[Louis_George_Cafe.bold.h5, styles.getOtpButtonText]}>
                    Get OTP
                  </Text>
                </TouchableOpacity>
            }


            {location && (
              <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                Latitude: {location.coords.latitude.toFixed(6)}{"\n"}
                Longitude: {location.coords.longitude.toFixed(6)}{"\n"}
                county:{countryCode}
              </Text>
            )}
            {locationError && (
              <Text style={{ textAlign: 'center', marginBottom: 10, color: 'red' }}>
                {locationError}
              </Text>
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
    backgroundColor: COLORS.background,
    paddingTop: hp(2),
    paddingBottom: hp(10),
    paddingHorizontal: wp(5),
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: wp(3),
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: wp(3),
    paddingHorizontal: wp(2),
    marginVertical: hp(2),
    height: hp(7),
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2),
  },
  flag: {
    width: wp(7),
    height: wp(6),
    marginRight: wp(1),
    borderRadius: wp(1),
  },
  countryCode: {
    fontSize: 16,
    color: '#000',
  },
  verticalLine: {

    height: wp(8), backgroundColor: '#BFBDC7', width: wp(0.4), marginRight: wp(2)
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
  },
  getOtpButton: {
    width: '65%',
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(8),
    borderRadius: wp(5), alignSelf: "center"
  },
  getOtpButtonText: {
    color: '#fff',
  },
});

export default MobileNumber;
