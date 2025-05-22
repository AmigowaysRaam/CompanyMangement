import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";

const SignIn = () => {
  const navigation = useNavigation();

  const handleTOLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      <Text
        style={[
          Louis_George_Cafe.bold.h2,
          styles.title,
          { color: COLORS.white },
        ]}
      >
        Sign-In{" "}
      </Text>
      <Text
        style={[
          Louis_George_Cafe.medium.h6,
          styles.description,
          { color: COLORS.white },
        ]}
      >
        we will send you a link to reset your password, in your Email
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.button_bg_color }]}
        onPress={handleTOLogin}
      >
        <Text
          style={[
            Louis_George_Cafe.regular.h8,
            styles.buttonText,
            { color: COLORS.white },
          ]}
        >
          Sign-In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  description: {
    marginVertical: hp(6),
    textAlign: "center",
  },
  button: {
    width: wp(70),
    height: hp(6),
    borderRadius: 20,
    alignSelf: "center",
    marginTop: hp(8),
  },
  buttonText: {
    alignItems: "center",
    marginVertical: hp(2),
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
});

export default SignIn;
