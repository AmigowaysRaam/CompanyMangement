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
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch } from 'react-redux';
import { updateContactInfo } from '../redux/authActions';

const BankForm = ({ onNext, setCurrentStep, currentStep, dataObj, cId, companyDetails }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [ifscCode, setIfscCode] = useState(__DEV__ ? 'CNRB0005663':"");
    const [accountType, setAccountType] = useState(null);
    const [loading, setLoading] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        bankName: '',
        accountNo: '',
        ifscCode: '',
        accountType: ''
    });

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useEffect(() => {
        if (companyDetails && dataObj?.banktypes?.length > 0) {
            setBankName(companyDetails.bank_name || '');
            setAccountNo(companyDetails.account_number || '');
            setIfscCode(companyDetails.ifsc_code || '');
            const matchedAccountType = dataObj.banktypes.find(
                (item) =>
                    item.value.toLowerCase() ===
                    companyDetails.account_type?.toLowerCase()
            )?.value || null;
    
            setAccountType(matchedAccountType);
        }
    }, [companyDetails, dataObj?.banktypes]);

    const validateAccountNo = (accNo) => /^[0-9]{9,}$/.test(accNo);
    const validateIfscCode = (code) => /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(code);

    const onSubmit = () => {
        const newErrors = {
            bankName: bankName ? '' : t('error_fill_all_fields'),
            accountNo: validateAccountNo(accountNo) ? '' : t('error_invalid_account_number'),
            ifscCode: validateIfscCode(ifscCode) ? '' : t('error_invalid_ifsc_code'),
            accountType: accountType ? '' : t('error_fill_all_fields'),
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(err => err !== '');
        if (hasError) {
            ToastAndroid.show(t('error_check_fields'), ToastAndroid.SHORT);
            return;
        }

        const formData = {
            bank_name: bankName,
            account_number: accountNo,
            ifsc_code: ifscCode.toUpperCase(),
            account_type: accountType,
            _id: cId
        };

        setLoading(true);
        dispatch(
            updateContactInfo(formData, (response) => {
                setLoading(false);
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                if (response.success) onNext();
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, { color: THEMECOLORS[themeMode].textPrimary, alignSelf: "center", textTransform: "capitalize" }]}>
                {t('bank')}
            </Text>
            <ScrollView contentContainerStyle={styles.form}>

                {/* Bank Name */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('bank_name')}
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={t('placeholder_bank_name')}
                    value={bankName}
                    onChangeText={(text) => {
                        setBankName(text);
                        setErrors(prev => ({ ...prev, bankName: '' }));
                    }}
                />
                {errors.bankName ? <Text style={styles.errorText}>{errors.bankName}</Text> : null}

                {/* Account Number */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('account_number')}
                </Text>
                <TextInput
                maxLength={16}
                    style={styles.textInput}
                    placeholder={t('placeholder_account_number')}
                    value={accountNo}
                    onChangeText={(text) => {
                        setAccountNo(text);
                        setErrors(prev => ({ ...prev, accountNo: '' }));
                    }}
                    keyboardType="numeric"
                />
                {errors.accountNo ? <Text style={styles.errorText}>{errors.accountNo}</Text> : null}

                {/* IFSC Code */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('ifsc_code')}
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={t('placeholder_ifsc_code')}
                    value={ifscCode}
                    onChangeText={(text) => {
                        setIfscCode(text.toUpperCase());
                        setErrors(prev => ({ ...prev, ifscCode: '' }));
                    }}
                    autoCapitalize="characters"
                    maxLength={11}
                />
                {errors.ifscCode ? <Text style={styles.errorText}>{errors.ifscCode}</Text> : null}

                {/* Account Type */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('account_type')}
                </Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setAccountType(value);
                            setErrors(prev => ({ ...prev, accountType: '' }));
                        }}
                        items={dataObj?.banktypes}
                        value={accountType}
                        placeholder={{ label: t('placeholder_select_account_type'), value: null }}
                        style={pickerStyles}
                    />
                </View>
                {errors.accountType ? <Text style={styles.errorText}>{errors.accountType}</Text> : null}

                {/* Submit Button */}
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
        paddingHorizontal: wp(3.5)
    },
    label: {
        fontWeight: '600',
        marginBottom: wp(2),
        marginTop: wp(1),
        lineHeight: wp(6)
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(1),
        backgroundColor: '#fff',
    },
    pickerWrapper: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        paddingHorizontal: wp(1),
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: "center",
        marginBottom: wp(3),
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

const pickerStyles = {
    inputIOS: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: '#000',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#000',
    },
};

export default BankForm;
