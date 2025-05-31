import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../../hooks/useAndroidBackHandler';

export default function PayrollList() {
  const route = useRoute();
  const itemList = route.params?.item;
  const navigation = useNavigation();
  const { themeMode } = useTheme();
  const { t } = useTranslation();

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
        navigation.goBack();
    }
});

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => navigation.navigate('EmplyeeDetails', { item })}
    >
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
        <Text style={[Louis_George_Cafe.regular.h8, styles.rowText]}>
          {item?.name}
        </Text>
      </View>
      <Text style={[Louis_George_Cafe.regular.h8, styles.rowText, styles.positionColumn]}>
        {item.position}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: THEMECOLORS[themeMode].background, flex: 1 }}>
      <HeaderComponent title={t('payrollActivities')} showBackArray={true} />
      <View style={styles.tableContainer}>
        <View
          style={{
            backgroundColor: '#FFFBF0',
            flex: 1,
            borderRadius: wp(2),
            borderWidth: wp(0.5),
            borderColor: '#F1F1F1',
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={[Louis_George_Cafe.bold.h7, styles.headerText, styles.nameColumn]}>
              {t('employee')}
            </Text>
            <Text style={[Louis_George_Cafe.bold.h6, styles.headerText, styles.positionColumn]}>
              {t('position')}
            </Text>
          </View>
          <View style={styles.line} />
          <FlatList
            data={itemList}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    borderRadius: wp(5),
    margin: wp(1),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  profileImage: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    marginRight: wp(2),
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    paddingHorizontal: wp(5),
    backgroundColor: '#FFFBF0',
    marginTop: wp(1),
    width: wp(95),
    alignSelf: 'center',
  },
  headerText: {
    color: '#000',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    paddingHorizontal: wp(4),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  nameColumn: {
    flex: 2,
  },
  positionColumn: {
    textAlign: 'right',
  },
  line: {
    width: wp(90),
    height: wp(0.3),
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: wp(1),
  },
});
