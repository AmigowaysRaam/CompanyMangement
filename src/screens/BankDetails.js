import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { colors, Louis_George_Cafe } from '../resources/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useEffect } from 'react';

const InfoRow = ({ label, value, showSeperator, themeMode }) => (
  <>
    <View style={styles.rowContainer}>
      <Text style={[Louis_George_Cafe.regular.h6, styles.leftText, {
        color: THEMECOLORS[themeMode].textPrimary
      }]}>{label}</Text>
      <Text style={[Louis_George_Cafe.regular.h6, styles.rightText, {
        color: THEMECOLORS[themeMode].textPrimary
      }]}>{value}</Text>
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

  useEffect(() => {
    // alert(JSON.stringify(route.params, null, 2))
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <HeaderComponent title={t('bank_details')} showBackArray={true} />
      <View style={[styles.sectionHeader, { marginVertical: wp(1) }]}>
        <Text style={[Louis_George_Cafe.bold.h5, styles.sectionHeaderText]}>
          {t('account_information')}
        </Text>
      </View>
      <InfoRow showSeperator={true} label={t('holder_name')} value={full_name || '-'} themeMode={themeMode} />
      <InfoRow label={t('panNo')} value={panNo || '-'} themeMode={themeMode} />
      <View style={[styles.sectionHeader, { marginVertical: wp(4) }]}>
        <Text style={[Louis_George_Cafe.bold.h5, styles.sectionHeaderText]}>
          {t('bank_details')}
        </Text>
      </View>

      <InfoRow showSeperator={true} label={t('bank_name')} value={bankName || '-'} themeMode={themeMode} />
      <InfoRow label={t('account_no')} value={bankAccountNo || '-'} themeMode={themeMode} showSeperator={true} />
      <InfoRow label={t('ifsc_code')} value={ifscCode || '-'} themeMode={themeMode} showSeperator={false} />
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
    // textTransform: "capitalize"
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    width: '90%',
    backgroundColor: '#ddd',
    height: wp(0.2),
    alignSelf: 'center',
  },
});
