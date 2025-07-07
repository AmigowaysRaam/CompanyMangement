import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartMentList, getCompabyBranches, submitCreateForm, submitCreateSalaryStructureForm, updateCreateSalaryStructureForm } from '../redux/authActions';
import DropdownModal from '../components/DropDownModal';
import SearchSelectCompany from './SearchSelectCompany';

const CreateSalaryBasicForm = ({ onNext, onSubmitSuccess, onRefresh, salarayStructureDetail }) => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const [designationList, setDesignationList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedCalculationType, setSelectedCalculationType] = useState(null);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [showCalculationTypeModal, setShowCalculationTypeModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const calcutionType = [
        { value: 'flat', label: 'Flat' },
        { value: 'percent', label: 'Percentage' }
    ];
    useEffect(() => {
        if (salarayStructureDetail) {
            const designationObj = designationList.find(
                (item) => item.label === salarayStructureDetail.designation
            );
            if (designationObj) setSelectedDepartment(designationObj);
            else setSelectedDepartment({ label: salarayStructureDetail.designation, value: salarayStructureDetail.designation });

            if (salarayStructureDetail.company) {
                setSelectedCompany({
                    id: salarayStructureDetail.company._id,
                    name: salarayStructureDetail.company.company_name,
                });
            }
            if (salarayStructureDetail.branch) {
                setSelectedBranch({
                    value: salarayStructureDetail.branch._id,
                    label: salarayStructureDetail.branch.branch_name,
                });
            }
            if (salarayStructureDetail.calculationType) {
                setSelectedCalculationType({
                    value: salarayStructureDetail.calculationType,
                    label: salarayStructureDetail.calculationType === 'flat' ? 'Flat' : 'Percentage'
                });
            }
        }
    }, [salarayStructureDetail, designationList]);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useEffect(() => {
        dispatch(
            getDepartMentList(userdata?.id, (response) => {
                if (response.success) {
                    const formatted = response.data.map((item) => ({
                        value: item._id,
                        label: item.DepartmentName,
                    }));
                    setDesignationList(formatted);
                }
            })
        );
    }, []);

    useEffect(() => {
        if (selectedCompany?.id) {
            dispatch(
                getCompabyBranches({ companyId: selectedCompany.id }, (response) => {
                    if (response.success) {
                        setBranchList(response.data);
                    } else {
                        setBranchList([]);
                    }
                })
            );
        } else {
            setBranchList([]);
            setSelectedBranch(null);
        }
    }, [selectedCompany]);

    const validateFields = () => {
        const newErrors = {};
        if (!selectedDepartment) newErrors.designation = t('selectDepartment');
        if (!selectedCompany) newErrors.company = t('selectCompany');
        if (!selectedBranch) newErrors.branch = t('selectBranch');
        if (!selectedCalculationType) newErrors.calculationType = t('selectCalculationType');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {

        // alert(JSON.stringify(salarayStructureDetail?._id))
        if (!validateFields()) {
            ToastAndroid.show(t('fillAllFields'), ToastAndroid.SHORT);
            return;
        }
        if (salarayStructureDetail?._id) {
            const formData = {
                luserid: userdata?.id,
                designation: selectedDepartment?.value,
                company: selectedCompany?.id,
                branch: selectedBranch?.value,
                calculationType: selectedCalculationType?.value,
                id: salarayStructureDetail?._id
            };
            // alert(JSON.stringify(formData))
            setLoading(true);
            dispatch(
                updateCreateSalaryStructureForm(formData, (response) => {
                    setLoading(false);
                    // alert(JSON.stringify(response))
                    // console.log(response)
                    if (response.success) {
                        onRefresh?.();
                        const recordId = response?.data?._id;
                        onSubmitSuccess?.(recordId);
                        onNext?.();
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                    }
                })
            );
        }
        else {
            const formData = {
                luserid: userdata?.id,
                designation: selectedDepartment?.value,
                company: selectedCompany?.id,
                branch: selectedBranch?.value,
                calculationType: selectedCalculationType?.value,
            };
            // alert(JSON.stringify(formData))
            setLoading(true);
            dispatch(
                submitCreateSalaryStructureForm(formData, (response) => {
                    setLoading(false);
                    // alert(JSON.stringify(response))
                    // console.log(response)
                    if (response.success) {
                        onRefresh?.();
                        const recordId = response?.data?._id;
                        onSubmitSuccess?.(recordId);
                        onNext?.();
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                    }
                })
            );
        }


    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text
                style={[
                    Louis_George_Cafe.bold.h2,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        alignSelf: 'center',
                        fontSize: isTamil ? wp(4.5) : wp(6),
                        lineHeight: wp(6),
                    },
                ]}
            >
                {t('create_new')}
            </Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                {/* Department */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('department')}
                </Text>
                <TouchableOpacity
                    style={[styles.textInput, errors.designation && styles.errorInput]}
                    onPress={() => setShowDepartmentModal(true)}
                >
                    <Text>{selectedDepartment?.label || t('selectDepartment')}</Text>
                </TouchableOpacity>
                {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}

                {/* Company */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('company')}
                </Text>
                <TouchableOpacity
                    style={[styles.textInput, errors.company && styles.errorInput]}
                    onPress={() => setShowCompanyModal(true)}
                >
                    <Text>{selectedCompany?.name || t('selectCompany')}</Text>
                </TouchableOpacity>
                {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}

                {/* Branch */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('branch')}
                </Text>
                <TouchableOpacity
                    style={[styles.textInput, errors.branch && styles.errorInput]}
                    onPress={() => {
                        if (branchList.length > 0) {
                            setShowBranchModal(true);
                        } else {
                            ToastAndroid.show(t('noBranchesAvailable'), ToastAndroid.SHORT);
                        }
                    }}
                >
                    <Text>{selectedBranch?.label || t('selectBranch')}</Text>
                </TouchableOpacity>
                {errors.branch && <Text style={styles.errorText}>{errors.branch}</Text>}

                {/* Calculation Type */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('calculationType')}
                </Text>
                <TouchableOpacity
                    style={[styles.textInput, errors.calculationType && styles.errorInput]}
                    onPress={() => setShowCalculationTypeModal(true)}
                >
                    <Text>{selectedCalculationType?.label || t('selectCalculationType')}</Text>
                </TouchableOpacity>
                {errors.calculationType && <Text style={styles.errorText}>{errors.calculationType}</Text>}

                {/* Submit */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text
                            style={[
                                Louis_George_Cafe.bold.h4,
                                styles.buttonText,
                                {
                                    color: THEMECOLORS[themeMode].buttonText,
                                    fontSize: isTamil ? wp(4.2) : wp(5),
                                },
                            ]}
                        >
                            {t('submit')}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Modals */}
            <DropdownModal
                visible={showDepartmentModal}
                items={designationList}
                title={t('selectDepartment')}
                selectedValue={selectedDepartment?.value}
                onSelect={(item) => {
                    setSelectedDepartment(item);
                    setErrors((prev) => ({ ...prev, designation: null }));
                    setShowDepartmentModal(false);
                }}
                onCancel={() => setShowDepartmentModal(false)}
            />
            <Modal
                visible={showCompanyModal}
                animationType="slide"
                onRequestClose={() => setShowCompanyModal(false)}
            >
                <SearchSelectCompany
                    onClose={(selected) => {
                        if (selected) {
                            setSelectedCompany(selected);
                            setSelectedBranch(null);
                            setErrors((prev) => ({ ...prev, company: null }));
                        }
                        setShowCompanyModal(false);
                    }}
                    selectedEIds={selectedCompany ? [selectedCompany] : []}
                />
            </Modal>
            <DropdownModal
                visible={showBranchModal}
                items={branchList}
                title={t('selectBranch')}
                selectedValue={selectedBranch?.value}
                onSelect={(item) => {
                    setSelectedBranch(item);
                    setErrors((prev) => ({ ...prev, branch: null }));
                    setShowBranchModal(false);
                }}
                onCancel={() => setShowBranchModal(false)}
            />
            <DropdownModal
                visible={showCalculationTypeModal}
                items={calcutionType}
                title={t('selectCalculationType')}
                selectedValue={selectedCalculationType?.value}
                onSelect={(item) => {
                    setSelectedCalculationType(item);
                    setErrors((prev) => ({ ...prev, calculationType: null }));
                    setShowCalculationTypeModal(false);
                }}
                onCancel={() => setShowCalculationTypeModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: wp(3),
    },
    label: {
        marginBottom: 8,
        marginTop: wp(4),
        fontSize: wp(4),
    },
    textInput: {
        borderWidth: wp(0.4),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(2.5),
        backgroundColor: '#f9f9f9',
    },
    errorInput: {
        borderColor: 'red',
    },
    button: {
        marginTop: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: wp(3.2),
    },
});

export default CreateSalaryBasicForm;
