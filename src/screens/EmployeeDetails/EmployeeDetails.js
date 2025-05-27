import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { hp, wp } from '../../resources/dimensions';
import HeaderComponent from '../../components/HeaderComponent';
import { COLORS } from '../../resources/Colors';
import { Louis_George_Cafe } from '../../resources/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmplyeeDetails = () => {

  const route = useRoute();
  const user = route.params?.item;

  const renderImageSource = () => {

    if (!user || !user.profilePic) return null;
    if (typeof user.profilePic === 'string') {
      return { uri: user.profilePic };
    }
    return user.profilePic;
  };

  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <HeaderComponent title="Employee Details" />
      <View style={{ alignSelf: "center", marginVertical: hp(4) }}>
        <Image source={renderImageSource()} style={styles.profileImage} />
        <Text style={[Louis_George_Cafe.bold.h5, styles.name]}>{user.name}</Text>
        <Text style={[Louis_George_Cafe.regular.h5, { alignSelf: "center" }]}>{user.position}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Position</Text>
          <Text style={[Louis_George_Cafe.bold.h7, styles.value]}>{user.position}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Department</Text>
          <Text style={[Louis_George_Cafe.bold.h7, styles.value]}>{user.department}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Status</Text>
          <View style={{ backgroundColor: "#C2FFC8", paddingHorizontal: wp(2), borderRadius: wp(5) }}>
            <Text style={[Louis_George_Cafe.bold.h7, {
              color: '#369F23'
            }]}>{user.status}</Text>
          </View>

        </View>
        <View style={styles.infoContainer}>
          <Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Salary</Text>
          <Text style={[Louis_George_Cafe.bold.h7, styles.value]}>{user.salary}</Text>
        </View>

        <View style={{ marginVertical: wp(2) }}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={[Louis_George_Cafe.regular.h7, { color: "#000" }]}>Bank Details</Text>
            <MaterialCommunityIcons
              style={styles.slantedIcon}
              name="arrow-right-circle-outline"
              size={hp(3.5)}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={[Louis_George_Cafe.regular.h7, { color: "#000" }]}>Payroll History</Text>
            <MaterialCommunityIcons
              style={styles.slantedIcon}
              name="arrow-right-circle-outline"
              size={hp(3.5)}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: wp(4),
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },
  profileImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    marginBottom: hp(3),
    borderWidth: wp(0.5),
    borderColor: COLORS.button_bg_color
  },
  name: {
    marginBottom: wp(1),
    alignSelf: "center"
  },
  infoContainer: {
    width: '85%',
    paddingVertical: wp(4),
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slantedIcon: {
    transform: [{ rotate: '-45deg' }]
  },
  optionButton: {
    width: wp(90),
    backgroundColor: COLORS.background,
    height: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    marginVertical: hp(1),
    borderWidth: wp(0.4)
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmplyeeDetails;
