import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity
} from 'react-native';
import { wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function EmployeeTable({ data }) {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const navigation = useNavigation();

  const renderItem = ({ item }) => {

    console.log(item?.image)
    return (

      <TouchableOpacity
        style={styles.rowContainer}
        onPress={() => navigation.navigate('EmplyeeDetails', { item })}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: item?.image }}
            style={styles.profileImage}
          />
          <Text style={[Louis_George_Cafe.regular.h8, styles.rowText]}>
            {item.name}
          </Text>
        </View>
        <Text
          style={[
            Louis_George_Cafe.regular.h8,
            styles.rowText,
            styles.positionColumn
          ]}
        >
          {item.salary}
        </Text>
      </TouchableOpacity>
    )
  };

  if (!data || data.length === 0) {
    return null; // Optionally show a fallback UI
  }

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.tableContainer}>
        <Text
          style={[
            isTamil ? Louis_George_Cafe.bold.h7 : Louis_George_Cafe.bold.h5,
            {
              marginHorizontal: wp(3),
              marginTop: wp(3),
              lineHeight: wp(6)
            }
          ]}
        >
          {t('payrollActivities')}
        </Text>

        <View style={styles.line} />

        <View style={styles.headerContainer}>
          <Text
            style={[
              isTamil
                ? Louis_George_Cafe.bold.h7
                : Louis_George_Cafe.bold.h8,
              styles.headerText,
              styles.nameColumn
            ]}
          >
            {t('employee')}
          </Text>
          <Text
            style={[
              isTamil
                ? Louis_George_Cafe.bold.h7
                : Louis_George_Cafe.bold.h8,
              styles.headerText,
              styles.positionColumn
            ]}
          >
            {t('salary')}
          </Text>
        </View>

        <View style={styles.line} />

        <FlatList
          data={data.splice(0,5)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PayrollList')
          }
          style={styles.viewAllButton}
        >
          <Text
            style={[
              Louis_George_Cafe.regular.h9,
              { lineHeight: wp(5) }
            ]}
          >
            {t('viewAll')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    margin: wp(2),
    width: wp(95),
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: wp(0.2),
    borderColor: '#ddd',
    backgroundColor: '#FFFBF0'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2
  },
  profileImage: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    marginRight: wp(2)
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    paddingHorizontal: wp(4),
    backgroundColor: '#FFFBF0'
  },
  headerText: {
    color: '#000'
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    paddingHorizontal: wp(4),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowText: {
    color: '#000'
  },
  nameColumn: {
    flex: 2
  },
  positionColumn: {
    textAlign: 'right',
    flex: 1
  },
  line: {
    width: wp(90),
    height: wp(0.3),
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: wp(1)
  },
  viewAllButton: {
    alignSelf: 'center',
    margin: wp(3),
    paddingHorizontal: wp(3),
    borderWidth: wp(0.3),
    borderRadius: wp(5)
  }
});
