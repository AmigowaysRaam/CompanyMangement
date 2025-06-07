import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
} from 'react-native';
import { wp, hp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectsStats } from '../../redux/authActions';
import HomeScreenLoader from '../HomeScreenLoader';
import { useAndroidBackHandler } from '../../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';

const ICON_MAP = {
  '../../assets/animations/presence_icon.png': require('../../assets/animations/total_ico.png'),
  '../../assets/animations/abbsenceicon.png': require('../../assets/animations/completed_ico.png'),
  '../../assets/animations/lateComming.png': require('../../assets/animations/inprgress_ico.png'),
  '../../assets/animations/wfh.png': require('../../assets/animations/upcoming_ico.png')
};

export default function Projects() {

  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const userdata = useSelector(state => state.auth.user);
  const [attendanceData, setAttendanceData] = React.useState(null);
  const [projectList, setProfectList] = React.useState(null);
  const navigation = useNavigation();

  const [loading, setLoading] = React.useState(false);
  const isTamil = i18n.language === 'ta';

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(getProjectsStats(userdata?.data?.id, res => {
        if (res.success) {
          setProfectList(res.projects)
          setAttendanceData(res);
        }
        setLoading(false);
      }));
    }, [userdata])
  );

  const adjustFont = (style, offset) => ({
    ...style,
    fontSize: isTamil ? style.fontSize - offset + 1 : style.fontSize,
  });
  const renderCard = ({ icon, value, title, status, projectCounts, bg_color }) => (
    <View style={[styles.card, {
      backgroundColor: THEMECOLORS[themeMode].cardBackground
    }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            numberOfLines={2}
            style={[adjustFont(Louis_George_Cafe.bold.h8, 2), styles.cardLabel, {
              color: "#747474"
            }]}
          >
            {title}
          </Text>
        </View>
        <View>
          <Text style={adjustFont(Louis_George_Cafe.bold.h6, 4)}>{projectCounts}</Text>
        </View>
      </View>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: bg_color,
        padding: wp(1),
        borderRadius: wp(2), marginVertical: wp(1)
      }}>
        <Image source={ICON_MAP[icon]} style={styles.cardIcon} />
        <Text style={[adjustFont(Louis_George_Cafe.bold.h8, 4), {
          marginHorizontal: wp(2)
        }]}>{`${status}`}</Text>
      </View>
    </View>
  );

  const renderProjectItem = ({ item }) => (
    <View style={[styles.projectCard, {
      marginVertical: wp(2),
      backgroundColor: THEMECOLORS[themeMode].cardBackground
    }]}>
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
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.completion ?? 0}%`,
                  backgroundColor: THEMECOLORS[themeMode].primaryApp
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={{ margin: wp(2) }}>
        <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{`${item.completion}% Completed`}</Text>
        <View style={{ flexDirection: "row", marginVertical: wp(1), alignItems: "center" }}>
          <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>Status: </Text>
          <Text style={[
            adjustFont(Louis_George_Cafe.regular.h8, 2),
            {
              backgroundColor: item.status === 'Completed' ? 'lightgreen' : 'yellow',
              paddingHorizontal: wp(2),
              borderRadius: wp(4),
              lineHeight: wp(6)
            }
          ]}>
            {item.status}
          </Text>
        </View>
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
    width: wp(45),
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
    width: wp(45),
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
  },
  // 
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(2),
    marginVertical: hp(1),
    justifyContent: "center",
    width: wp(85)
  },

  progressBarBackground: {
    flex: 5,
    height: hp(1),
    backgroundColor: '#D9D9D9',
    borderRadius: hp(1),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: hp(1),
  },
});
