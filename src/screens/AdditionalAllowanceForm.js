import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useSelector, useDispatch } from 'react-redux';
import { submitCreateForm, updateCreateSalaryStructureForm } from '../redux/authActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // icon lib

const AdditionalAllowanceForm = ({ onNext, onSubmitSuccess, onRefresh, salarayStructureDetail }) => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    // Dynamic allowances list: array of { name: '', value: '' }
    const [allowances, setAllowances] = useState([{ name: '', value: '' }]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Prefill allowances from salarayStructureDetail.additions if available
    useEffect(() => {
        if (salarayStructureDetail?.additions) {
            const entries = Object.entries(salarayStructureDetail.additions).map(([key, val]) => ({
                name: key,
                value: val?.value?.toString() || '',
            }));
            if (entries.length) setAllowances(entries);
        }
    }, [salarayStructureDetail]);

    const validateFields = () => {
        const newErrors = allowances.map(({ name, value }) => {
            const err = {};
            if (!name.trim()) err.name = t('enterAllowanceName');
            if (value === '' || isNaN(value)) err.value = t('enterValidValue');
            return err;
        });

        setErrors(newErrors);
        // valid if no errors at all
        return newErrors.every((e) => Object.keys(e).length === 0);
    };

    const onSubmit = () => {
        if (!validateFields()) {
            ToastAndroid.show(t('fillAllFields'), ToastAndroid.SHORT);
            return;
        }

        // build additions object: { allowanceName: { value: Number } }
        const additions = {};
        allowances.forEach(({ name, value }) => {
            additions[name.trim()] = { value: parseFloat(value) };
        });

        const formData = {
            luserid: userdata?.id,
            additions,
            id:salarayStructureDetail?._id
        };
        setLoading(true);
        dispatch(
            updateCreateSalaryStructureForm(formData, (response) => {
                setLoading(false);
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
    };

    const updateAllowanceName = (index, text) => {
        const newAllowances = [...allowances];
        newAllowances[index].name = text;
        setAllowances(newAllowances);
        // Clear error for this name if any
        if (errors[index]?.name) {
            const newErrors = [...errors];
            newErrors[index].name = null;
            setErrors(newErrors);
        }
    };

    const updateAllowanceValue = (index, text) => {
        const newAllowances = [...allowances];
        newAllowances[index].value = text;
        setAllowances(newAllowances);
        // Clear error for this value if any
        if (errors[index]?.value) {
            const newErrors = [...errors];
            newErrors[index].value = null;
            setErrors(newErrors);
        }
    };

    const addAllowance = () => {
        setAllowances([...allowances, { name: '', value: '' }]);
        setErrors([...errors, {}]);
    };

    const removeAllowance = (index) => {
        if (allowances.length === 1) {
            ToastAndroid.show(t('atLeastOneAllowance'), ToastAndroid.SHORT);
            return;
        }
        const newAllowances = allowances.filter((_, i) => i !== index);
        setAllowances(newAllowances);

        const newErrors = errors.filter((_, i) => i !== index);
        setErrors(newErrors);
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
                {t('AdditionalAllowanceForm')}
            </Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                {allowances.map(({ name, value }, index) => (
                    <View key={index} style={styles.allowanceRow}>
                        <View style={{ flex: 1, marginRight: wp(2) }}>
                            <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                {t('allowanceName')}
                            </Text>
                            <TextInput
                                maxLength={15}
                                style={[styles.textInput, errors[index]?.name && styles.errorInput]}
                                placeholder={t('allowanceName')}
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={(text) => updateAllowanceName(index, text)}
                                autoCapitalize="words"
                            />
                            {errors[index]?.name && <Text style={styles.errorText}>{errors[index].name}</Text>}
                        </View>

                        <View style={{ flex: 1, marginRight: wp(2) }}>
                            <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                {t('value')}
                            </Text>
                            <TextInput
                                maxLength={6}
                                style={[styles.textInput, errors[index]?.value && styles.errorInput]}
                                placeholder={t('value')}
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={(text) => updateAllowanceValue(index, text)}
                            />
                            {errors[index]?.value && <Text style={styles.errorText}>{errors[index].value}</Text>}
                        </View>

                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeAllowance(index)}
                            accessibilityLabel={t('removeAllowance')}
                        >
                            <MaterialIcons name="close" size={28} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addAllowance} accessibilityLabel={t('addAllowance')}>
                    <MaterialIcons name="add-circle-outline" size={32} color={THEMECOLORS[themeMode].buttonBg} />
                    <Text style={[styles.addButtonText, { color: THEMECOLORS[themeMode].buttonBg }]}>
                        {t('add')}
                    </Text>
                </TouchableOpacity>

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
    allowanceRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: wp(2),
        borderColor: "#ccc",
        padding: wp(3),
        borderRadius: wp(1),
        borderWidth: wp(0.4), elevation: 4
    },
    label: {
        marginBottom: 6,
        fontSize: wp(4),
    },
    textInput: {
        borderWidth: wp(0.4),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(2.5),
        backgroundColor: '#f9f9f9',
        color: '#000',
    },
    errorInput: {
        borderColor: 'red',
    },
    removeButton: {
        // paddingTop: 25,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: wp(4),
    },
    addButtonText: {
        marginLeft: 8,
        fontSize: wp(4.5),
        fontWeight: 'bold',
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
export default AdditionalAllowanceForm;
