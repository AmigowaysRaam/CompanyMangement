import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getemployeeDetails } from '../../redux/authActions';
import HomeScreenLoader from '../HomeScreenLoader';

export default function Employee() {

  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user);

  const [employeeData, setEmployeeData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(
        getemployeeDetails(userdata?.data?.id, (response) => {
          if (response.success) {
            setEmployeeData(response);
          }
          setLoading(false);
        })
      );
    }, [userdata])
  );

  const adjustFont = (style, offset) => ({
    ...style,
    fontSize: isTamil ? style.fontSize - offset : style.fontSize,
  });

  return (
    <View
      style={{
        backgroundColor: THEMECOLORS[themeMode].background,
        flex: 1,
        padding: wp(1),
      }}
    >
      <HeaderComponent title={t('employee')} showBackArray={false} />

      {loading ? (
        <HomeScreenLoader />
      ) : (
        <>
          {/* Top Cards */}
          <View style={styles.cardRow}>
            <LinearGradient
              colors={['#C4A5EC', '#F5EDFF']}
              style={styles.card}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: wp(2) }}>
                <Text style={adjustFont(Louis_George_Cafe.regular.h6, 3)}>{t('totalEmployee')}</Text>
                <Text style={adjustFont(Louis_George_Cafe.bold.h1, 4)}>
                  {employeeData?.totalEmployee ?? '--'}
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={['#F1F5FF', '#B9CAEF']}
              style={styles.card}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: wp(2) }}>
                <Text style={adjustFont(Louis_George_Cafe.regular.h6, 6)}>{t('totalApplicants')}</Text>
                <Text style={adjustFont(Louis_George_Cafe.bold.h1, 6)}>
                  {employeeData?.totalApplicants ?? '--'}
                </Text>
              </View>
            </LinearGradient>
          </View>
          {/* Gender Chart */}
          <View style={styles.gendercard}>
            <Text style={[adjustFont(Louis_George_Cafe.regular.h6, 2), { margin: hp(2) }]}>
              {t('gender')}
            </Text>

            <View style={{ margin: wp(1) }}>
              <Text style={[adjustFont(Louis_George_Cafe.regular.h7, 2), { marginHorizontal: hp(2) }]}>
                {t('female')}
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${employeeData?.genderRatio?.female ?? 0}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={{ margin: wp(1) }}>
              <Text
                style={[
                  adjustFont(Louis_George_Cafe.regular.h7, 3),
                  { marginHorizontal: hp(2), lineHeight: wp(5) },
                ]}
              >
                {t('male')}
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${employeeData?.genderRatio?.male ?? 0}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Employee Table */}
          {employeeData?.employeeList?.length > 0 && (
            <View
              style={{
                marginHorizontal: wp(2),
                marginTop: wp(1),
                flex: 1,
                backgroundColor: '#F2E8FF',
                padding: wp(1),
                borderRadius: wp(2),
                marginBottom: wp(4),
              }}
            >
              <View style={[styles.tableHeader]}>
                <Text numberOfLines={1} style={[styles.tableCell, {}]}>
                  {t('employee')}
                </Text>
                <Text numberOfLines={1} style={[styles.tableCell, {}]}>
                  {t('performance')}
                </Text>
              </View>
              <FlatList
                data={employeeData.employeeList}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  <TouchableOpacity onPress={() => navigation.navigate('EmployeeList')} style={{ alignSelf: "center", margin: wp(3), paddingHorizontal: wp(3), borderWidth: wp(0.3), borderRadius: wp(5) }}>
                  <Text style={[Louis_George_Cafe.regular.h9, {
                      lineHeight: wp(5)
                  }]}>{t('viewAll')}</Text>
              </TouchableOpacity>
                }
                contentContainerStyle={{
                  paddingBottom: hp(10),
                  backgroundColor: '#F2E8FF',
                }}
                renderItem={({ item: emp }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EmplyeeDetails', emp);
                    }}
                    style={styles.tableRow}
                  >
                    <View style={{ marginHorizontal: wp(2) }}>
                      <View style={styles.avatar}>
                        <Text style={[Louis_George_Cafe.regular.h7, { fontSize: wp(4), color: '#000' }]}>
                          {emp.name.charAt(0)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[
                        adjustFont(styles.tableCell, 1),
                        { flex: 2, width: wp(18) },
                      ]}
                    >
                      {emp.name}
                    </Text>
                    <Text
                      style={[
                        adjustFont(Louis_George_Cafe.regular.h9, 1),
                        {
                          backgroundColor: '#1484CD',
                          paddingHorizontal: wp(2),
                          marginHorizontal: wp(6),
                          borderRadius: wp(4),
                          paddingVertical: wp(0.5),
                          color: '#fff',
                        },
                      ]}
                    >
                      {Math.floor(Math.random() * 50) + 50}%
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </>
      )}
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
    marginHorizontal: wp(2),
    backgroundColor: '#FFEAE8',
    marginVertical: wp(4),
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
    backgroundColor: '#D9D9D9',
    borderRadius: hp(1),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#80B377',
    borderRadius: hp(1),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    justifyContent: "space-between"
  },
  tableHeader: {
    backgroundColor: '#E8DAF8', flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(4), paddingVertical: wp(2)
  },
  tableCell: {
    fontSize: wp(3),
    color: '#333',
    paddingHorizontal: wp(2),
  },
  avatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#C1B9CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
