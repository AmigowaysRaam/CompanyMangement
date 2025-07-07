import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  BackHandler,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
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
import { useTranslation } from "react-i18next";
import HomeScreenLoader from "../HomeScreenLoader";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import EmployeeTaskDashboard from "../../ScreenComponents/HeaderComponent/EmployeeTaskDashboard";

const HomeScreen = () => {

  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user?.data);
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [working, setWorking] = useState(false);
  const [chtCount, setChatCount] = useState(null);
  // Optional Facebook login logic (currently unused)
  const facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        console.log("Login cancelled", result);
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        console.error("Failed to get access token");
        return;
      }
      console.log("Access Token:", data.accessToken.toString());
    } catch (error) {
      console.error("Facebook Login Error: ", error);
    }
  };

  // Prevent hardware back button action on this screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  // Fetch home data function
  const fetchHomeData = () => {
    setLoading(true);
    dispatch(
      getHomePageData(userdata?.id, (response) => {
        if (response.success && response.data?.length > 0) {
          setHomeData(response.data[0]);
          // alert(JSON.stringify(response.data[0]),null,2)
          setWorking(response?.punchedInToday);
          setChatCount(response?.count?.toString() || null);
        }
        setLoading(false);
        setRefreshing(false);
      })
    );
  };

  // Fetch data on screen focus or when userdata changes
  useFocusEffect(
    React.useCallback(() => {
      fetchHomeData();
    }, [userdata])
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //   }, [userdata])
  // );

  // Map of component renderers
  const componentMap = {
    WorkForceCard: (data) => <WorkForceCard data={data} />,
    PieChart: (data) => <PieChart data={data} />,
    TaskTable: (data) => <TaskTable tdata={data} />,
    PieChartWebView: (data) => <PieChartWebView data={data} />,
    PaySlip: (data) => <EmployeeTable data={data} />, // Maps PaySlip key to EmployeeTable
    Employeetask: (data) => <EmployeeTaskDashboard tdata={data} />,
  };

  // Swipe gesture to open modal
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20,
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

  return (
    <View
      style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}
      {...panResponder.panHandlers}
    >
      <HeaderComponent
        chatCount={chtCount}
        working={working}
        title={t("home")}
        openModal={handleMenuClick}
      />
      <TouchableOpacity
        style={{ backgroundColor: 'red' }}
        onPress={() =>
          facebookLogin()
        }
      >
        <Text>test FaceBook</Text>
      </TouchableOpacity>


      {loading ? (
        <HomeScreenLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#013CA3"]}
              tintColor={THEMECOLORS[themeMode].primaryApp || "#000000"}
            />
          }
        >
          {homeData &&
            Object.entries(homeData).map(([key, value]) => {
              const isEmpty =
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

              if (componentMap[key] && !isEmpty) {
                return (
                  <React.Fragment key={key}>
                    {componentMap[key](value)}
                  </React.Fragment>
                );
              }
              return null;
            })}



        </ScrollView>
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
