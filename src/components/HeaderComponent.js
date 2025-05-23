import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../resources/Colors";
import { wp, hp } from "../resources/dimensions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from "react-native-paper";
function HeaderComponent({
  title,
  value,
  onChangeText,
  placeholder,
  openModal,
  ...props
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {
          title == 'home' ?
            <>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={openModal} style={styles.iconButton}>
                  <MaterialCommunityIcons name="menu" size={hp(3.5)} color={COLORS.button_bg_color} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image
                    source={require('../assets/animations/logo_hrms.png')}
                    style={{ width: hp(3.5), height: hp(3.5), }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                  <MaterialCommunityIcons name="calendar" size={hp(3)} color={COLORS.button_bg_color} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                  <MaterialCommunityIcons name="magnify" size={hp(3)} color={COLORS.button_bg_color} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                  <MaterialCommunityIcons name="bell-outline" size={hp(3)} color={COLORS.button_bg_color} />
                </TouchableOpacity>
              </View>
            </>
            :
            <>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                  <MaterialCommunityIcons name="chevron-left" size={hp(3.5)} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={{ justifyContent: "center", alignItems: "center", margin: wp(1), marginHorizontal: wp(2) }}>
                  {title}
                </Text>
              </View>
            </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    backgroundColor: COLORS.background,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // only vertical shadow
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Android Shadow
    elevation: 4,
    // Optional: for visual stacking order
    zIndex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center", marginBottom: hp(1), justifyContent: "space-between", height: wp(7)
  },
  iconButton: {
    marginHorizontal: hp(0.5),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: COLORS.black,
  },
});

export default HeaderComponent;
