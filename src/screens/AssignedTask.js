import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  ActivityIndicator, TouchableOpacity, ToastAndroid
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { changeTaskStatus, getTaskAssignedArray, getProjects, getProjectsStats } from '../redux/authActions';
import HeaderComponent from '../components/HeaderComponent';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DropdownModal from '../components/DropDownModal';
import SearchInput from './SearchInput';
import FilterButtons from './FilterButtons';
import SearchSelectProjectScreen from './SearchSelectProjectScreen';
import SearchSelectProject from './SearchSelectProject';

const AssignedTask = () => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user?.data);

  const [taskList, setTaskList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [tid, setTaskId] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeDropdown, setActiveDropdown] = useState(null); // 'filterStatus', 'priority', 'projects', 'editStatus'
  const [selectedFilterStatus, setSelectedFilterStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDateAscending, setIsDateAscending] = useState(true);

  const [showProjects, setshowProjects] = useState(false);


  // Add this function below your `applyFilters` function:
  const sortListByDate = (ascending) => {
    const sorted = [...filteredList].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return ascending ? dateA - dateB : dateB - dateA;
    });
    setFilteredList(sorted);
  };

  const [projectArr, setProjectArr] = useState([]); // fetched API

  useFocusEffect(
    React.useCallback(() => {
      fetchAssignedTasks();
      fetchProjectsList();
    }, [userdata])
  );

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) navigation.goBack();
  });

  const fetchAssignedTasks = () => {
    setLoading(true);
    dispatch(getTaskAssignedArray({ userid: userdata?.id }, (res) => {
      if (res.success) {
        setTaskList(res.data || []);
        setFilteredList((res.data || []).sort((a, b) =>
          isDateAscending ? new Date(a.startDate) - new Date(b.startDate) : new Date(b.startDate) - new Date(a.startDate)
        ));
      }
      setLoading(false);
      setRefreshing(false);
    }));
  };

  const fetchProjectsList = () => {
    dispatch(getProjectsStats({ userid: userdata?.id }, (res) => {
      if (res.success) {
        // alert(JSON.stringify(res.data))
        setProjectArr(res.data.map(proj => ({
          label: proj.projectName, value: proj._id
        })));
      }
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignedTasks();
  };

  const statusArr = [
    { label: t('pending'), value: 'Pending' },
    { label: t('inprogress'), value: 'In Progress' },
    { label: t('completed'), value: 'Completed' },
  ];
  const priorityArr = [
    { label: t('low'), value: 'Low' },
    { label: t('medium'), value: 'Medium' },
    { label: t('high'), value: 'High' },
  ];

  const formatDate = dateStr => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const toggleExpand = id => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenChangeStatus = item => {
    setTaskId(item._id);
    setActiveDropdown('editStatus');
  };

  const handleChangeStatus = status => {
    dispatch(changeTaskStatus({
      taskId: tid, userid: userdata?.id, taskStatus: status
    }, res => {
      ToastAndroid.show(res.message, ToastAndroid.SHORT);
      setTaskId(null);
      if (res.success) onRefresh();
    }));
  };

  const applyFilters = (status, priority, project) => {
    setLoading(true);
    const filters = {
      userid: userdata?.id,
      ...(status && { taskStatus: status }),
      ...(priority && { priority }),
      ...(project && { projectId: project._id }), // project could be ID or object
    };

    dispatch(getTaskAssignedArray(filters, (res) => {
      if (res.success) {
        // alert(JSON.stringify(res))
        const sortedList = (res.data || []).sort((a, b) =>
          isDateAscending
            ? new Date(a.startDate) - new Date(b.startDate)
            : new Date(b.startDate) - new Date(a.startDate)
        );
        setFilteredList(sortedList);
      } else {
        setFilteredList([]);
      }
      setLoading(false);
    }));
  };

  const handleDropdownSelect = item => {
    if (activeDropdown === 'filterStatus') {
      setSelectedFilterStatus(item.value);
      applyFilters(item.value, selectedPriority, selectedProject);
    }
    else if (activeDropdown === 'priority') {

      setSelectedPriority(item.value);
      applyFilters(selectedFilterStatus, item.value, selectedProject);
    }
    else if (activeDropdown === 'projects') {
      // setSelectedProject(item.value);
      applyFilters(selectedFilterStatus, selectedPriority, item.value);
    }
    else if (activeDropdown === 'editStatus') {
      handleChangeStatus(item.value);
    }
    setActiveDropdown(null);
  };

  const handleShowProjectsList = () => {
    // alert("lokl;klkl;kl;")
    setshowProjects(true)
  }

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
      <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.cardHeader}>
        <Text style={[Louis_George_Cafe.bold.h4, { color: THEMECOLORS[themeMode].black }]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={[Louis_George_Cafe.regular.h7, styles.itemText, { color: THEMECOLORS[themeMode].textPrimary }]}>
          {t('description')}: <Text style={styles.value}>{item.description}</Text>
        </Text>
        <Text style={[Louis_George_Cafe.regular.h7, styles.itemText, { color: THEMECOLORS[themeMode].textPrimary }]}>
          {t('startDate')}: <Text style={styles.value}>{formatDate(item.startDate)}</Text>
        </Text>
        <Text style={[Louis_George_Cafe.regular.h7, styles.itemText, { color: THEMECOLORS[themeMode].textPrimary }]}>
          {t('priority')}: <Text style={styles.value}>{item.priority}</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(1) }}>
          <Text style={[Louis_George_Cafe.regular.h6, styles.itemText, { color: THEMECOLORS[themeMode].textPrimary }]}>
            {t('status')}:
          </Text>
          <TouchableOpacity
            onPress={() => handleOpenChangeStatus(item)}
            style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#F2E8FF', paddingHorizontal: wp(1), marginHorizontal: wp(1), borderRadius: wp(2)
            }}>
            <Text style={[Louis_George_Cafe.bold.h6, { backgroundColor: '#F2E8FF', padding: wp(2), borderRadius: wp(2) }]}>
              {item.taskStatus}
            </Text>
            <MaterialIcons name='edit' size={wp(6)} color={THEMECOLORS[themeMode].black} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (showProjects) {
    return (
      <SearchSelectProject
        selectedEIds={null}
        onClose={(selectedIDs) => {
          //  alert(selectedIDs?.projectName,"selectedIDs")
          setSelectedProject(selectedIDs?._id ? selectedIDs : null)
          applyFilters(selectedFilterStatus, selectedPriority, selectedIDs);
          setshowProjects(false);
        }}
      />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
      <HeaderComponent showBackArray title={t('AssignedTask')} />
      <View style={{ paddingHorizontal: wp(4), paddingVertical: wp(2) }}>
        <SearchInput searchText={searchText} setSearchText={setSearchText} themeMode={themeMode} />
      </View>
      <FilterButtons
        themeMode={themeMode}
        titles={['Status', 'Priority', 'Projects']}
        onPressHandlers={[
          () => setActiveDropdown('filterStatus'),
          () => setActiveDropdown('priority'),
          () => handleShowProjectsList()
        ]}
      />


      <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: wp(4), marginBottom: hp(1) }}>
        {selectedProject && selectedProject != null && (
          <View style={styles.filterChip}>
            <Text style={[Louis_George_Cafe.regular.h8, styles.chipText]}>
              {selectedProject?.projectName}
            </Text>
            <MaterialCommunityIcons
              onPress={() => {
                setSelectedProject(null);
                applyFilters(selectedFilterStatus, selectedPriority, null);
              }}
              name="close"
              size={wp(6)}
              color={THEMECOLORS[themeMode].validation}
            />
          </View>
        )}
        {selectedFilterStatus && selectedFilterStatus !== "" && (
          <View style={styles.filterChip}>
            <Text style={[Louis_George_Cafe.regular.h8, styles.chipText]}>
              {selectedFilterStatus}
            </Text>
            <MaterialCommunityIcons
              onPress={() => {
                setSelectedFilterStatus(null);
                applyFilters(null, selectedPriority, selectedProject);
              }}
              name="close"
              size={wp(6)}
              color={THEMECOLORS[themeMode].validation}
            />
          </View>
        )}
        {selectedPriority && selectedPriority !== '' && (
          <View style={styles.filterChip}>
            <Text style={[Louis_George_Cafe.regular.h8, styles.chipText]}>
              {selectedPriority}
            </Text>
            <MaterialCommunityIcons
              onPress={() => {
                setSelectedPriority(null);
                applyFilters(selectedFilterStatus, null, selectedProject);
              }}
              name="close"
              size={wp(6)}
              color={THEMECOLORS[themeMode].validation}
            />
          </View>
        )}
      </View>



      <TouchableOpacity
        onPress={() => {
          const newOrder = !isDateAscending;
          setIsDateAscending(newOrder);
          sortListByDate(newOrder);
        }}
        style={{ alignSelf: 'flex-end', marginHorizontal: hp(3), marginBottom: wp(2) }}
      >
        <Text style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].textPrimary }]}>
          {t('sortByDate')}{" "}
          <MaterialCommunityIcons
            name={isDateAscending ? 'sort-ascending' : 'sort-descending'}
            size={wp(4)}
            color={THEMECOLORS[themeMode].textPrimary}
          />
        </Text>
      </TouchableOpacity>


      {loading ? (
        <ActivityIndicator size="large" color={THEMECOLORS[themeMode].textPrimary} style={{ marginTop: hp(10) }} />
      ) : (
        <FlatList
          data={filteredList}
          renderItem={renderItem}
          keyExtractor={(item, idx) => `${item._id}_${idx}`}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
              {t('noTaskData')}
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[THEMECOLORS[themeMode].textPrimary]}
              tintColor={THEMECOLORS[themeMode].textPrimary}
            />
          }
        />
      )}

      <DropdownModal
        selectedValue={null}
        visible={!!activeDropdown}
        items={
          activeDropdown === 'filterStatus' ? statusArr :
            activeDropdown === 'priority' ? priorityArr :
              // activeDropdown === 'projects' ? projectArr :
              statusArr
        }
        onSelect={handleDropdownSelect}
        onCancel={() => setActiveDropdown(null)}
        title={t(
          activeDropdown === 'filterStatus' ? 'projectStatus' :
            activeDropdown === 'priority' ? 'priority' :
              // activeDropdown === 'projects' ? 'projects' :
              'status'
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingBottom: hp(10) },
  card: {
    borderRadius: wp(3), padding: wp(2), borderWidth: 1, borderColor: '#ccc',
    marginHorizontal: wp(2), marginVertical: wp(1.5),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: hp(1), backgroundColor: '#F2E8FF',
    paddingHorizontal: wp(2), borderRadius: wp(2), paddingVertical: wp(2)
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c9c9c9",
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    marginRight: wp(3),
    marginBottom: hp(1),
  },
  chipText: {
    marginRight: wp(1),
  },
  cardContent: { marginTop: hp(0.5) },
  itemText: { marginBottom: hp(0.6), margin: wp(1) },
  value: { fontWeight: '600', margin: wp(4) },
  emptyText: { textAlign: 'center', marginTop: hp(10) },
});

export default AssignedTask;
