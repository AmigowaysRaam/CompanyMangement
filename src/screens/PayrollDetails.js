import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView, 
    Platform,
    ToastAndroid,
} from 'react-native';
import { THEMECOLORS } from '../resources/colors/colors';
import { hp, wp } from '../resources/dimensions';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { generatePayroll } from '../redux/authActions';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { ActivityIndicator } from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';

const getPayrollHTML = (data) => `
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Arial&display=swap');

        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          position: relative;
          border: 2px solid #4CAF50;
          border-radius: 8px;
          margin: 0;
          height: 100%;
          overflow: visible;
        }

        /* Watermark style */
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 40px;
          color: rgba(0, 0, 0, 0.1);
          user-select: none;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        .logo {
          width: 500px;
          height: 100px;
          display: block;
          margin: 0 auto;
          z-index: 1;
          position: relative;
        }

        h1 {
          text-align: center;
          margin-top: 20px;
          position: relative;
          z-index: 1;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        strong {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="watermark">${data.employeeId}</div>
      <img src="https://www.amigoways.com/assets/images/logo/amigoways-technologies-logo.svg" class="logo" alt="Company Logo" />
      <h1>Payroll Summary</h1>
      <p><strong>Employee Name:</strong> ${data.employeeName}</p>
      <p><strong>Employee ID:</strong> ${data.employeeId}</p>
      <p><strong>Company ID:</strong> ${data.companyId}</p>
      <p><strong>Branch ID:</strong> ${data.branchId}</p>
      <p><strong>Salary:</strong> ₹${data.salary}</p>
      <p><strong>Worked Hours:</strong> ${data.workedHours}</p>
      <p><strong>Expected Monthly Hours:</strong> ${data.expectedMonthlyHours}</p>
      <p><strong>Earned Salary:</strong> ₹${data.earnedSalary}</p>
      <p><strong>Holidays:</strong> ${data.holidays}</p>
      <p><strong>Working Days:</strong> ${data.workingDaysInMonth}</p>
    </body>
  </html>
`;

const generatePDF = async (data, t) => {
    const htmlContent = getPayrollHTML(data);
    try {
        const filePath = `${RNFS.DownloadDirectoryPath}/Payroll_Report_${Date.now()}.pdf`;
        const options = {
            html: htmlContent,
            filePath: filePath,
        };

        const file = await RNHTMLtoPDF.convert(options);
        const exists = await RNFS.exists(file.filePath);

        if (exists) {
            ToastAndroid.show(t('pdf_saved_at') + ': ' + file.filePath, ToastAndroid.LONG);
            await FileViewer.open(file.filePath);
            await Share.open({
                url: `file://${file.filePath}`,
                type: 'application/pdf',
                title: t('share_payroll_report_pdf') || 'Share Payroll Report PDF',
            });
        } else {
            ToastAndroid.show(t('pdf_creation_failed') || 'PDF was not created properly', ToastAndroid.SHORT);
        }
    } catch (err) {
        console.error('PDF generation error:', err);
        ToastAndroid.show(t('pdf_generation_failed') || 'Failed to generate PDF', ToastAndroid.SHORT);
    }
};


