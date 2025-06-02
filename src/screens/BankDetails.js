import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const InfoRow = ({ label, value, showSeperator }) => (
  <>
    <View style={styles.rowContainer}>
      <Text style={[Louis_George_Cafe.regular.h6, styles.leftText]}>{label}</Text>
      <Text style={[Louis_George_Cafe.regular.h6, styles.rightText]}>{value}</Text>
    </View>
    <View style={showSeperator ? styles.separator : {}} />
  </>
);

export default function BankDetails() {
  const navigation = useNavigation();
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  // Destructure the API data passed from params
  const {
    full_name,
    bankName,
    bankAccountNo,
    panNo,
    ifscCode,
    start_date,
  } = route.params || {};

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <HeaderComponent title={t('bank_details')} showBackArray={true} />

      <View style={[styles.sectionHeader, { marginVertical: wp(4) }]}>
        <Text style={[Louis_George_Cafe.bold.h5, styles.sectionHeaderText]}>
          {t('account_information')}
        </Text>
      </View>

      <InfoRow showSeperator={true} label={t('holder_name')} value={full_name || '-'} />
      <InfoRow label={t('account_no')} value={bankAccountNo || '-'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#F0F0F0',
    height: hp(6),
    justifyContent: 'center',
    marginBottom: wp(2),
    width: '100%',
  },
  sectionHeaderText: {
    paddingHorizontal: wp(5),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp(2),
    marginVertical: wp(3),
  },
  leftText: {
    flex: 1,
    textAlign: 'left',
    marginRight: wp(2),
    textTransform: "capitalize"
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: wp(2),
  },
  separator: {
    width: '90%',
    backgroundColor: '#ddd',
    height: wp(0.2),
    alignSelf: 'center',
  },
});
