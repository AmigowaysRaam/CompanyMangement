import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch } from 'react-redux';
import { updateClientDetails } from '../redux/authActions';

const ClientBankDetails = ({ onNext, setCurrentStep, currentStep, dataObj, cId, clientDetails }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [bankName, setBankName] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [branchAddress, setBranchAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Prefill fields using clientDetails or dataObj
    useEffect(() => {
        const bankInfo = clientDetails?.bankDetails?.[0] || dataObj?.bankDetails?.[0];
        if (bankInfo) {
            setBankName(bankInfo.bankName || '');
            setAccountHolderName(bankInfo.accountName || '');
            setAccountNumber(bankInfo.accountNumber || '');
            setIfscCode(bankInfo.ifscCode || '');
            setSwiftCode(bankInfo.swiftCode || '');
            setBranchAddress(bankInfo.branchAddress || '');
        }
    }, [clientDetails, dataObj]);

    // --- Validation Functions ---
    const validateBankName = () => {
        if (!bankName) {
            setErrors(prev => ({ ...prev, bankName: t('error_fill_all_fields') }));
            return false;
        }
        setErrors(prev => ({ ...prev, bankName: '' }));
        return true;
    };

    const validateAccountHolderName = () => {
        if (!accountHolderName) {
            setErrors(prev => ({ ...prev, accountHolderName: t('error_fill_all_fields') }));
            return false;
        }
        setErrors(prev => ({ ...prev, accountHolderName: '' }));
        return true;
    };

    const validateAccountNumber = () => {
        const isValid = /^[0-9]{9,}$/.test(accountNumber);
        if (!isValid) {
            setErrors(prev => ({ ...prev, accountNumber: t('error_invalid_account_number') }));
            return false;
        }
        setErrors(prev => ({ ...prev, accountNumber: '' }));
        return true;
    };

    const validateIFSC = () => {
        const isValid = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifscCode);
        if (!isValid) {
            setErrors(prev => ({ ...prev, ifscCode: t('error_invalid_ifsc_code') }));
            return false;
        }
        setErrors(prev => ({ ...prev, ifscCode: '' }));
        return true;
    };

    const validateSwiftCode = () => {
        if (!swiftCode) {
            setErrors(prev => ({ ...prev, swiftCode: t('error_fill_all_fields') }));
            return false;
        }
        setErrors(prev => ({ ...prev, swiftCode: '' }));
        return true;
    };

    const validateBranchAddress = () => {
        if (!branchAddress) {
            setErrors(prev => ({ ...prev, branchAddress: t('error_fill_all_fields') }));
            return false;
        }
        setErrors(prev => ({ ...prev, branchAddress: '' }));
        return true;
    };

    const onSubmit = () => {
        const isValid =
            validateBankName() &
            validateAccountHolderName() &
            validateAccountNumber() &
            validateIFSC() &
            validateSwiftCode() &
            validateBranchAddress();

        if (!isValid) {
            ToastAndroid.show(t('error_check_fields'), ToastAndroid.SHORT);
            return;
        }

        const formData = {
            clientId: cId,
            bankDetails: [
                {
                    bankName: bankName,
                    accountName: accountHolderName,
                    accountNumber: accountNumber,
                    ifscCode: ifscCode.toUpperCase(),
                    swiftCode: swiftCode,
                    branchAddress: branchAddress,
                    isPrimary: false
                }
            ]
        };

        setLoading(true);
        dispatch(
            updateClientDetails(formData, (response) => {
                setLoading(false);
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                if (response.success) onNext();
            })
        );
        
    };

    const renderInput = (label, value, setValue, errorKey, onBlur, placeholder, keyboardType = 'default', maxLength = undefined, autoCapitalize = 'none') => (
        <>
            <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                {label}
            </Text>
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => {
                    setValue(text);
                    setErrors(prev => ({ ...prev, [errorKey]: '' }));
                }}
                onBlur={onBlur}
                keyboardType={keyboardType}
                maxLength={maxLength}
                autoCapitalize={autoCapitalize}
            />
            {errors[errorKey] ? <Text style={styles.errorText}>{errors[errorKey]}</Text> : null}
        </>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, { color: THEMECOLORS[themeMode].textPrimary, alignSelf: "center" }]}>
                {t('ClientBankDetails')}
            </Text>
            <ScrollView contentContainerStyle={styles.form}>
                {renderInput(t('bank_name'), bankName, setBankName, 'bankName', validateBankName, t('placeholder_bank_name'))}
                {renderInput(t('account_holder_name'), accountHolderName, setAccountHolderName, 'accountHolderName', validateAccountHolderName, t('placeholder_account_holder_name'))}
                {renderInput(t('account_number'), accountNumber, setAccountNumber, 'accountNumber', validateAccountNumber, t('placeholder_account_number'), 'numeric', 16)}
                {renderInput(t('ifsc_code'), ifscCode, setIfscCode, 'ifscCode', validateIFSC, t('placeholder_ifsc_code'), 'default', 11, 'characters')}
                {renderInput(t('swift_code'), swiftCode, setSwiftCode, 'swiftCode', validateSwiftCode, t('placeholder_swift_code'))}
                {renderInput(t('branch_address'), branchAddress, setBranchAddress, 'branchAddress', validateBranchAddress, t('placeholder_branch_address'))}

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(3.5),
    },
    form: {
        paddingBottom: wp(10),
    },
    label: {
        fontWeight: '600',
        marginBottom: wp(2),
        marginTop: wp(1),
        lineHeight: wp(6),
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(1),
        backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(6),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: {},
    errorText: {
        color: 'red',
        fontSize: wp(3.5),
        marginBottom: wp(2),
    },
});

export default ClientBankDetails;