const PayrollDetails = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [payrollData, setPayrollData] = useState(null);
    const [dateChanged, setDateChanged] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 30; y--) {
        years.push(y);
    }
    const months = [
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    const [fields, setFields] = useState({
        fullname: __DEV__ ? 'xccxxvc' : '',
        username: __DEV__ ? 'xcvcxv' : '',
        designation: __DEV__ ? 'xcvxcvxcv' : '',
        dob: '',
        email: __DEV__ ? 'divyaTest@gmail.com' : '',
        phone: __DEV__ ? '1234567896' : '',
        password: __DEV__ ? 'test' : '',
        month: '',
        year: '',
    });

    const [errors, setErrors] = useState({});

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    const validate = () => {
        const newErrors = {};
        if (!fields.month) newErrors.month = t('monthisrequired') || 'Month is required';
        if (!fields.year) newErrors.year = t('yearisrequired') || 'Year is required';
        return newErrors;
    };

    const handleChange = (key, value) => {
        setFields({ ...fields, [key]: value });
        setErrors({ ...errors, [key]: '' });
        setDateChanged(true);
        setPayrollData(null);
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        dispatch(
            generatePayroll(userdata?.id, fields, (response) => {
                setIsLoading(false);
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                if (response?.success) {
                    setPayrollData(response.data);
                } else {
                    setPayrollData(null);
                }
            })
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}>
            <HeaderComponent title={t('PayrollDetails')} showBackArray={true} />

            {isLoading ? (
                <ActivityIndicator style={{ marginTop: wp(20) }} color="#d9d9d9" />
            ) : (
                <>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('month_and_year')}
                                </Text>
                                <View style={styles.row}>
                                    <View style={[styles.pickerWrapper, { flex: 1, marginRight: wp(2), borderColor: errors.month ? 'red' : THEMECOLORS[themeMode].textPrimary }]}>
                                        <Picker
                                            selectedValue={fields.month}
                                            onValueChange={(itemValue) => handleChange('month', itemValue)}
                                            style={{ color: THEMECOLORS[themeMode].textPrimary }}
                                            dropdownIconColor={THEMECOLORS[themeMode].textPrimary}
                                        >
                                            <Picker.Item label={t('month') || 'Month'} value="" />
                                            {months.map((month) => (
                                                <Picker.Item key={month.value} label={month.label} value={month.value} />
                                            ))}
                                        </Picker>
                                    </View>

                                    <View style={[styles.pickerWrapper, { flex: 1, marginLeft: wp(2), borderColor: errors.year ? 'red' : THEMECOLORS[themeMode].textPrimary }]}>
                                        <Picker
                                            selectedValue={fields.year}
                                            onValueChange={(itemValue) => handleChange('year', itemValue)}
                                            style={{ color: THEMECOLORS[themeMode].textPrimary }}
                                            dropdownIconColor={THEMECOLORS[themeMode].textPrimary}
                                        >
                                            <Picker.Item label={t('year') || 'Year'} value="" />
                                            {years.map((year) => (
                                                <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                {(errors.month || errors.year) && (
                                    <View style={styles.errorRow}>
                                        {errors.month ? (
                                            <Text style={[Louis_George_Cafe.regular.h8, { color: 'red', flex: 1 }]}>
                                                {errors.month}
                                            </Text>
                                        ) : <View style={{ flex: 1 }} />}
                                        {errors.year ? (
                                            <Text style={[Louis_George_Cafe.regular.h8, { color: 'red', flex: 1, textAlign: 'right' }]}>
                                                {errors.year}
                                            </Text>
                                        ) : <View style={{ flex: 1 }} />}
                                    </View>
                                )}
                            </View>

                            {payrollData && (
                                <View style={{ height: hp(60), marginTop: hp(2), borderRadius: wp(2), overflow: 'hidden' }}>
                                    <WebView originWhitelist={['*']} source={{ html: getPayrollHTML(payrollData) }} style={{ flex: 1 }} />
                                </View>
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>

                    <View style={styles.fixedButtonWrapper}>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                { backgroundColor: THEMECOLORS[themeMode].primaryApp },
                            ]}
                            onPress={() => {
                                if (dateChanged && payrollData) {
                                    generatePDF(payrollData, t);
                                } else {
                                    handleSubmit();
                                }
                            }}
                        >
                            <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].white }]}>
                                {dateChanged && payrollData ? t('download_pdf') || 'Download PDF' : t('get_details')}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(3),
    },
    inputContainer: {
        width: '100%',
        marginTop: hp(1),
    },
    label: {
        fontSize: wp(4),
        fontWeight: '600',
        marginBottom: hp(1),
        marginHorizontal: wp(2),
        marginVertical: wp(2)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: wp(3),
        overflow: 'hidden',
        height: 50,
        justifyContent: 'center',
    },
    errorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(0.5),
        marginHorizontal: wp(4),
    },
    fixedButtonWrapper: {
        padding: wp(3),
    },
    submitButton: {
        padding: wp(2.5),
        borderRadius: wp(2),
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
    },
});

export default PayrollDetails;
