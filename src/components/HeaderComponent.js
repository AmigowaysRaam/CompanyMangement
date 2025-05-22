import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../resources/colors/colors";
import { wp, hp } from "../resources/dimensions";

function HeaderComponent({
  title,
  value,
  onChangeText,
  placeholder,
  ...props
}) {
  const navigation = useNavigation();
  const showBackButton = title?.toLowerCase() !== "dashboard";

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={wp(5)} color={COLORS.black} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  backButton: {
    marginRight: wp(2),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: COLORS.black,
  },
});

export default HeaderComponent;
