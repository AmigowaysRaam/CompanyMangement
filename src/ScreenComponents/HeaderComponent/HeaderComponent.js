import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { hp, wp } from "../../resources/dimensions";
import { LinearGradient } from "expo-linear-gradient";

const HeaderBar = () => {
  const navigation = useNavigation();

  const HeaderComponent = () => (
    <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingName}>Header Bar</Text>
      </View>

      <TouchableOpacity style={styles.settingsBtn}>
        <MaterialIcons name="settings" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialIcons name="person" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </LinearGradient>
  );

  return <HeaderComponent />;
};

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(5),
    gap: wp(4),
  },
  iconContainer: {
    marginRight: wp(3),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default HeaderBar;
