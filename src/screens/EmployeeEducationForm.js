import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity,
    ToastAndroid, ActivityIndicator, Platform
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
import { updateEmployeeById } from '../redux/authActions';

const EmployeeEducationForm = ({ onNext, onRefresh, empDetails }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [datePicker, setDatePicker] = useState({ show: false, index: null, field: '' });

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) navigation.goBack();
    });

    useEffect(() => {
        if (empDetails?.education?.length > 0) {
            setEducations(empDetails.education.map(edu => ({
                ...edu,
                startingDate: edu.startingDate ? new Date(edu.startingDate) : null,
                completeDate: edu.completeDate ? new Date(edu.completeDate) : null
            })));
        } else {
            setEducations([createEmptyEducation()]);
        }
    }, [empDetails]);

    const createEmptyEducation = () => ({
        institution: '',
        subject: '',
        startingDate: null,
        completeDate: null,
        degree: '',
    });

    const validateFields = () => {
        const newErrors = educations.map((edu) => {
            const err = {};
            if (!edu.institution.trim()) err.institution = t('enter_institution');
            if (!edu.subject.trim()) err.subject = t('enter_subject');
            if (!edu.startingDate) err.startingDate = t('enter_starting_date');
            if (!edu.completeDate) err.completeDate = t('enter_complete_date');
            if (!edu.degree.trim()) err.degree = t('enter_degree');
            return err;
        });
        setErrors(newErrors);
        return newErrors.every((err) => Object.keys(err).length === 0);
    };

    const onSubmit = () => {
        if (!validateFields()) return;

        const formData = {
            education: educations,
            employeeId: empDetails._id
        };

        setLoading(true);
        dispatch(updateEmployeeById(formData, (response) => {
            setLoading(false);
            if (response.success) {
                onRefresh();
                onNext();
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
            }
        }));
    };

    const updateEducation = (index, key, value) => {
        const updated = [...educations];
        updated[index][key] = value;
        setEducations(updated);
        const updatedErrors = [...errors];
        if (updatedErrors[index]) {
            updatedErrors[index][key] = '';
            setErrors(updatedErrors);
        }
    };

    const addEducation = () => {
        setEducations([...educations, createEmptyEducation()]);
        setErrors([...errors, {}]);
    };

    const removeEducation = (index) => {
        const updated = [...educations];
        updated.splice(index, 1);
        const updatedErrors = [...errors];
        updatedErrors.splice(index, 1);
        setEducations(updated);
        setErrors(updatedErrors);
    };

    const showDatePicker = (index, field) => {
        setDatePicker({ show: true, index, field });
    };

    const onDateChange = (event, selectedDate) => {
        if (event.type === "dismissed") {
            setDatePicker({ show: false, index: null, field: '' });
            return;
        }

        if (selectedDate) {
            updateEducation(datePicker.index, datePicker.field, selectedDate);
        }
        setDatePicker({ show: false, index: null, field: '' });
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, {
                color: THEMECOLORS[themeMode].textPrimary,
                alignSelf: "center",
                textTransform: "capitalize",
                lineHeight: wp(8)
            }]}>
                {t('Education Details')}
            </Text>

            <ScrollView contentContainerStyle={styles.form}>
                {educations.map((edu, index) => (
                    <View key={index} style={styles.card}>
                        {['institution', 'subject', 'degree'].map((key) => (
                            <View key={key}>
                                <Text style={[styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>{t(key)}</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={t(key)}
                                    value={edu[key]}
                                    onChangeText={(text) => updateEducation(index, key, text)}
                                />
                                {errors[index]?.[key] && (
                                    <Text style={styles.errorText}>{errors[index][key]}</Text>
                                )}
                            </View>
                        ))}

                        {/* Date fields side by side */}
                        <View style={styles.row}>
                            {['startingDate', 'completeDate'].map((key) => (
                                <View style={styles.dateContainer} key={key}>
                                    <Text style={[styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>{t(key)}</Text>
                                    <TouchableOpacity
                                        onPress={() => showDatePicker(index, key)}
                                        style={styles.datePicker}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(edu[key]) || t('select_date')}
                                        </Text>
                                    </TouchableOpacity>
                                    {errors[index]?.[key] && (
                                        <Text style={styles.errorText}>{errors[index][key]}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.removeBtn} onPress={() => removeEducation(index)}>
                            <Text style={styles.removeBtnText}>{t('Remove')}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.addBtn} onPress={addEducation}>
                    <Text style={styles.addBtnText}>{t('add_new')}</Text>
                </TouchableOpacity>

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

                {datePicker.show && (
                    <DateTimePicker
                        mode="date"
                        display="default"
                        value={educations[datePicker.index]?.[datePicker.field] || new Date()}
                        onChange={onDateChange}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { paddingHorizontal: wp(4), paddingBottom: wp(5) },
    label: { fontWeight: '600', marginBottom: 8, marginTop: 15 },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(2)
    },
    dateContainer: { flex: 1 },
    datePicker: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    dateText: { color: '#000' },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: wp(3),
        borderRadius: wp(2),
        marginBottom: wp(4),
        // backgroundColor: '#f9f9f9',
    },
    button: {
        marginTop: wp(6),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: { textAlign: 'center' },
    errorText: {
        color: 'red',
        fontSize: wp(3.5),
        marginTop: wp(1),
    },
    addBtn: {
        marginTop: wp(4),
        backgroundColor: '#4CAF50',
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    addBtnText: { color: '#fff', fontWeight: 'bold' },
    removeBtn: {
        marginTop: wp(3),
        backgroundColor: '#d9534f',
        padding: wp(2),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    removeBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default EmployeeEducationForm;
