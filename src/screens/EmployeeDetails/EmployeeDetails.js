import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { hp, wp } from '../../resources/dimensions';
import HeaderComponent from '../../components/HeaderComponent';
import { THEMECOLORS } from '../../resources/colors/colors';
import { Louis_George_Cafe } from '../../resources/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getEmplyeeDetails } from '../../redux/authActions';
import { useAndroidBackHandler } from '../../hooks/useAndroidBackHandler';

const EmplyeeDetails = () => {
  const route = useRoute();
  const user = route.params;
  const { themeMode } = useTheme();
  const theme = THEMECOLORS[themeMode];
  const { t } = useTranslation();
  const userdata = useSelector((state) => state.auth.user?.data);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });


  const renderImageSource = () => {
    if (!user || !user.profilePic) return null;
    if (typeof user.profilePic === 'string') {
      return { uri: user.profilePic };
    }
    return user.profilePic;
  };

  useFocusEffect(
    React.useCallback(() => {
      // alert(JSON.stringify(user.id, null, 2))
      setIsLoading(true);
      dispatch(getEmplyeeDetails(user?.id, (response) => {
        if (response.success) {
          setEmployeeDetails(response.data[0]);
          // alert(JSON.stringify(response.data[0]))
        }
        setIsLoading(false);
      }));
    }, [userdata])
  );

  const getStatusLabel = (status) => {
    return status === '1' ? t('active') : t('inactive');
  };

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <HeaderComponent title={t('employeedetails')} showBackArray={true} />
      {isLoading ?
        <ActivityIndicator style={{ marginTop: wp(20) }} size={wp(10)} color={theme.textPrimary} />
        :
        <>
          <View style={{ alignSelf: "center", marginVertical: hp(4) }}>
            <Image source={renderImageSource()} style={[styles.profileImage, {
              borderColor: theme.textPrimary, backgroundColor: theme.inputBackground
            }]} />
            <Text style={[Louis_George_Cafe.bold.h5, styles.name, { color: theme.textPrimary }]}>
              {employeeDetails?.full_name}
            </Text>
            <Text style={[Louis_George_Cafe.regular.h5, { alignSelf: "center", color: theme.textPrimary }]}>
              {employeeDetails?.designation}
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.infoContainer}>
              <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: theme.textPrimary }]}>
                {t('position')}
              </Text>
              <Text style={[Louis_George_Cafe.bold.h7, styles.value, { color: theme.textPrimary }]}>
                {employeeDetails?.designation}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: theme.textPrimary }]}>
                {t('status')}
              </Text>
              <View style={{ backgroundColor: "#C2FFC8", paddingHorizontal: wp(2), borderRadius: wp(5) }}>
                <Text style={[Louis_George_Cafe.bold.h7, { color: '#369F23', textTransform: "capitalize" }]}>
                  {getStatusLabel(employeeDetails?.status)}
                </Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: theme.textPrimary }]}>
                {t('salary')}
              </Text>
              <Text style={[Louis_George_Cafe.bold.h7, styles.value, { color: theme.textPrimary }]}>
                ₹ {employeeDetails?.salary}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={[Louis_George_Cafe.regular.h7, styles.label, { color: theme.textPrimary }]}>
                {t('startdate')}
              </Text>
              <Text style={[Louis_George_Cafe.bold.h7, styles.value, { color: theme.textPrimary }]}>
                {employeeDetails?.start_date}
              </Text>
            </View>
            <View style={{ marginVertical: wp(2) }}>
              {/* <TouchableOpacity onPress={() => navigation.navigate('BankDetails', employeeDetails)} style={[styles.optionButton, { borderColor: theme.textPrimary }]}>
                <Text style={[Louis_George_Cafe.regular.h7, { color: theme.textPrimary,lineHeight:wp(5) }]}>
                  {t('bankdetails')}
                </Text>
                <MaterialCommunityIcons
                  style={styles.slantedIcon}
                  name="arrow-right-circle-outline"
                  size={hp(3.5)}
                  color={theme.textPrimary}
                />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => navigation.navigate('PayrollHistory',employeeDetails)} style={[styles.optionButton, { borderColor: theme.textPrimary }]}>
                <Text style={[Louis_George_Cafe.regular.h7, { color: theme.textPrimary,lineHeight:wp(5) }]}>
                  {t('payrollhistory')}
                </Text>
                <MaterialCommunityIcons
                  style={styles.slantedIcon}
                  name="arrow-right-circle-outline"
                  size={hp(3.5)}
                  color={theme.textPrimary}
                />
              </TouchableOpacity>
            </View>
            {/* <ThemeToggle/> */}
          </ScrollView>
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: wp(4),
    alignItems: 'center',
    flexGrow: 1,
  },
  profileImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    marginBottom: hp(3),
    borderWidth: wp(0.9),
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
    height: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    marginVertical: hp(1),
    borderWidth: wp(0.4),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmplyeeDetails;
