import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { wp, hp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import HeaderComponent from '../../components/HeaderComponent';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProjectById, getProjectsStats } from '../../redux/authActions';
import HomeScreenLoader from '../HomeScreenLoader';
import { useAndroidBackHandler } from '../../hooks/useAndroidBackHandler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Projects() {

  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const userdata = useSelector(state => state.auth.user);
  const [projectList, setProjectList] = React.useState([]);
  const navigation = useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const isTamil = i18n.language === 'ta';

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  const handleDeletePress = (id) => {
    setSelectedProjectId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    // Dispatch delete action or call API here
    setLoading(true);
    dispatch(deleteProjectById(selectedProjectId, userdata?.data?.id, res => {
      ToastAndroid.show(res.message, ToastAndroid.SHORT);
      setLoading(false);
      if (res.success) {
        functionGetProjects();
      }
    }));

    setShowModal(false);
    setSelectedProjectId(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedProjectId(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      functionGetProjects()

    }, [userdata])
  );

  const functionGetProjects = () => {
    setLoading(true);
    dispatch(getProjectsStats(userdata?.data?.id, res => {
      if (res.success) {
        const projectsMapped = res.data.map(project => ({
          id: project._id,
          title: project.projectName || 'No Title',
          client: project.client?.name || 'No Client',
          dueDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No Due Date',
          startDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No Start Date',
          status: project.projectStatus || 'Pending',
          completion: project.completion || 0,
        }));
        setProjectList(projectsMapped);
      }
      setLoading(false);
    }));
  }
  
  const adjustFont = (style, offset) => ({
    ...style,
    fontSize: isTamil ? style.fontSize - offset + 1 : style.fontSize,
  });

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={{ marginTop: wp(2) }}
      onPress={() => navigation.navigate('AddProjectForm', { data: item })}
    >
      {/* <MaterialCommunityIcons
        onPress={() => handleDeletePress(item?.id)}
        name="delete"
        size={hp(4)}
        color={'red'}
        style={{ alignSelf: "flex-end", position: "absolute", margin: wp(1), zIndex: 1, bottom: hp(25) }}
      /> */}

      <View style={[styles.projectCard, {
        marginVertical: wp(2),
        backgroundColor: THEMECOLORS[themeMode].cardBackground
      }]}>
        <Text style={[adjustFont(Louis_George_Cafe.bold.h6, 2), {
          paddingVertical: wp(1.2), borderBottomWidth: wp(0.4), borderColor: "#ccc"
        }]}>{item.title}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(2) }}>
          <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{t('Client') || 'Client'}: {item.client}</Text>
          <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>{t('Due') || 'Due'}: {item.dueDate}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(2) }}>
          <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>{t('Start') || 'Start'}: {item.startDate}</Text>
          <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>{t('Status') || 'Status'}: {item.status}</Text>
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
          <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{`${item.completion}% ${t('Completed') || 'Completed'}`}</Text>
          <View style={{ flexDirection: "row", marginVertical: wp(1), alignItems: "center" }}>
            <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{t('Status') || 'Status'}: </Text>
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
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <HeaderComponent title={t('Projects')} showBackArray={true} />

      {loading ? (
        <HomeScreenLoader />
      ) : (
        <>
          <View style={{ marginHorizontal: wp(2), marginBottom: hp(1) }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProjectForm', { data: null })}
              style={[
                styles.addButton,
                { backgroundColor: THEMECOLORS[themeMode].primaryApp },
              ]}
            >
              <Text style={[Louis_George_Cafe.bold.h6, styles.addButtonText, {
                fontSize: isTamil ? wp(3.2) : wp(4),
                color: THEMECOLORS[themeMode].white,
              }]}>
                {t('add_new')}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={projectList}
            keyExtractor={item => item.id}
            renderItem={renderProjectItem}
            contentContainerStyle={{
              padding: wp(2),
              borderRadius: wp(1),
            }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
      <ConfirmationModal
        visible={showModal}
        message={t('delete_project_confirmation')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2),
  },
  projectCard: {
    borderRadius: wp(2),
    padding: wp(3),
    marginVertical: wp(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
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
  addButton: {
    flexDirection: 'row',
    width: wp(30),
    height: wp(8),
    alignSelf: 'flex-end',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(2)
  },
  addButtonText: {
    lineHeight: wp(5),
  },
});
