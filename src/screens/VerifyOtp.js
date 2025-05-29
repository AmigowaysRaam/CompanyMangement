import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { COLORS } from '../resources/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const VerifyOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const optData = route?.params?.response;
  const [otp, setOtp] = useState(
    // __DEV__ ? ['1', '2', '3', '4'] :
    ['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Handle OTP input
  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
    if (!text && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Timer logic
  useEffect(() => {
    console.log(JSON.stringify(optData.otp))
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      navigation.goBack(); // Auto navigate back after 30s
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Check if all OTP digits are filled
  const isOtpComplete = otp.every(digit => digit !== '');

  const handleCheckOtp = () => {

    const combinedNumber = otp.join('');
    // alert(combinedNumber == optData?.otp); 
    if (combinedNumber == optData?.otp) {
      navigation.navigate('SetMpin', { optData })
    }
    else {
      ToastAndroid.show(`OTP Invalid`, ToastAndroid.SHORT);
    }

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
            <Text style={[Louis_George_Cafe.bold.h5, {
              alignSelf: "center",
              marginVertical: wp(3),
            }]}>
              Confirm Your Access Securely
            </Text>

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

            <Text style={[Louis_George_Cafe.regular.h8, {
              alignSelf: "center",
              margin: wp(3),
              textAlign: 'center',
            }]}>
              {`Enter the OTP sent to your registered number to verify your identity`}
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[index] ? '*' : ''}
                  onChangeText={(text) => handleChange(text, index)}
                  secureTextEntry={false} // masking manually
                />
              ))}
            </View>
            {/* Timer and Resend text */}
            {/* <Text style={[Louis_George_Cafe.regular.h8, {
              alignSelf: "center",
              marginVertical: wp(3),
            }]}>
              Didn’t get the OTP?{' '}
              <Text style={[Louis_George_Cafe.bold.h8, {
                color: COLORS.button_bg_color,
                textDecorationLine: 'underline',
              }]}>
                RESEND OTP {timer > 0 ? `in ${timer}s` : ''}
              </Text>
            </Text> */}

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: isOtpComplete ? COLORS.button_bg_color : COLORS.input_background }]}
              onPress={() => handleCheckOtp()}
              disabled={!isOtpComplete}
            >
              <Text style={[Louis_George_Cafe.bold.h5, {
                color: isOtpComplete ? '#FFF' : COLORS.button_bg_color
              }]}>
                Verify OTP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}; 122

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: hp(2),
    paddingBottom: hp(10),
    paddingHorizontal: wp(5),
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: wp(3),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  otpInput: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(2),
    backgroundColor: COLORS.input_background,
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  continueButton: {
    width: '70%',
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    borderRadius: wp(5),
    alignSelf: "center",
  },
  continueButtonText: {
    // color: '#fff',
  },
});

export default VerifyOtp;
