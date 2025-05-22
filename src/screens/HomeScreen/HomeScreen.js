import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import ButtonComponent from "../../components/Button/Button";

const HomeScreen = () => {
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.user?._id);
  const profile = useSelector((state) => state.auth.profile);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming user is logged in

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.replace("LoginScreen");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: COLORS.cardBackground }]}>
        <View style={styles.header}>
          <Text style={[Louis_George_Cafe.bold.h1, { color: COLORS.primary }]}>
            Hi, Admin
          </Text>
        </View>

        {/* Profile Section */}
        {profile && (
          <View style={styles.profileSection}>
            <Image
              source={{ uri: profile?.avatarUrl || "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
            <Text style={[Louis_George_Cafe.bold.h4, styles.profileName]}>
              {profile.name || "Admin Name"}
            </Text>
          </View>
        )}

        {/* Action Button Section */}
        <View style={styles.buttonSection}>
          <ButtonComponent title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: wp(5),
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: wp(4),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: wp(5),
    backgroundColor: COLORS.white,
    padding: wp(4),
    borderRadius: wp(2),
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 5,
  },
  profileImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  profileName: {
    fontSize: wp(5),
    color: COLORS.primary,
  },
  buttonSection: {
    marginTop: wp(10),
    width: "100%",
    alignItems: "center",
  },
});

export default HomeScreen;
