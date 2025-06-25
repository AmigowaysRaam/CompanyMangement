import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  BackHandler,
  FlatList,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { hp } from "../../resources/dimensions";
import HeaderComponent from "../../components/HeaderComponent";
import HomeScreenModal from "../HomescreenModal";
import WorkForceCard from "../WorkforceCard";
import PieChart from "../../ScreenComponents/HeaderComponent/PieChart";
import TaskTable from "../../ScreenComponents/HeaderComponent/TaskTable";
import PieChartWebView from "../../ScreenComponents/HeaderComponent/GraphChart";
import EmployeeTable from "../../ScreenComponents/HeaderComponent/TableData";
import { THEMECOLORS } from "../../resources/colors/colors";
import { useTheme } from "../../context/ThemeContext";
import { getHomePageData } from "../../redux/authActions";
import EmployeePaylist from "../../ScreenComponents/HeaderComponent/EmployeePaylist";
import { useTranslation } from "react-i18next";
import HomeScreenLoader from "../HomeScreenLoader";

const HomeScreen = () => {

  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user?.data);
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [working, setWorking] = useState(false);
  const [chtCount, setchatCount] = useState(null);



  // Prevent hardware back button action on this screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  // Fetch home data function
  const fetchHomeData = () => {
    setLoading(true);
    dispatch(
      getHomePageData(userdata?.id, (response) => {
        // alert(JSON.stringify(response, null, 2))
        if (response.success && response.data?.length > 0) {
          setHomeData(response.data[0]);
          // alert(response.count, null, 2)
          setWorking(response.punchedInToday)
          setchatCount(response?.count)
        }
        setLoading(false);
        setRefreshing(false);
      })
    );
  };

  // Fetch data on screen focus or when userdata changes
  useFocusEffect(
    React.useCallback(() => {
      // alert(JSON.stringify(userdata))
      fetchHomeData();
    }, [userdata])
  );

  const componentMap = {
    WorkForceCard: (data) => <WorkForceCard data={data} />,
    PieChart: (data) => <PieChart data={data} />,
    TaskTable: (data) => <TaskTable tdata={data} />,
    PieChartWebView: (data) => <PieChartWebView data={data} />,
    EmployeeTable: (data) => <EmployeeTable data={data} />,
    PaySlip: (data) => <EmployeePaylist data={data} />, // PaySlip key maps to EmployeePaylist
  };

  // Swipe gesture to open modal
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setIsModalVisible(true);
        }
      },
    })
  ).current;

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  // Handle header menu click
  const handleMenuClick = () => {
    setIsModalVisible(true);
  };

  // Dummy data for FlatList render
  const dummyData = [{ key: "dashboard" }];

  return (
    <View
      style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}
      {...panResponder.panHandlers}
    >
      <HeaderComponent chatCount={chtCount} working={working} title={t("home")} openModal={handleMenuClick} />
      {loading ? (
        <HomeScreenLoader />
      ) : (
        <FlatList
          data={dummyData}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#013CA3"]}
              tintColor={THEMECOLORS[themeMode].primaryApp || "#000000"}
            />
          }
          renderItem={() =>
            homeData ? (
              <>
                {Object.keys(homeData).map((key) => {
                  // Check if the key exists in the map
                  if (componentMap[key]) {
                    return <React.Fragment key={key}>{componentMap[key](homeData[key])}</React.Fragment>;
                  }
                  return null; // skip unknown keys
                })}
              </>
            ) : null
          }
        />
      )}
      {isModalVisible && (
        <HomeScreenModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(2),
  },
});

export default HomeScreen;
