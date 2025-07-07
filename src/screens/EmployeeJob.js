import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Louis_George_Cafe } from '../resources/fonts';
import { updateEmployeeById, getCompabyBranches } from '../redux/authActions';
import SearchSelectCompany from './SearchSelectCompany';
import DropdownModal from '../components/DropDownModal';

const designationOptions = [
    { label: 'Full Stack Trainee', value: '685ce0ed6391dc5ee7c1b84f' },
    { label: 'Team Lead', value: '685e4929084ac28489c411a1' },
    { label: 'Junior Hr', value: '686514a9fac9c4b87e45396b' },
];

const shiftOptions = [
    { label: 'Full Day', value: '685ce1106391dc5ee7c1b858' },
    { label: 'Day', value: '685e4973084ac28489c411aa' },
];

const EmployeeJob = ({ onNext, onRefresh, empDetails, dataObj }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [company, setCompany] = useState(null);
    const [branchList, setBranchList] = useState([]);
    const [branch, setBranch] = useState(null);
    const [designation, setDesignation] = useState('');
    const [shift, setShift] = useState('');
    const [salary, setSalary] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [showShiftModal, setShowShiftModal] = useState(false);

    useAndroidBackHandler(() => navigation.canGoBack() && navigation.goBack());


    useEffect(() => {
        if (empDetails) {
            const { company, branch, designation, shifts, salary } = empDetails;
            // alert(JSON.stringify(shifts))
            setCompany(company || null);
            setBranch(branch || null);
            setDesignation(designation || '');
            setShift(shifts || '');
            setSalary(salary ? String(salary) : '');

            if (company?.id) {
                setLoading(true);
                dispatch(
                    getCompabyBranches({ companyId: company.id }, (res) => {
                        setLoading(false);
                        if (res.success) {
                            setBranchList(res.data || []);
                        } else {
                            setBranchList([]);
                            ToastAndroid.show(t('failedToLoadBranches'), ToastAndroid.SHORT);
                        }
                    })
                );
            }
        }
    }, [empDetails]);


    useEffect(() => {
        if (company?.id) {
            setLoading(true);
            dispatch(
                getCompabyBranches({ companyId: company.id }, (res) => {
                    setLoading(false);
                    if (res.success) setBranchList(res.data);
                    else {
                        setBranchList([]);
                        ToastAndroid.show(t('failedToLoadBranches'), ToastAndroid.SHORT);
                    }
                })
            );
        }
    }, [company]);

    const validate = () => {
        const e = {};
        if (!company) e.company = t('pleaseSelectCompany');
        if (!branch) e.branch = t('pleaseSelectBranch');
        if (!designation) e.designation = t('pleaseSelectDesignation');
        if (!shift) e.shift = t('pleaseSelectShift');
        if (!salary.trim() || isNaN(+salary)) e.salary = t('enterValidSalary');
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const onSubmit = () => {
        if (!validate()) return;
        const data = {
            employeeId: empDetails._id,
            companyId: company.id,
            branchId: branch.id,
            designation,
            shifts: shift,
            salary:salary,
        };
        setLoading(true);
        dispatch(
            updateEmployeeById(data, (res) => {
                setLoading(false);
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                if (res.success) {
                    onRefresh?.();
                    onNext?.();
                }
            })
        );
    };

    const Label = ({ text, error }) => (
        <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: '600', color: THEMECOLORS[themeMode].textPrimary }}>{text}</Text>
            {!!error && <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>}
        </View>
    );

    const dropdownStyle = [styles.dropdown, errors.company && styles.errorBorder];

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, styles.title, { color: THEMECOLORS[themeMode].textPrimary }]}>
                {t('EmployeeJob')}
            </Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <Label text={t('company')} error={errors.company} />
                <TouchableOpacity style={dropdownStyle} onPress={() => setShowCompanyModal(true)}>
                    <Text>{company?.name || company?.company_name|| t('selectCompany')}</Text>
                </TouchableOpacity>

                <Label text={t('branch')} error={errors.branch} />
                <TouchableOpacity style={[styles.dropdown, errors.branch && styles.errorBorder]} onPress={() =>
                    branchList.length ? setShowBranchModal(true) : ToastAndroid.show(t('noBranchesAvailable'), ToastAndroid.SHORT)
                }>
                    <Text>{branch?.label || branch?.branch_name ||t('selectBranch')}</Text>
                </TouchableOpacity>

                <Label text={t('designation')} error={errors.designation} />
                <TouchableOpacity style={[styles.dropdown, errors.designation && styles.errorBorder]} onPress={() => setShowDesignationModal(true)}>
                    <Text>
                        {dataObj?.designation.find(o => o.value === designation)?.label || t('selectDesignation')}
                    </Text>
                </TouchableOpacity>

                <Label text={t('assignedShifts')} error={errors.shift} />
                <TouchableOpacity style={[styles.dropdown, errors.shift && styles.errorBorder]} onPress={() => setShowShiftModal(true)}>
                    <Text>
                        {dataObj?.shifts.find(o => o.value === shift)?.label || t('selectShift')}
                        {/* {shift} */}
                    </Text>
                </TouchableOpacity>

                <Label text={t('salary')} error={errors.salary} />
                <TextInput
                    style={[styles.textInput, errors.salary && styles.errorBorder]}
                    keyboardType="numeric"
                    value={salary}
                    onChangeText={(v) => {
                        setSalary(v);
                        setErrors(prev => ({ ...prev, salary: null }));
                    }}
                />

                <TouchableOpacity onPress={onSubmit} style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}>
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                            {t('submit')}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showCompanyModal} animationType="slide">
                <SearchSelectCompany
                    selectedEIds={company ? [company] : []}
                    onClose={(sel) => { setCompany(sel); setBranch(null); setShowCompanyModal(false); setErrors(prev => ({ ...prev, company: null })); }}
                />
            </Modal>

            <DropdownModal
                visible={showBranchModal}
                items={branchList}
                title={t('selectBranch')}
                selectedValue={branch?.id}
                onSelect={(i) => { setBranch(i); setShowBranchModal(false); setErrors(prev => ({ ...prev, branch: null })); }}
                onCancel={() => setShowBranchModal(false)}
            />

            <DropdownModal
                visible={showDesignationModal}
                items={dataObj?.designation}
                title={t('selectDesignation')}
                selectedValue={designation}
                onSelect={(i) => { setDesignation(i.value); setShowDesignationModal(false); setErrors(prev => ({ ...prev, designation: null })); }}
                onCancel={() => setShowDesignationModal(false)}
            />

            <DropdownModal
                visible={showShiftModal}
                items={dataObj?.shifts}
                title={t('selectShift')}
                selectedValue={shift}
                onSelect={(i) => { setShift(i.value); setShowShiftModal(false); setErrors(prev => ({ ...prev, shift: null })); }}
                onCancel={() => setShowShiftModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { padding: wp(1), paddingHorizontal: wp(3) },
    title: {
        alignSelf: "center"
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 6,
        backgroundColor: '#fff',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 6,
        backgroundColor: '#fff',
    },
    errorBorder: { borderColor: 'red' },
    button: {
        marginTop: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: { textAlign: 'center' },
});

export default EmployeeJob;
