import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  ScrollView,
} from 'react-native';
import { wp, hp } from '../../resources/dimensions';
import { height, Louis_George_Cafe } from '../../resources/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendaceData } from '../../redux/authActions';
import HomeScreenLoader from '../HomeScreenLoader';

const ICON_MAP = {
  '../../assets/animations/presence_icon.png': require('../../assets/animations/presence_icon.png'),
  '../../assets/animations/abbsenceicon.png': require('../../assets/animations/abbsenceicon.png'),
  '../../assets/animations/lateComming.png': require('../../assets/animations/lateComming.png'),
  '../../assets/animations/wfh.png': require('../../assets/animations/wfh.png')
};

const projectList = [
  { id: '1', title: 'AI Redesign', client: 'OpenAI', startDate: '2025-04-01', dueDate: '2025-07-01', status: 'In Progress', completion: 60 },
  { id: '2', title: 'Mobile App UI', client: 'Tech Innovations', startDate: '2025-03-01', dueDate: '2025-06-15', status: 'Completed', completion: 85 },
  { id: '3', title: 'Backend Revamp', client: 'Cloud Corp', startDate: '2025-02-15', dueDate: '2025-08-01', status: 'In Progress', completion: 45 },
  { id: '4', title: 'Marketing Website', client: 'Bright Media', startDate: '2025-01-10', dueDate: '2025-05-20', status: 'Completed', completion: 100 },
  { id: '5', title: 'Security Audit', client: 'SafeTech', startDate: '2025-03-05', dueDate: '2025-06-30', status: 'In Progress', completion: 70 }
];

export default function Projects() {
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
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
    <View style={[styles.card, {
    }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            numberOfLines={2}
            style={[adjustFont(Louis_George_Cafe.bold.h7, 2), styles.cardLabel]}
          >
            {t("Total Projects")}
          </Text>
        </View>
        <View>
          <Text style={adjustFont(Louis_George_Cafe.bold.h6, 4)}>{value}</Text>
        </View>
      </View>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D7E3FF",
        padding: wp(1),
        borderRadius: wp(2), marginVertical: wp(1)
      }}>
        <Image source={ICON_MAP[icon]} style={styles.cardIcon} />
        <Text style={[adjustFont(Louis_George_Cafe.bold.h8, 4), {
          marginHorizontal: wp(2)
        }]}>{`${value} active`}</Text>
      </View>
    </View>
  );

  const renderProjectItem = ({ item }) => (
    <View style={[styles.projectCard, { marginVertical: wp(2) }]}>
      <Text style={[adjustFont(Louis_George_Cafe.bold.h6, 2), {
        paddingVertical: wp(1.2), borderBottomWidth: wp(0.4), borderColor: "#ccc"
      }]}>{item.title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(2) }}>
        <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>Client: {item.client}</Text>
        <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>Due: {item.dueDate}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(2) }}>
        <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>Start: {item.startDate}</Text>
        <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>Status: {item.status}</Text>
      </View>

      <View style={{
        borderRadius: wp(3),
        overflow: 'hidden',
        height: hp(2),
        marginVertical: hp(1)
      }}>
        {Platform.OS === 'android' ? (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={item.completion / 100}
            color={THEMECOLORS[themeMode].primaryApp}
            style={{ height: hp(2) }}
          />
        ) : (
          <ProgressViewIOS
            progress={item.completion / 100}
            progressTintColor={THEMECOLORS[themeMode].primaryApp}
            style={{ height: hp(2) }}
          />
        )}
      </View>

      <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{`${item.completion}% Completed`}</Text>

      <View style={{ flexDirection: "row", marginVertical: wp(1), alignItems: "center" }}>
        <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>Status: </Text>
        <Text style={[
          adjustFont(Louis_George_Cafe.bold.h8, 2),
          {
            backgroundColor: item.status === 'Completed' ? 'lightgreen' : 'yellow',
            paddingHorizontal: wp(1),
            borderRadius: wp(4),
            lineHeight: wp(6)
          }
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <HeaderComponent title={t('Projects')} showBackArray={true} />
      {loading ? (
        <HomeScreenLoader />
      ) : (
        <>
          {/* Fixed height container to hold attendance cards */}
          <View style={{ maxHeight: hp(40) /* adjust as needed */, marginBottom: hp(2) }}>
            <FlatList
              data={attendanceData?.attendanceStatsArray || []}
              numColumns={2}
              keyExtractor={(_, idx) => idx.toString()}
              columnWrapperStyle={[styles.cardRow, {
              }]}
              renderItem={({ item }) => renderCard(item)}
              scrollEnabled={false} // Disable scrolling for first list
            />
          </View>
          {/* Scrollable list for projects */}
          <FlatList
            data={projectList}
            keyExtractor={item => item.id}
            renderItem={renderProjectItem}
            contentContainerStyle={{
              // paddingBottom: hp(2),
              padding: wp(2),
              backgroundColor: "#F1F1F1",
              borderRadius: wp(1),
            }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  card: {
    width: wp(47),
    borderRadius: wp(4),
    padding: wp(1),
    marginTop: hp(2),
    borderWidth: wp(0.4),
    borderColor: "#ccc",
  },
  cardContent: {
    flexDirection: 'column',
    gap: wp(2),
    padding: wp(4),
    width: wp(47),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cardIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  cardLabel: {
    flex: 1,
    flexWrap: 'wrap',
    textTransform: 'capitalize',
    lineHeight: wp(4),
  },
  projectCard: {
    borderRadius: wp(1),
    padding: wp(2),
    marginVertical: wp(2),
    backgroundColor: '#FFF'
  }
});
