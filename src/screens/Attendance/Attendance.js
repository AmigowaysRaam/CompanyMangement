import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image
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
import { getAttendaceData } from '../../redux/authActions';
import HomeScreenLoader from '../HomeScreenLoader';
// Static map for local icon references
const ICON_MAP = {
  '../../assets/animations/presence_icon.png': require('../../assets/animations/presence_icon.png'),
  '../../assets/animations/abbsenceicon.png': require('../../assets/animations/abbsenceicon.png'),
  '../../assets/animations/lateComming.png': require('../../assets/animations/lateComming.png'),
  '../../assets/animations/wfh.png': require('../../assets/animations/wfh.png')
};

export default function Attendance() {
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userdata = useSelector(state => state.auth.user);
  const [attendanceData, setAttendanceData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const isTamil = i18n.language === 'ta';

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(getAttendaceData(userdata?.data?.id, res => {
        if (res.success) setAttendanceData(res);
        setLoading(false);
      }));
    }, [userdata])
  );
  const adjustFont = (style, offset) => ({
    ...style,
    fontSize: isTamil ? style.fontSize - offset : style.fontSize,
  });

  const renderCard = ({ gradient, icon, labelKey, value }) => (
    <LinearGradient
      colors={gradient}
      style={styles.card}
      start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Image source={ICON_MAP[icon]} style={styles.cardIcon} />
          <Text
            numberOfLines={2}
            style={[adjustFont(Louis_George_Cafe.bold.h8, 2), styles.cardLabel]}
          >
            {t(labelKey)}
          </Text>
        </View>
        <Text style={adjustFont(Louis_George_Cafe.bold.h6, 4)}>{value}</Text>
      </View>
    </LinearGradient>
  );

  const renderEmployee = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => navigation.navigate('EmplyeeDetails', item)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        style={[adjustFont(Louis_George_Cafe.regular.h7, 1), styles.nameColumn]}
      >
        {item.name}
      </Text>

      <Text
        numberOfLines={1}
        style={[adjustFont(Louis_George_Cafe.regular.h7, 1), styles.idColumn]}
      >
        {item?.uId}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <HeaderComponent title={t('Attendance')} showBackArray={false} />
      {loading ? (
        <HomeScreenLoader />
      ) : (
        <View>
          <FlatList
            data={attendanceData?.attendanceStatsArray || []}
            horizontal={true}        // Enable horizontal scroll
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => renderCard(item)}
            contentContainerStyle={{ paddingHorizontal: wp(2), paddingBottom: hp(2) }} // add horizontal padding
            showsHorizontalScrollIndicator={false}  // Optional: hide scrollbar for cleaner UI
          />
          {attendanceData?.employeeList?.length > 0 && (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[adjustFont(Louis_George_Cafe.bold.h8, 1), { flex: 3 }]}>
                  {t('employee')}
                </Text>
                <Text style={[adjustFont(Louis_George_Cafe.bold.h8, 1), { flex: 1 }]}>
                  {t('Id')}
                </Text>
                {/* <Text style={[adjustFont(Louis_George_Cafe.bold.h8, 1), { flex: 1, textAlign: 'center' }]}>
                  {t('performance')}
                </Text> */}
              </View>
              <FlatList
                data={attendanceData.employeeList}
                keyExtractor={item => item.id.toString()}
                renderItem={renderEmployee}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp(5), minHeight: hp(58) }}
                ListFooterComponent={
                  attendanceData?.employeeList?.length > 5 && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EmployeeList')}
                      style={{
                        alignSelf: 'center',
                        margin: wp(3),
                        paddingHorizontal: wp(3),
                        borderWidth: wp(0.3),
                        borderRadius: wp(5),
                      }}
                    >
                      <Text style={[Louis_George_Cafe.regular.h9, { lineHeight: wp(5) }]}>
                        {t('viewAll')}
                      </Text>
                    </TouchableOpacity>
                  )
                }
              />
            </View>
          )}

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: wp(1),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginVertical: hp(1),
  }, card: {
    width: wp(35), // fixed width for horizontal scroll cards
    borderRadius: wp(4),
    padding: wp(2),
    marginRight: wp(3), // space between cards horizontally
    marginTop: hp(2),
  }
  , cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp(2),
  }, cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  }, cardIcon: {
    width: hp(4),
    height: hp(4),
    marginRight: wp(2),
    resizeMode: 'contain',
  }, cardLabel: {
    flex: 1,
    flexWrap: 'wrap',
    textTransform: 'capitalize',
    lineHeight: wp(4),
  }, tableContainer: {
    marginHorizontal: wp(2),
    marginVertical: wp(1),
    backgroundColor: '#F2E8FF',
    padding: wp(2),
    borderRadius: wp(2),
    marginBottom: wp(1),
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: hp(1),
    borderBottomColor: "#555",
    borderBottomWidth: wp(0.2),
    paddingVertical: wp(2),
    // backgroundColor:"red",
    justifyContent: "space-between", paddingHorizontal: wp(4)
  },
  tableCell: {
    fontSize: wp(4),
  },
  avatarContainer: {
    marginHorizontal: wp(2),
  }, avatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }, avatarText: {
    fontSize: wp(4),
    color: '#000',
  },
  nameColumn: {
    flex: 2,
    width: wp(18),
  }, performanceChip: {
    backgroundColor: '#1484CD',
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    marginHorizontal: wp(6),
    borderRadius: wp(4),
    color: '#fff',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
    paddingHorizontal: wp(1),
    justifyContent: "space-between",
  },
  avatarContainer: {
    marginHorizontal: wp(2),
  },
  avatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: wp(4),
    color: '#000',
  },
  // Flex for columns
  nameColumn: {
    flex: 3,           // flex value to grow
    marginHorizontal: wp(1),
  },
  idColumn: {
    flex: 2,
    marginHorizontal: wp(1),
  },
  performanceChip: {
    flex: 1,
    backgroundColor: '#1484CD',
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    marginHorizontal: wp(1),
    borderRadius: wp(4),
    color: '#fff',
    textAlign: 'center',
  },
});
