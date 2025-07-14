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
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch } from 'react-redux';
import { createNewEmp, updateEmployeeById } from '../redux/authActions';
import DropdownModal from '../components/DropDownModal';

// const roleData = [
//     { label: "EMPLOYEE", value: "6863bc4d98e4553de274a82f" },
//     { label: "HR", value: "6865145cfac9c4b87e453936" }
// ];

const EmployeeBasicDetails = ({ onNext, onSubmitSuccess, empDetails, dataObj }) => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(__DEV__ ? '6863bc4d98e4553de274a82f' : '');
    const [password, setPassword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const validateFields = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = t('fullNameRequired');
        if (!username.trim()) newErrors.username = t('usernameRequired');
        if (!phone.trim() || !/^\d{7,}$/.test(phone)) newErrors.phone = t('validPhoneRequired');
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t('validEmailRequired');
        if (!role) newErrors.role = t('roleRequired');
        if (!password.trim()) newErrors.password = t('passwordRequired');
        if (!startDate.trim()) newErrors.startDate = t('startDateRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const Label = ({ title }) => (
        <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
            {t(title)}
        </Text>
    );

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const isoString = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            setStartDate(isoString);
        }
    };

    const onSubmit = () => {
        if (!validateFields()) return;

        const formData = {
            full_name: fullName,
            username,
            phone,
            email,
            role,
            password,
            start_date: startDate,
        };
        setLoading(true);
        if (empDetails && empDetails._id) {
            // Update
            dispatch(
                updateEmployeeById({ ...formData, employeeId: empDetails._id }, (response) => {
                    setLoading(false);
                    if (response.success) {
                        onSubmitSuccess(empDetails._id);
                        ToastAndroid.show(response.message || 'Updated Successfully', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(response.message || 'Update failed', ToastAndroid.SHORT);
                    }
                })
            );
        } else {
            // Create
            dispatch(
                createNewEmp(formData, (response) => {
                    setLoading(false);
                    if (response.success) {
                        const newClientId = response?.data?._id;
                        onSubmitSuccess(newClientId);
                        onNext();
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    }
                })
            );
        }
    };

    useEffect(() => {
        if (empDetails && empDetails._id) {
            setEmployeeId(empDetails._id); // save it for update
            setFullName(empDetails.full_name || '');
            setUsername(empDetails.username || '');
            setPhone(empDetails.phone || '');
            setEmail(empDetails.email || '');

            // If empDetails.role is an object, get the _id, else use as is
            const roleId = typeof empDetails.role === 'object' && empDetails.role !== null
                ? empDetails.role._id
                : empDetails.role;

            setRole(roleId || '');

            setPassword(''); // Keep it blank or provide a "change password" option
            setStartDate(empDetails.start_date?.split('T')[0] || '');
        }
    }, [empDetails]);


    // Find selected role label for display
    const selectedRoleLabel = dataObj?.roles.find(r => r?.value === role)?.label || '';

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, { color: THEMECOLORS[themeMode].textPrimary, alignSelf: 'center', fontSize: wp(6) }]}>
                {t('employeeBasicDetailsTitle')}
            </Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <Label title="employeeName" />
                <Input maxLength={25} value={fullName} onChange={setFullName} error={errors.fullName} placeholder={t('enterFullName')} />

                <Label title="username" />
                <Input maxLength={25} value={username} onChange={setUsername} error={errors.username} placeholder={t('enterUsername')} />

                <Label title="phone" />
                <Input maxLength={10} value={phone} onChange={setPhone} error={errors.phone} placeholder={t('enterPhone')} keyboardType="phone-pad" />

                <Label title="email" />
                <Input value={email} onChange={setEmail} error={errors.email} placeholder={t('enterEmail')} keyboardType="email-address" />

                <Label title="role" />
                {/* TouchableOpacity to open DropdownModal */}
                <TouchableOpacity onPress={() => setShowRoleDropdown(true)} activeOpacity={0.9}>
                    <View pointerEvents="none">
                        <Input
                            value={selectedRoleLabel}
                            onChange={() => { }}
                            error={errors.role}
                            placeholder={t('selectRole')}
                        />
                    </View>
                </TouchableOpacity>

                {!employeeId &&
                    <>
                        <Label title="password" />
                        <Input maxLength={16} value={password} onChange={setPassword} error={errors.password} placeholder={t('enterPassword')} secureTextEntry />
                    </>
                }


                <Label title="startDate" />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View pointerEvents="none">
                        <Input value={startDate} onChange={() => { }} error={errors.startDate} placeholder={t('enterStartDate')} />
                    </View>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={startDate ? new Date(startDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                            {t('submit')}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <DropdownModal
                visible={showRoleDropdown}
                items={dataObj?.roles}
                selectedValue={role}
                onSelect={(item) => {
                    setRole(item.value);
                    setShowRoleDropdown(false);
                }}
                onCancel={() => setShowRoleDropdown(false)}
                title={t('selectRole')}
            />
        </View>
    );
};

const Input = ({ value, onChange, error, placeholder, maxLength, keyboardType = 'default', secureTextEntry = false, editable = true }) => (
    <>
        <TextInput
            maxLength={maxLength}
            style={[styles.textInput, !editable && { backgroundColor: '#eee' }]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            editable={editable}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: wp(2),
    },
    label: {
        marginBottom: wp(2),
        marginTop: wp(4),
        fontSize: wp(4),
    },
    textInput: {
        borderWidth: wp(0.4),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(2.5),
        backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: wp(5),
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: wp(3.2),
        marginHorizontal: wp(2),
    },
});

export default EmployeeBasicDetails;
