import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  PanResponder, BackHandler,
  FlatList
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import ButtonComponent from "../../components/Button/Button";
import HeaderComponent from "../../components/HeaderComponent";
import HomeScreenModal from "../HomescreenModal";
import WorkForceCard from "../WorkforceCard";
import PieChart from "../../ScreenComponents/HeaderComponent/PieChart";
import TaskTable from "../../ScreenComponents/HeaderComponent/TaskTable";
import PieChartWebView from "../../ScreenComponents/HeaderComponent/GraphChart";
import EmployeeTable from "../../ScreenComponents/HeaderComponent/TableData";
import { THEMECOLORS } from "../../resources/colors/colors";
import { useTheme } from "../../context/ThemeContext";
const HomeScreen = () => {

  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.user?._id);
  const profile = useSelector((state) => state.auth.profile);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme, themeMode, toggleTheme } = useTheme();
  const userdata = useSelector((state) => state.auth.user);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent back action
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isModalVisible])
  );

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            navigation.replace("LoginScreen");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleMenuClick = () => {
    setIsModalVisible(true);
  };
  const dummyData = [{ key: 'static-content' }];

  // 🔄 Add gesture handler (swipe from left to right)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20, // Only respond to horizontal swipes
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setIsModalVisible(true);
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }} {...panResponder.panHandlers}>
      <HeaderComponent title={"home"} openModal={handleMenuClick} />
      {/* <HeaderComponent title={"home"} openModal={handleMenuClick} /> */}
      <FlatList
        data={dummyData}
        renderItem={() => (
          <>
            <WorkForceCard />
            <PieChart />
            <TaskTable />
            <PieChartWebView />
            <EmployeeTable />
          </>
        )}
        keyExtractor={(item) => item.key}
        // ListHeaderComponent={() =>}
        contentContainerStyle={styles.scrollContainer}
      />

      {isModalVisible && (
        <HomeScreenModal
          visible={isModalVisible}
          logout={() => alert("kljklkljkl")}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(2)

  },
  container: {
    flex: 1,
    padding: wp(5),
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: wp(4),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: wp(5),
    backgroundColor: COLORS.white,
    padding: wp(4),
    borderRadius: wp(2),
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 5,
  },
  profileImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  profileName: {
    fontSize: wp(5),
    color: COLORS.primary,
  },
  buttonSection: {
    marginTop: wp(10),
    width: "100%",
    alignItems: "center",
  },
});

export default HomeScreen;
