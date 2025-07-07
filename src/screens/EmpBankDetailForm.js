import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import { wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch } from 'react-redux';
import { updateEmployeeById } from '../redux/authActions';

const EmployeeBankDetailForm = ({ onNext, onRefresh, empDetails }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [panNo, setPanNo] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useEffect(() => {
        console.log(empDetails);
        if (empDetails) {
            setBankName(empDetails.bankname || '');           // bankname
            setAccountNumber(empDetails.bankaccountno || ''); // bankaccountno
            setIfscCode(empDetails.ifsccode || '');           // ifsccode
            setPanNo(empDetails.panno || '');                  // panno
        }
    }, [empDetails]);

    const validateFields = () => {
        const newErrors = {};
        if (!bankName.trim()) newErrors.bankName = t('enterBankName');
        if (!accountNumber.trim()) newErrors.accountNumber = t('enterAccountNumber');
        if (!ifscCode.trim()) newErrors.ifscCode = t('enterIFSCCode');
        if (!panNo.trim()) newErrors.panNo = t('enterPANNo');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {
        if (!validateFields()) return;

        const formData = {
            bankname: bankName.trim(),
            bankaccountno: accountNumber.trim(),
            ifsccode: ifscCode.trim(),
            panno: panNo.trim(),
            employeeId: empDetails._id,
        };

        setLoading(true);
        dispatch(
            updateEmployeeById(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    // onRefresh?.();
                    // onNext?.();
                    navigation?.goBack();
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                }
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, {
                color: THEMECOLORS[themeMode].textPrimary,
                alignSelf: "center",
                textTransform: "capitalize",
                lineHeight: wp(8)
            }]}>
                {t('BankDetailForm')}
            </Text>

            <ScrollView contentContainerStyle={styles.form}>
                {[
                    { label: t('Bank Name'), value: bankName, setter: setBankName, key: 'bankName', maxLength: 30 },
                    { label: t('Account Number'), value: accountNumber, setter: setAccountNumber, key: 'accountNumber', keyboardType: 'numeric', maxLength: 20 },
                    { label: t('IFSC Code'), value: ifscCode, setter: setIfscCode, key: 'ifscCode', autoCapitalize: 'characters', maxLength: 11 },
                    { label: t('PAN No'), value: panNo, setter: setPanNo, key: 'panNo', autoCapitalize: 'characters', maxLength: 10 }
                ].map(({ label, value, setter, key, keyboardType, autoCapitalize, maxLength }) => (
                    <View key={key}>
                        <Text style={[styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>{label}</Text>
                        <TextInput
                            maxLength={maxLength}
                            style={styles.textInput}
                            placeholder={label}
                            value={value}
                            onChangeText={(text) => {
                                setter(text);
                                setErrors(prev => ({ ...prev, [key]: '' }));
                            }}
                            keyboardType={keyboardType || 'default'}
                            autoCapitalize={autoCapitalize || 'none'}
                        />
                        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
                    </View>
                ))}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} size={wp(7)} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                            {t('submit')}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        paddingHorizontal: wp(4),
        paddingBottom: wp(5),
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
        lineHeight: wp(6),
        marginHorizontal: wp(1),
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(0.2),
        backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(6),
        padding: wp(2),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: wp(3.5),
        marginTop: wp(1),
    },
    buttonText: {
        textAlign: 'center',
    },
});

export default EmployeeBankDetailForm;
