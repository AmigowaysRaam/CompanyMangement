import React from "react";
import { TextInput as RNTextInput, StyleSheet } from "react-native";
import { COLORS } from "../../resources/Colors";
import { hp, wp } from "../../resources/dimensions";

function TextInputComponent({
  title,
  value,
  onChangeText,
  placeholder,
  ...props
}) {
  return (
    <RNTextInput
      style={[styles.input, { backgroundColor: COLORS.input_background }]}
      placeholder={placeholder || title}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: wp(80),
    height: hp(6),
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
});

export default TextInputComponent;
