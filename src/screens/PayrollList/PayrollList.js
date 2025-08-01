import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { wp, hp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { THEMECOLORS } from '../../resources/colors/colors';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getEmployeeList, getPayrollActivitites } from '../../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';
import ThemeToggle from '../../ScreenComponents/HeaderComponent/ThemeToggle';
import SearchInput from '../SearchInput';
import { useAndroidBackHandler } from '../../hooks/useAndroidBackHandler';

const PAGE_SIZE = 13;
const PayrollList = () => {

  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  // const employId = route?.params;
  const userdata = useSelector((state) => state.auth.user?.data);

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [isEndReached, setIsEndReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadingRef = useRef(false);
  const endReachedRef = useRef(false);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  const fetchPayRollList = useCallback((currentPage = 1, isRefresh = false) => {
    if (loadingRef.current || (endReachedRef.current && !isRefresh)) return;
    if (isRefresh) {
      setRefreshing(true);
      setIsEndReached(false);
      endReachedRef.current = false;
      setPage(1);
    } else {
      setLoading(true);
    }

    loadingRef.current = true;
    dispatch(getPayrollActivitites(
      userdata?.id,
      currentPage,
      PAGE_SIZE,
      searchText,
      (response) => {
        // console.log(`Fetching page: ${response}`);
        if (response?.success) {
          const newData = response.employeeList || [];
          if (newData.length < PAGE_SIZE) {
            setIsEndReached(true);
            endReachedRef.current = true;
          }
          if (isRefresh) {
            setCategories(newData);
            setPage(2);
          } else {
            setCategories(prev => [
              ...prev,
              ...newData,
            ]);
            setPage(currentPage + 1);
            // ✅ Use currentPage to avoid async issues
          }
        }

        setLoading(false);
        loadingRef.current = false;
        setRefreshing(false);
      }
    ));
  }, [dispatch, searchText]);

  useEffect(() => {
    fetchPayRollList(1, true);
  }, [fetchPayRollList]);

  const onRefresh = () => {
    fetchPayRollList(1, true);
  };
  const loadMore = () => {
    if (!loadingRef.current && !endReachedRef.current) {
      fetchPayRollList(page);
    }
  };
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPayRollList(1, true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchText, fetchPayRollList]);

  const renderItem = ({ item, index }) => {
    const category = item.category || item;
    return (
      <TouchableOpacity
        style={[styles.cardBox, { backgroundColor: '#FFFBF0' }]}
      >
        <Text style={[
          Louis_George_Cafe.regular.h9,
          styles.categoryTitle,
          {
            fontSize: isTamil ? wp(2.5) : wp(3)
          }
        ]}>
          {`${index + 1} . ${category.name}`}
        </Text>
        <Text style={[
          Louis_George_Cafe.regular.h9,
          styles.categoryTitle,
          {
            fontSize: isTamil ? wp(2.5) : wp(3),

          }
        ]}>
          {category?.position}
        </Text>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => {
    if (loading || refreshing) return null;
    return (
      <View style={{ paddingTop: hp(2), alignItems: 'center' }}>
        <Text style={{ color: '#000', fontSize: wp(4), lineHeight: wp(6) }}>
          {t('no_data')}
        </Text>
      </View>
    );
  };

  return (
    <>
      <HeaderComponent title={t('payrollActivities')} showBackArray={true} />
      <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
        {
          // categories?.length != 0 && !loading && !refreshing &&
          <SearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            themeMode={themeMode}
          />
        }
        {
          // categories?.length != 0 &&  !refreshing ?
          <View style={{
            backgroundColor: "#FFFBF0", justifyContent: "center", borderRadius: wp(2), paddingTop: wp(2), flex: 1
          }}>
            <View
              style={[styles.cardBox]}
            >
              <Text style={[
                Louis_George_Cafe.bold.h9,
                styles.categoryTitle,
                {
                  // color: THEMECOLORS[themeMode].textPrimary,
                  fontSize: isTamil ? wp(2.5) : wp(3)
                }
              ]}>
                {t('employee_name')}
              </Text>

              <Text style={[
                Louis_George_Cafe.bold.h9,
                styles.categoryTitle,
                {
                  // color: THEMECOLORS[themeMode].textPrimary,
                  fontSize: isTamil ? wp(2.5) : wp(3), alignSelf: "center", alignItems: "center", paddingHorizontal: wp(2)
                }
              ]}>
                {t('position')}
              </Text>
            </View>
            <FlatList
              data={categories}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.category?._id || index.toString()}
              contentContainerStyle={{ paddingBottom: hp(5), flexGrow: 1 }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1} // ✅ Lower threshold
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={THEMECOLORS[themeMode].primaryApp}
                  colors={["#013CA3"]}
                />
              }
              ListFooterComponent={
                loading && !refreshing ? (
                  <ActivityIndicator size="small" color={THEMECOLORS[themeMode].primaryApp} />
                ) : null
              }
              ListEmptyComponent={ListEmptyComponent}
            />
          </View>
          // :
          // <View style={{ paddingTop: hp(10), alignItems: 'center' }}>
          //     <Text style={{ color: THEMECOLORS[themeMode].textPrimary, fontSize: wp(4), lineHeight: wp(6) }}>
          //         {t('no_data')}
          //     </Text>
          // </View>
        }

        {/* <ThemeToggle /> */}

      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(3),
  },
  cardBox: {
    borderRadius: wp(2),
    padding: wp(3),
    marginBottom: hp(1),
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: wp(3)
  },
});

export default PayrollList;
