import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  PanResponder,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { themeMode } = useTheme();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent back action
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isModalVisible])
  );

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      dispatch(
        getHomePageData(userdata?.id, (response) => {
          if (response.success && response.data?.length > 0) {
            setHomeData(response.data[0]);
          }
          setLoading(false);
        })
      );
    }, [userdata])
  );

  const handleMenuClick = () => {
    setIsModalVisible(true);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setIsModalVisible(true);
        }
      }
    })
  ).current;

  const dummyData = [{ key: "dashboard" }];

  return (
    <View
      style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}
      {...panResponder.panHandlers}
    >
      <HeaderComponent title="home" openModal={handleMenuClick} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEMECOLORS[themeMode].primary} />
        </View>
      ) : (
        <FlatList
          data={dummyData}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.scrollContainer}
          renderItem={() => (
            <>
              {homeData && (
                <>
                  <WorkForceCard data={homeData.WorkForceCard} />
                  <PieChart data={homeData.PieChart} />
                  <TaskTable data={homeData.TaskTable} />
                  <PieChartWebView data={homeData.PieChartWebView} />
                  <EmployeeTable data={homeData.EmployeeTable} />
                  <EmployeePaylist />
                </>
              )}
            </>
          )}
        />
      )}

      {isModalVisible && (
        <HomeScreenModal
          visible={isModalVisible}
          logout={() => alert("Logging out")}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
