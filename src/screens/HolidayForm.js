import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Louis_George_Cafe } from '../resources/fonts';
import { createHolidayApi, getCompabyBranches, levaeFormSubmit, updateHolidayForm } from '../redux/authActions';
import SearchSelectCompany from './SearchSelectCompany'; // adjust path as needed
import DropdownModal from '../components/DropDownModal';
import MultiSelectModal from '../components/MultiSelectModal';

const HolidayForm = ({ data }) => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);

    const route = useRoute();
    const itemList = route.params?.data;

    // Form States
    const [holidayName, setHolidayName] = useState('');
    const [holidayDate, setHolidayDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [description, setDescription] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null); // store { id, name }
    const [branch, setBranch] = useState(''); // branch value
    const [branchList, setBranchList] = useState([]); // array of branches
    const [selectedBranches, setSelectedBranches] = useState([]); // array of {id, name} or {label, value}

    const [loading, setLoading] = useState(false);
    // Validation error messages
    const [errors, setErrors] = useState({});
    // Modal controls
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showBranchModal, setShowBranchModal] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const validateFields = () => {
        const newErrors = {};
        if (!holidayName.trim()) newErrors.holidayName = t('pleaseEnterHolidayName');
        if (!description.trim()) newErrors.description = t('pleaseEnterDescription');
        if (!selectedCompany) newErrors.company = t('pleaseSelectCompany');
        // if (!selectedBranches) newErrors.branch = t('pleaseSelectBranch');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const onSubmit = () => {
        if (!validateFields()) return;

        const baseFormData = {
            holidayName: holidayName.trim(),
            date: holidayDate,
            description: description.trim(),
            companyId: selectedCompany.id,
            branchId: selectedBranches?.[0]?.value || selectedBranches?.value,
            createdBy: userdata?.id,
        };
    //    alert(JSON.stringify(baseFormData?.branchId))
        setLoading(true);
        if (itemList?._id) {
            const updateData = {
                ...baseFormData,
                id: itemList._id, // add ID for update
            };

            dispatch(
                updateHolidayForm(updateData, (response) => {
                    setLoading(false);
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    if (response.success) {
                        navigation.goBack();
                    }
                })
            );
        } else {
            dispatch(
                createHolidayApi(baseFormData, (response) => {
                    setLoading(false);
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    if (response.success) {
                        navigation.goBack();
                    }
                })
            );
        }
    };



    useEffect(() => {
        if (itemList) {
            console.log('ItemList:', itemList);
            setHolidayName(itemList.holidayName || '');
            setDescription(itemList.description || '');
            setHolidayDate(itemList.date ? new Date(itemList.date) : new Date());
    
            // Set selected company
            if (itemList.company?.company_id) {
                setSelectedCompany({
                    id: itemList.company.company_id,
                    name: itemList.company.company_name,
                });
            }
            // Set selected branch
            if (itemList.branch?.branchId) {
                setSelectedBranches([
                    {
                        value: itemList.branch.branchId,
                        label: itemList.branch.branch_name,
                    },
                ]);
            }
            // alert(itemList.branch.branchId)
        }
    }, [itemList]);
    


    useEffect(() => {
        if (selectedCompany?.id) {
            setLoading(true);
            dispatch(
                getCompabyBranches({ companyId: selectedCompany.id }, (response) => {
                    setLoading(false);
                    // ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    if (response.success) {
                        setBranchList(response.data); // assuming response.data is array of {id, name}
                    } else {
                        setBranchList([]);
                    }
                })
            );
        } else {
            setBranchList([]);
            setSelectedBranches([]);
        }
    }, [selectedCompany]);

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={itemList?._id ? t('update_holiday') : t('create_holiday')} />
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                {/* Holiday Name */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('holidayName')}
                </Text>
                <TextInput
                    style={[styles.textInput, errors.holidayName && styles.errorInput]}
                    placeholder={t('holidayNamePlaceholder')}
                    value={holidayName}
                    onChangeText={(text) => {
                        setHolidayName(text);
                        if (errors.holidayName) setErrors(prev => ({ ...prev, holidayName: null }));
                    }}
                />
                {!!errors.holidayName && <Text style={styles.errorText}>{errors.holidayName}</Text>}

                {/* Date */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('date')}
                </Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateInput}
                >
                    <Text>{formatDate(holidayDate)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={holidayDate}
                        mode="date"
                        display="default"
                        minimumDate={new Date()} // disables all past dates
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(Platform.OS === 'ios');
                            if (selectedDate) setHolidayDate(selectedDate);
                        }}
                    />

                )}

                {/* Description */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('description')}
                </Text>
                <TextInput
                    style={[styles.textArea, errors.description && styles.errorInput]}
                    placeholder={t('descriptionPlaceholder')}
                    value={description}
                    onChangeText={(text) => {
                        setDescription(text);
                        if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                    }}
                    multiline
                    numberOfLines={4}
                />
                {!!errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                {/* Company Dropdown */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('company')}
                </Text>
                <TouchableOpacity
                    onPress={() => setShowCompanyModal(true)}
                    style={[styles.dropdownInput, errors.company && styles.errorInput]}
                >
                    <Text style={{ color: selectedCompany ? '#000' : '#999' }}>
                        {selectedCompany ? selectedCompany.name : t('selectCompany')}
                    </Text>
                </TouchableOpacity>
                {!!errors.company && <Text style={styles.errorText}>{errors.company}</Text>}
                {/* {branchList?.length > 0 &&
                    <>
                        <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {t('branch')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (branchList.length > 0) {
                                    setShowBranchModal(true);
                                } else {
                                    ToastAndroid.show(t('noBranchesAvailable'), ToastAndroid.SHORT);
                                }
                            }}
                            style={[styles.dropdownInput, errors.branch && styles.errorInput]}
                        >
                            <Text style={{ color: selectedBranches.length ? '#000' : '#999' }}>
                                {selectedBranches.length
                                    ? selectedBranches.map(b => b.name || b.label).join(', ')
                                    : t('selectBranch')}
                            </Text>
                        </TouchableOpacity>
                        {!!errors.branch && <Text style={styles.errorText}>{errors.branch}</Text>}
                    </>
                } */}
                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText, textTransform: "capitalize" }]}>
                            {itemList?._id ? t('update') : t('submit')}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            {/* Modal for Company Selection */}
            <Modal visible={showCompanyModal} animationType="slide" onRequestClose={() => setShowCompanyModal(false)}>
                <SearchSelectCompany
                    onClose={(selected) => {
                        if (selected) {
                            setSelectedCompany(selected);
                            setBranch(''); // reset branch when company changes
                        }
                        setShowCompanyModal(false);
                        if (errors.company) setErrors(prev => ({ ...prev, company: null }));
                    }}
                    selectedEIds={selectedCompany ? selectedCompany : []}
                />
            </Modal>
            <MultiSelectModal
                visible={showBranchModal}
                items={branchList}
                selectedValues={selectedBranches}
                title={t('selectBranch')}
                onSelect={(items) => {
                    setSelectedBranches(items);
                    if (errors.branch) setErrors(prev => ({ ...prev, branch: null }));
                    setShowBranchModal(false);
                }}
                onCancel={() => setShowBranchModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: wp(5),
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    dropdownInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    errorInput: {
        borderColor: 'red',
    },
});

export default HolidayForm;
