import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";
import { loginUser, registerUser } from "../../redux/authActions";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import TextInputComponent from "../../components/TextInput/TextInput";
import ButtonComponent from "../../components/Button/Button";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added state for confirm password
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // State for toggling confirm password visibility

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "", // Added error state for confirm password
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const resetForm = () => {
    setFullname("");
    setUsername("");
    setEmail("");
    setPhonenumber("");
    setPassword("");
    setConfirmPassword(""); // Reset confirm password
  };

  const handleRegister = () => {

    Keyboard.dismiss();
    const regEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    const regPhone = /^[0-9]{10}$/;
    const regPassword = /^[A-Za-z\d@$!%*?&]{4,16}$/;

    let errorsTemp = {
      fullname: "",
      username: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (fullname.trim().length === 0) {
      errorsTemp.fullname = "Full name is required";
      isValid = false;
    }

    if (username.trim().length === 0) {
      errorsTemp.username = "Username is required";
      isValid = false;
    }

    if (email.trim().length === 0) {
      errorsTemp.email = "Email is required";
      isValid = false;
    } else if (!regEmail.test(email)) {
      errorsTemp.email = "Invalid email format";
      isValid = false;
    }

    if (phonenumber.trim().length === 0) {
      errorsTemp.phonenumber = "Phone number is required";
      isValid = false;

    } else if (!regPhone.test(phonenumber)) {
      errorsTemp.phonenumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (password.trim().length === 0) {
      errorsTemp.password = "Password is required";
      isValid = false;
    } else if (!regPassword.test(password)) {
      errorsTemp.password = "Password must be between 4 and 16 characters";
      isValid = false;
    }

    if (confirmPassword.trim().length === 0) {
      errorsTemp.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== password) {
      errorsTemp.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(errorsTemp);

    if (isValid) {
      setIsLoading(true);
      const userData = {
        fullname,
        username,
        email,
        phonenumber,
        password,
      };

      dispatch(
        registerUser(userData, (response) => {
          setIsLoading(false);
          if (response.success) {
            Toast.show({
              text1: "Success",
              text2: response.message,
              type: "success",
            });

            setTimeout(() => {
              const credentials = { username, password };
              dispatch(loginUser(credentials, (loginResponse) => {
                if (loginResponse) {
                  AsyncStorage.setItem('user_data', JSON.stringify(loginResponse.data));
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen" }],
                  });
                }
              }));
            }, 1000);
          } else {
            fnAlert(response.message); // Use the response message correctly
          }
        })
      );
    } else {
      setIsLoading(false); // Handle the case where validation fails
    }
  };

  function fnAlert(response) {
    Toast.show({
      text1: "Error",
      text2: response, // Use the response here
      type: "error",
    });
  }


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Toast />

      <Text style={[Louis_George_Cafe.bold.h2, styles.header]}>Register</Text>

      <TextInputComponent
        maxLength={20}
        title="Full Name"
        value={fullname}
        onChangeText={(text) => {
          const noNumbersOrSpecialChars = text.replace(/[^a-zA-Z\s]/g, ''); // Only allow letters and spaces
          setFullname(noNumbersOrSpecialChars);
          setErrors((prevErrors) => ({
            ...prevErrors,
            fullname: null,
          }));
        }}
      />


      {errors.fullname && (
        <Text style={[styles.error, { color: COLORS.validation }]}>{errors.fullname}</Text>
      )}

      <TextInputComponent
        title="Username"
        maxLength={20}
        value={username}
        onChangeText={(text) => {
          const filteredText = text.replace(/[^a-zA-Z0-9_]/g, '');
          setUsername(filteredText);
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: null,
          }));
        }}
      />

      {errors.username && (
        <Text style={[styles.error, { color: COLORS.validation }]}>{errors.username}</Text>
      )}

      <TextInputComponent
        title="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          const filteredText = text.trim();
          setEmail(filteredText);
          // Email validation regex
          const regEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

          // If email doesn't match the regex, set an error
          if (filteredText.length > 0 && !regEmail.test(filteredText)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Invalid email format", // Set error message for invalid email
            }));
          } else {
            // Clear error if email is valid
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "", // Clear the email error
            }));
          }
        }}
      />
      {errors.email && (
        <Text style={[styles.error, { color: COLORS.validation }]}>{errors.email}</Text>
      )}

      <View style={styles.phoneContainer}>
        <TextInputComponent
          title="Phone Number"
          keyboardType="phone-pad"
          value={phonenumber}
          onChangeText={(text) => {
            const filteredText = text.replace(/\s/g, ''); // Remove spaces
            if (/^\d*$/.test(filteredText) && filteredText.length <= 10) {
              setPhonenumber(filteredText);
              setErrors((prevErrors) => ({
                ...prevErrors,
                phonenumber: null,
              }));
            }
          }}
          maxLength={10}
        />
      </View>
      {errors.phonenumber && (
        <Text style={[styles.error, { color: COLORS.validation }]}>{errors.phonenumber}</Text>
      )}

      <View style={styles.passwordContainer}>
        <TextInputComponent
          title="Password"
          maxLength={16}
          value={password}
          secureTextEntry={!isPasswordVisible}
          onChangeText={(text) => {
            const filteredText = text.trim();
            setPassword(filteredText);
            setErrors((prevErrors) => ({
              ...prevErrors,
              password: null,
            }));
          }}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={[styles.error, { color: COLORS.validation }]}>{errors.password}</Text>
      )}

      {/* Confirm Password Field */}
      <View style={styles.passwordContainer}>
        <TextInputComponent
          title="Confirm Password"
          maxLength={16}
          value={confirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          onChangeText={(text) => {
            const filteredText = text.trim();
            setConfirmPassword(filteredText);
            setErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: null,
            }));
          }}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={[styles.error, { color: COLORS.validation }]}>{errors.confirmPassword}</Text>
      )}

      <ButtonComponent title={"Register"} isLoading={isLoading} onPress={handleRegister} />
      <TouchableOpacity
        // onPress={() => handleRegister()}
        onPress={() =>
          navigation.navigate("LoginScreen")
        }
      >
        <Text style={[Louis_George_Cafe.bold.h9, { color: COLORS.white, marginTop: hp(2) }]}>
          If you already have an account, Click here to log in.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: wp(10),
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: COLORS.white,
  },
  input: {
    width: wp(80),
    height: hp(6),
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(80),
    height: hp(6),
    marginTop: 10,
    borderRadius: 10,
    marginVertical: wp(2),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: wp(80),
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  error: {
    marginBottom: 10,
    textAlign: "left",
  },
  button: {
    padding: 10,
    width: wp(60),
    height: hp(6),
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    marginTop: "20%",
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    alignSelf: "center",
  },
});

export default RegisterScreen;
