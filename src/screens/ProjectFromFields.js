// components/ProjectFormFields.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { height, Louis_George_Cafe, width } from '../resources/fonts';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import RNPickerSelect from 'react-native-picker-select';
import { getCompanyDetailById } from '../redux/authActions';
import { useDispatch } from 'react-redux';

const ProjectFormFields = ({
    themeMode,
    t,
    values,
    setValues,
    errors,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    handleFilePick,
    handleFileRemove,
    companyList,
    clientList,
    employeeList,
    statusOptions,
    // branchList,
    hostingurl
}) => {
    const styles = createStyles(themeMode);
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const [companyOpen, setCompanyOpen] = useState(false);
    const [clientOpen, setClientOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const [branchList, setbranchList] = useState([]);

    const [setBLoader, setsetBLoader] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setsetBLoader(true)
        if (values?.company != null)
            dispatch(getCompanyDetailById(values?.company, (res) => {
                setsetBLoader(true)
                if (res.success) {
                    console.log(res.data.branches)
                    setbranchList(
                        res.data.branches.map(branch => ({
                            label: branch?.branch_name,
                            value: branch?.branch_id
                        }))
                    );
                    setsetBLoader(false)
                    // console.log(branchList)
                }
            }));
    }, [values?.company]);

    const [employeeOpen, setEmployeeOpen] = useState(false);
    const [employeeModalVisible, setEmployeeModalVisible] = useState(false);

    useEffect(() => {
        console.log(JSON.stringify(values.files), "terst")
    }, [])

    return (
        <View>
            {/* Project Name */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('form_projectName')}</Text>
            <TextInput
                maxLength={25}
                style={styles.textInput}
                value={values.projectName}
                onChangeText={(text) => setValues((prev) => ({ ...prev, projectName: text }))}
                placeholder={t('form_enterProjectName')}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
            />
            {errors.projectName && <Text style={styles.errorText}>{errors.projectName}</Text>}
            {/* Company */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('form_company')}</Text>

            <DropDownPicker
                searchPlaceholder={t('search')}
                listMode="MODAL"
                open={companyOpen}
                value={values.company}
                items={companyList}
                setOpen={setCompanyOpen}
                setValue={(callback) =>
                    setValues((prev) => ({ ...prev, company: callback(prev.company) }))
                }
                setItems={() => { }}
                placeholder={t('form_chooseCompany')}
                searchable={true}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={6000}
                zIndexInverse={1000}
            // textStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
            // placeholderStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
            />
            {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}
            {/*  */}
            {/* Status */}

            {
                branchList?.length != 0 &&
                <>
                    <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                        color: THEMECOLORS[themeMode].textPrimary,
                    }]}>{t('branch')}</Text>
                    <View style={styles.pickerWrapper}>
                        {
                            setBLoader ?
                                <ActivityIndicator />
                                :
                                <RNPickerSelect
                                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                                    onValueChange={(value) =>
                                        setValues((prev) => ({ ...prev, branch: value }))
                                    }
                                    items={branchList}
                                    placeholder={{ label: t('branch'), value: null }}
                                    value={values.branch}
                                    style={{
                                        inputAndroid: {
                                            color: THEMECOLORS[themeMode].textPrimary
                                            // paddingRight: 25, // to avoid text overlap with the icon
                                        },
                                        iconContainer: {
                                            // top: wp(),
                                            left: hp(36.5),
                                        },
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                    Icon={() => {
                                        return <MaterialCommunityIcons name="chevron-down" size={wp(7)} color="#555" />;
                                    }}
                                />
                        }

                    </View>
                    {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}</>
            }



            {/*  */}
            {/* Client */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('form_client')}</Text>
            <DropDownPicker
                placeholderStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                searchPlaceholder={t('search')}
                listMode="MODAL"
                open={clientOpen}
                value={values.client}
                items={clientList}
                setOpen={setClientOpen}
                setValue={(callback) =>
                    setValues((prev) => ({ ...prev, client: callback(prev.client) }))
                }
                setItems={() => { }}
                placeholder={t('form_chooseClient')}
                searchable={true}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={5000}
                zIndexInverse={2000}
                textStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
            />
            {errors.client && <Text style={styles.errorText}>{errors.client}</Text>}

            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('hosting_url')}</Text>
            <TextInput
                maxLength={55}
                style={styles.textInput}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}

                value={values?.hostingurl}
                onChangeText={(text) => setValues((prev) => ({ ...prev, hostingurl: text }))}
                placeholder={t('hosting_url')}
            />
            {errors.hostingurl && <Text style={styles.errorText}>{errors.hostingurl}</Text>}


            {/*  */}

            {/* Employee Selection Button */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('form_chooseEmployee')}</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={() => {
                setEmployeeModalVisible(true),
                    setEmployeeOpen(true)
            }
            }>
                <Text style={{
                    color: THEMECOLORS[themeMode].textPrimary,
                }}>
                    {values.employee?.length > 0
                        ? `${values.employee.length} ${t('selected')}`
                        : t('form_chooseEmployee')}
                </Text>
            </TouchableOpacity>
            {errors.employee && <Text style={styles.errorText}>{errors.employee}</Text>}

            <Modal
                isVisible={employeeModalVisible}
                onBackdropPress={() => setEmployeeModalVisible(false)}
                avoidKeyboard={true}
                propagateSwipe={true}
                style={{
                    justifyContent: 'flex-end', margin: 4, position: 'absolute',
                    top: wp(1), width: wp(99),
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{
                        height: hp(95),
                        backgroundColor: '#fff',
                        padding: wp(4),
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <DropDownPicker
                            // placeholderStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
                            searchPlaceholder={t('search')}
                            multiple={true}
                            open={employeeOpen}
                            value={values.employee}
                            items={employeeList}
                            setOpen={() => {
                                setEmployeeModalVisible(true),
                                    setEmployeeOpen(true)
                            }}
                            setValue={(callback) =>
                                setValues((prev) => ({ ...prev, employee: callback(prev.employee || []) }))
                            }
                            searchable={true}
                            style={[
                                styles.dropdow,
                                employeeModalVisible && { borderColor: '#ccc' }
                            ]}
                            dropDownContainerStyle={[
                                styles.dropdonContainer,
                                employeeModalVisible && { borderColor: '#ccc' }
                            ]}
                            placeholder={t('form_chooseEmployee')}
                            listMode="SCROLLVIEW"
                            textStyle={{ fontSize: wp(4) }}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />

                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => setEmployeeModalVisible(false)}
                        style={{
                            alignItems: 'center',
                            borderRadius: wp(4),
                            backgroundColor: THEMECOLORS[themeMode].primaryApp,
                            paddingVertical: wp(1.8),
                            marginTop: wp(4),
                        }}
                    >
                        <Text style={[Louis_George_Cafe.bold.h2, { color: '#FFF' }]}>{t('close')}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>


            {/* Chips for selected employees */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginTop: 8, paddingHorizontal: 4 }}>
                {values.employee && values.employee.length > 0 &&
                    values.employee.map(empId => {
                        const emp = employeeList.find(item => item.value === empId);
                        if (!emp) return null;
                        return (
                            <View key={empId} style={styles.chip}>
                                <Text style={[Louis_George_Cafe.regular.h9, styles.chipText]}>{emp.label}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setValues(prev => ({
                                            ...prev,
                                            employee: prev.employee.filter(id => id !== empId)
                                        }));
                                    }}
                                >
                                    <Text style={[Louis_George_Cafe.bold.h2, styles.chipClose]}>×</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
            </ScrollView>

            {/* Admin */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('form_projectAdmin')}</Text>
            <DropDownPicker
                //    textStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
                placeholderStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                searchPlaceholder={t('search')}
                open={adminOpen}
                value={values.admin}
                items={employeeList}
                setOpen={setAdminOpen}
                setValue={(callback) =>
                    setValues((prev) => ({ ...prev, admin: callback(prev.admin) }))
                }
                setItems={() => { }}
                placeholder={t('form_chooseAdmin')}
                searchable={true}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={2000}
                zIndexInverse={5000}
                listMode="MODAL"
            />
            {errors.admin && <Text style={styles.errorText}>{errors.admin}</Text>}
            {/* Start & End Dates */}
            <View style={styles.dateRow}>
                <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                        color: THEMECOLORS[themeMode].textPrimary,
                    }]}>{t('form_startDate')}</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
                        <Text style={{ color: THEMECOLORS[themeMode].textPrimary, }}>{formatDate(values.startDate)}</Text>
                    </TouchableOpacity>
                    {showStartPicker && (
                        <DateTimePickerModal
                            placeholderStyle={{ color: THEMECOLORS[themeMode].textPrimary }}
                            placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                            isVisible={showStartPicker}
                            mode="date"
                            date={values.startDate}
                            onConfirm={(selectedDate) => {
                                setShowStartPicker(false);
                                if (selectedDate) {
                                    setValues((prev) => ({ ...prev, startDate: selectedDate }));
                                }
                            }}
                            onCancel={() => setShowStartPicker(false)}
                            // Custom styling
                            pickerStyleIOS={{
                                backgroundColor: '#000', // iOS only
                            }}
                        />
                    )}
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                        color: THEMECOLORS[themeMode].textPrimary,
                    }]}>{t('form_endDate')}</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
                        <Text
                            style={{ color: THEMECOLORS[themeMode].textPrimary, }}>{formatDate(values.endDate)}</Text>
                    </TouchableOpacity>
                    {showEndPicker && (
                        <DateTimePickerModal
                            isVisible={showEndPicker}
                            mode="date"
                            date={values.endDate}
                            onConfirm={(selectedDate) => {
                                setShowEndPicker(false);
                                if (selectedDate) {
                                    setValues((prev) => ({ ...prev, endDate: selectedDate }));
                                }
                            }}
                            onCancel={() => setShowEndPicker(false)}
                            pickerStyleIOS={{ backgroundColor: '#000' }}
                        />
                    )}
                </View>
            </View>

            {/* Status */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,

            }]}>{t('form_status')}</Text>
            <View style={styles.pickerWrapper}>
                <RNPickerSelect
                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                    onValueChange={(value) =>
                        setValues((prev) => ({ ...prev, status: value }))
                    }
                    items={statusOptions}   // Use statusOptions here
                    placeholder={{ label: t('form_status'), value: null }}
                    value={values.status}
                    style={{
                        // inputIOS: { fontSize: isTamil ? wp(3.5) : wp(4) },
                        inputAndroid: {
                            color: THEMECOLORS[themeMode].textPrimary
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                />
            </View>
            {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}

            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('description')}</Text>
            <TextInput
                maxLength={100}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                numberOfLines={4}
                multiline={true}
                style={[
                    {
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        padding: wp(1),
                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                        alignItems: "flex-start", justifyContent: 'flex-start',
                        color: THEMECOLORS[themeMode].textPrimary,
                    }
                ]}
                value={values.description}
                onChangeText={(text) => setValues((prev) => ({ ...prev, description: text }))}
                placeholder={t('form_enterdescription')}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            {/*  */}
            {/* File Upload Section */}
            <Text style={[Louis_George_Cafe.bold.h7, styles.label, {
                color: THEMECOLORS[themeMode].textPrimary,
            }]}>{t('form_requirementFile')}</Text>
            {values?.files?.length > 0 ? (
                <>
                    <FlatList
                        data={values.files}
                        renderItem={({ item, index }) => (
                            <>
                                <View style={{
                                    backgroundColor: "#e9e9e9",
                                    borderRadius: wp(1),
                                    padding: wp(2),
                                    //   marginBottom: wp(2),
                                    position: 'relative',
                                    width: wp(43),  // Square size for each item
                                    height: wp(25), margin: wp(1)
                                }}>
                                    <MaterialCommunityIcons
                                        onPress={() => setValues(prev => ({ ...prev, files: values.files.filter((_, i) => i !== index) }))}
                                        name="close-circle"
                                        size={hp(3)}
                                        color="#FF0000"
                                        style={{ position: 'absolute', top: wp(1), right: wp(1) }}
                                    />
                                    <Image
                                        source={require('../assets/animations/imagePic.png')}
                                        style={{ width: wp(14), height: wp(14), alignSelf: 'center' }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[Louis_George_Cafe.regular.h9, { textAlign: 'center', color: '#555', marginTop: wp(3), fontSize: wp(2) }]}>{item.name}</Text>
                                </View>
                            </>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}  // 2-column layout
                        contentContainerStyle={{ marginBottom: wp(3) }}
                    />
                    <TouchableOpacity
                        onPress={handleFilePick}
                        style={{
                            backgroundColor: "#e9e9e9",
                            borderRadius: wp(1),
                            padding: wp(2),
                            position: 'relative',
                            width: wp(43),  // Square size for each item
                            height: wp(25), margin: wp(1), alignItems: "center", justifyContent: 'center'
                        }}>
                        <Image
                            source={require('../assets/animations/addDoc.png')}
                            style={{ width: wp(14), height: wp(14), alignSelf: 'center' }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </>
            ) : <>
                <TouchableOpacity onPress={handleFilePick} style={styles.uploadBtn}>
                    <Text numberOfLines={1} style={{ color: THEMECOLORS[themeMode].textPrimary }}>{t('choose_file')}</Text>
                </TouchableOpacity>
            </>}
            {errors.requirementFile && <Text style={styles.errorText}>{errors.requirementFile}</Text>}
        </View>
    );
};

const createStyles = (theme) => ({
    label: {
        marginBottom: wp(2),
        marginTop: wp(3),
        marginHorizontal: wp(1)
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: THEMECOLORS[theme].inputBackground,
        color: THEMECOLORS[theme].textPrimary,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: THEMECOLORS[theme].inputBackground
    },
    dateRow: {
        flexDirection: 'row',
    },
    uploadBtn: {
        backgroundColor: THEMECOLORS[theme].inputBackground,
        paddingVertical: wp(2.8),
        paddingHorizontal: wp(2),
        borderRadius: wp(2),
        borderColor: "#ccc",
        borderWidth: wp(0.3),
        marginBottom: hp(2),
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginHorizontal: wp(2),
    },
    chip: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 16,
        paddingHorizontal: wp(2),
        marginRight: 8,
        alignItems: 'center', justifyContent: "center"
    },
    chipText: {
        marginRight: 6,
        color: '#333',
    },
    chipClose: {
        marginBottom: wp(1.5)
    },
    pickerWrapper: {
        height: hp(6),


        margin: wp(0.2),
        borderColor: '#ccc',
        paddingHorizontal: wp(1),
        borderRadius: wp(2),
        backgroundColor: THEMECOLORS[theme].inputBackground,
        justifyContent: 'center',
        marginVertical: wp(1),
        widthL: wp(50),
        borderWidth: wp(0.3),
        paddingHorizontal: wp(4)
    },
    dropdown: {
        backgroundColor: THEMECOLORS[theme].inputBackground,
        borderColor: '#ccc',
        borderRadius: 8,
        height: hp(6),
        paddingHorizontal: 10,
        zIndex: 1000,
    },
    dropdownContainer: {
        backgroundColor: THEMECOLORS[theme].inputBackground,
        borderColor: '#ccc',
        zIndex: 1000,
    },
});

export default ProjectFormFields;
