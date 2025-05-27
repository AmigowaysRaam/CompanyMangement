import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';
import { COLORS } from '../../resources/Colors';
import AllEmployee from '../../ScreenComponents/HeaderComponent/AllEmployee';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';

export default function Employee() {

  const route = useRoute();
  const itemList = route.params?.item;
  const navigation = useNavigation();
  const { theme, themeMode } = useTheme();

  return (
    <View style={{
      backgroundColor: THEMECOLORS[themeMode].background, flex: 1, padding: wp(1)
    }}>
      <HeaderComponent title={'Employee'} showBackArray={false} />
      <View style={styles.cardRow}>
        <LinearGradient
          colors={['#C4A5EC', '#F5EDFF']} // purple to blue gradient
          style={styles.card}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={{ flexDirection: "column", alignItems: "center", gap: wp(2) }}>
            <Text style={[Louis_George_Cafe.regular.h6]}>Total Employee</Text>
            <Text style={[Louis_George_Cafe.bold.h1]}>100</Text>
          </View>
        </LinearGradient>
        <LinearGradient
          colors={['#F1F5FF', '#B9CAEF']} // orange to red gradient
          style={styles.card}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: "column", alignItems: "center", gap: wp(2) }}>
            <Text style={[Louis_George_Cafe.regular.h6]}>Total Applicants</Text>
            <Text style={[Louis_George_Cafe.bold.h1]}>50</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.gendercard}>
        <Text style={[Louis_George_Cafe.regular.h6, { margin: hp(2) }]}>Gender</Text>

        <View style={{ margin: wp(1) }}>
          <Text style={[Louis_George_Cafe.regular.h7, {
            marginHorizontal: hp(2)
          }]}>Female</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '60%' }]} >
              </View>
            </View>
          </View>
        </View>
        <View style={{ margin: wp(1) }}>
          <Text style={[Louis_George_Cafe.regular.h7, {
            marginHorizontal: hp(2)
          }]}>Male</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '40%' }]} >
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(4),
    paddingHorizontal: wp(1),
  },

  card: {
    flex: 1,
    height: wp(30),
    borderRadius: wp(5),
    marginHorizontal: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  gendercard: {
    height: wp(48),
    borderRadius: wp(5),
    marginHorizontal: wp(1),
    backgroundColor: "#FFEAE8", marginVertical: wp(4)
  },
  cardText: {
    color: 'white',
    fontSize: wp(5),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(1),
  },

  progressBarBackground: {
    flex: 5,
    height: hp(1.5),
    backgroundColor: '#D9D9D9', // light gray background
    borderRadius: hp(1),
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#80B377',
    borderRadius: hp(1),
  },

});
