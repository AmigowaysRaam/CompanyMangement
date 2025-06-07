import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Louis_George_Cafe } from '../resources/fonts';
import { levaeFormSubmit } from '../redux/authActions';
import ThemeToggle from '../ScreenComponents/HeaderComponent/ThemeToggle';

const AddLeaveForm = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);

    const [leaveType, setLeaveType] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const leaveTypes = [
        { label: t('sick'), value: 'Sick' },
        { label: t('vacation'), value: 'Vacation' },
        { label: t('casual'), value: 'Casual' },
        { label: t('maternity'), value: 'Maternity' },
        { label: t('other'), value: 'Other' },
    ];

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

    const onSubmit = () => {
        if (!leaveType || !reason) {
            ToastAndroid.show(t('fillAllFields'), ToastAndroid.SHORT);
            return;
        }

        const formData = {
            leaveType,
            startDate: startDate,
            endDate: endDate,
            employeeId: userdata?.id,
            reason
        };

        setLoading(true);

        dispatch(
            levaeFormSubmit(formData, (response) => {
                setLoading(false);
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
                if (response.success) {
                    navigation.goBack();
                }
            })
        );
    };

    return (
        <View style={[styles.container, {
            backgroundColor: THEMECOLORS[themeMode].background
        }]}>
            <HeaderComponent showBackArray={true} title={t('addLeave')} />
            {/* <ThemeToggle /> */}

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, {
                    color: THEMECOLORS[themeMode].textPrimary

                }]}>{t('leaveType')}</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={setLeaveType}
                        items={leaveTypes}
                        style={pickerStyles}
                        placeholder={{ label: t('selectLeaveType'), value: null }}
                        value={leaveType}
                    />
                </View>

                <Text style={[Louis_George_Cafe.bold.h6, styles.label, {
                    color: THEMECOLORS[themeMode].textPrimary
                }]}>{t('startDate')}</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                    <Text>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartPicker(Platform.OS === 'ios');
                            if (selectedDate) setStartDate(selectedDate);
                        }}
                    />
                )}

                <Text style={[Louis_George_Cafe.bold.h6, styles.label, {
                    color: THEMECOLORS[themeMode].textPrimary

                }]}>{t('endDate')}</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                    <Text>{formatDate(endDate)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndPicker(Platform.OS === 'ios');
                            if (selectedDate) setEndDate(selectedDate);
                        }}
                    />
                )}

                <Text style={[Louis_George_Cafe.bold.h6, styles.label, {
                    color: THEMECOLORS[themeMode].textPrimary

                }]}>{t('reason')}</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={t('reasonPlaceholder')}
                    value={reason}
                    onChangeText={setReason}
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, {
                            color: THEMECOLORS[themeMode].buttonText
                        }]}>
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
    dateInput: {
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
    buttonText: {},
    pickerWrapper: {
        borderWidth: wp(0.3),
        borderColor: '#ccc',
        paddingHorizontal: wp(1),
        borderRadius: wp(2),
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: "center",

    },
});

const pickerStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
};

export default AddLeaveForm;
