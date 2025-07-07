import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Modal,
    Alert,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { genearteOverAllPayroll, getEmployeeList } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import SearchInput from './SearchInput';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import DropdownModal from '../components/DropDownModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const downloadAndOpenExcel = async (url) => {
    try {
        const fileName = url.split('/').pop(); // Extract file name
        const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`; // Safe internal path

        // Download the file
        const download = RNFS.downloadFile({
            fromUrl: url,
            toFile: localFile,
        });

        const result = await download.promise;

        if (result.statusCode === 200) {
            // Open the file
            await FileViewer.open(localFile, { showOpenWithDialog: true });
        } else {
            Alert.alert('Download failed', 'Could not download the Excel file.');
        }
    } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Something went wrong while downloading the file.');
    }
};

const PAGE_SIZE = 13;



const PayrollSettings = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const loadingRef = useRef(false);
    const endReachedRef = useRef(false);

    // 🧿 Dropdown modal states
    const [monthModalVisible, setMonthModalVisible] = useState(false);
    const [yearModalVisible, setYearModalVisible] = useState(false);
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [monthError, setMonthError] = useState('');
    const [yearError, setYearError] = useState('');

    const months = [
        { label: 'January', value: '01' }, { label: 'February', value: '02' }, { label: 'March', value: '03' },
        { label: 'April', value: '04' }, { label: 'May', value: '05' }, { label: 'June', value: '06' },
        { label: 'July', value: '07' }, { label: 'August', value: '08' }, { label: 'September', value: '09' },
        { label: 'October', value: '10' }, { label: 'November', value: '11' }, { label: 'December', value: '12' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i).map(y => ({ label: y.toString(), value: y.toString() }));

    const fetchEmployee = useCallback((currentPage = 1, isRefresh = false) => {
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

        dispatch(getEmployeeList(
            userdata?.id,
            currentPage,
            PAGE_SIZE,
            searchText,
            (response) => {
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
                        setCategories(prev => [...prev, ...newData]);
                        setPage(currentPage + 1);
                    }
                }

                setLoading(false);
                loadingRef.current = false;
                setRefreshing(false);
            }
        ));
    }, [dispatch, searchText]);

    useEffect(() => {
        fetchEmployee(1, true);
    }, [fetchEmployee]);

    const onRefresh = () => fetchEmployee(1, true);

    const loadMore = () => {
        if (!loadingRef.current && !endReachedRef.current) {
            fetchEmployee(page);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchEmployee(1, true);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchText, fetchEmployee]);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const handleConfirmSelection = () => {
        let isValid = true;

        if (!selectedMonth) {
            setMonthError(t('please_select_month'));
            isValid = false;
        } else {
            setMonthError('');
        }

        if (!selectedYear) {
            setYearError(t('please_select_year'));
            isValid = false;
        } else {
            setYearError('');
        }

        if (!isValid) return;

        // `${t('month')}: ${months.find(m => m.value === selectedMonth)?.label || selectedMonth}\n${t('year')}: ${year}`

        dispatch(
            genearteOverAllPayroll({ userid: userdata?.id, month: `${months.find(m => m.value === selectedMonth)?.label || selectedMonth}`, year: `${selectedYear}` }, (response) => {
                // console.log(JSON.stringify(response))
                if (response?.success && response?.excelUrl) {
                    downloadAndOpenExcel(response.excelUrl);
                }


            })
        );


        setSelectionModalVisible(false);
        // ✅ Reset all fields
        setSelectedMonth('');
        setSelectedYear('');
        setMonthError('');
        setYearError('');
        // Alert.alert(
        //     t('selected_values'),
        //     `${t('month')}: ${months.find(m => m.value === selectedMonth)?.label || selectedMonth}\n${t('year')}: ${selectedYear}`
        // );
    };


    const renderItem = ({ item, index }) => {
        const category = item.category || item;
        return (
            <TouchableOpacity style={[styles.cardBox, { backgroundColor: '#EDF2FF' }]}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h9, styles.column, styles.textAlignLeft, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>
                    {`${index + 1}. ${category.name}`}
                </Text>
                <Text style={[Louis_George_Cafe.regular.h9, styles.column, styles.textAlignCenter, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>
                    {category?.eId || '-'}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('PayrollDetails', { item })}
                >
                    <Text
                        numberOfLines={1} style={[Louis_George_Cafe.regular.h9, styles.column, styles.textAlignRight, { fontSize: isTamil ? wp(2.5) : wp(3), textDecorationLine: "underline" }]}
                    >
                        {t('generate')}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <HeaderComponent
                title={t('PayrollSettings')}
                showBackArray={true}
                rightSideArr={'plus-circle-outline'} rIconFunction={() => setSelectionModalVisible(true)}
            />
            <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
                <SearchInput searchText={searchText} setSearchText={setSearchText} themeMode={themeMode} />
                <View style={styles.listContainer}>
                    <View style={[styles.headerRow]}>
                        <Text style={[Louis_George_Cafe.bold.h9, styles.column, styles.textAlignLeft, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>{t('employee_name')}</Text>
                        <Text style={[Louis_George_Cafe.bold.h9, styles.column, styles.textAlignCenter, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>{t('id')}</Text>
                        <Text style={[Louis_George_Cafe.bold.h9, styles.column, styles.textAlignRight, { fontSize: isTamil ? wp(2.5) : wp(3) }]}>{t('action')}</Text>
                    </View>

                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.category?._id || index.toString()}
                        contentContainerStyle={{ paddingBottom: hp(1), flexGrow: 1 }}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.1}
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
                        ListEmptyComponent={
                            !loading && !refreshing && (
                                <View style={{ paddingTop: hp(3), alignItems: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: wp(4) }}>{t('no_data')}</Text>
                                </View>
                            )
                        }
                    />
                </View>
            </View>

            {/* 🧿 Modal for selection */}
            <Modal visible={selectionModalVisible} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setSelectionModalVisible(false)}
                    style={styles.overlay}
                >
                    <TouchableOpacity activeOpacity={1} style={[styles.selectionModalContainer, {
                        backgroundColor: THEMECOLORS[themeMode].viewBackground
                    }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(2), marginBottom: wp(4) }}>
                            <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].textPrimary, marginBottom: hp(2) }]}>
                                {t('select_month_year')}
                            </Text>
                            <MaterialCommunityIcons onPress={() => setSelectionModalVisible(false)} name="close" size={wp(6)} color={THEMECOLORS[themeMode].textPrimary} />
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.dropdownInput,
                                monthError ? { borderColor: 'red' } : {},
                            ]}
                            onPress={() => setMonthModalVisible(true)}
                        >
                            <Text style={{ color: selectedMonth ? THEMECOLORS[themeMode].textPrimary : '#999' }}>
                                {selectedMonth ? months.find(m => m.value === selectedMonth)?.label : t('select_month')}
                            </Text>
                        </TouchableOpacity>
                        {monthError ? <Text style={styles.errorText}>{monthError}</Text> : null}
                        <TouchableOpacity
                            style={[
                                styles.dropdownInput,
                                yearError ? { borderColor: 'red' } : {},
                            ]}
                            onPress={() => setYearModalVisible(true)}
                        >
                            <Text style={{ color: selectedYear ? THEMECOLORS[themeMode].textPrimary : '#999' }}>
                                {selectedYear || t('select_year')}
                            </Text>
                        </TouchableOpacity>
                        {yearError ? <Text style={styles.errorText}>{yearError}</Text> : null}
                        <TouchableOpacity
                            onPress={handleConfirmSelection}
                            style={[styles.confirmButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                        >
                            <Text style={[Louis_George_Cafe.bold.h6, { color: '#fff' }]}>{t('download')}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* 🧿 Month Dropdown Modal */}
            <DropdownModal
                visible={monthModalVisible}
                title={t('select_month')}
                items={months}
                selectedValue={selectedMonth}
                onCancel={() => setMonthModalVisible(false)}
                onSelect={(item) => {
                    setSelectedMonth(item.value);
                    setMonthError('');
                    setMonthModalVisible(false);
                }}
            />
            {/* 🧿 Year Dropdown Modal */}
            <DropdownModal
                visible={yearModalVisible}
                title={t('select_year')}
                items={years}
                selectedValue={selectedYear}
                onCancel={() => setYearModalVisible(false)}
                onSelect={(item) => {
                    setSelectedYear(item.value);
                    setYearError('');
                    setYearModalVisible(false);
                }}

            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    listContainer: {
        backgroundColor: "#EDF2FF",
        justifyContent: "center",
        borderRadius: wp(2),
        paddingTop: wp(3),
        flex: 1,
    },
    cardBox: {
        borderRadius: wp(2),
        paddingVertical: wp(2),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    headerRow: {
        backgroundColor: '#D0DBFF',
        paddingVertical: wp(3),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    column: {
        flex: 1,
        paddingHorizontal: wp(1),
    },
    textAlignLeft: { textAlign: 'left', textTransform: "capitalize" },
    textAlignCenter: { textAlign: 'center', textTransform: "capitalize" },
    textAlignRight: { textAlign: 'right', textTransform: "capitalize" },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: wp(3),
        marginBottom: hp(1),
        marginLeft: wp(1),
    },

    selectionModalContainer: {
        width: wp(90),
        padding: wp(4),
        borderRadius: wp(2),
        paddingVertical: hp(4)
    },
    dropdownInput: {
        borderWidth: 1,
        borderRadius: wp(3),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        marginBottom: hp(1.5),
        justifyContent: 'center',
        borderColor: "#CCC"
    },
    confirmButton: {
        alignItems: 'center',
        padding: hp(1.5),
        borderRadius: wp(2),
        marginTop: wp(4)
    },
});

export default PayrollSettings;
