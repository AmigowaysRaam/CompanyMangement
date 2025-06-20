import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../context/ThemeContext';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTranslation } from 'react-i18next';
import { getProjectDetailById, updateProjectCost } from '../redux/authActions';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const ProjectCostForm = ({ projectId }) => {
    const { themeMode } = useTheme();
    const theme = THEMECOLORS[themeMode];
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isTamil = i18n.language === 'ta';
    const fontSize = isTamil ? 12 : 14;
    const labelFontSize = isTamil ? 14 : 16;

    const [milestone, setMilestone] = useState(null);
    const [tax, setTax] = useState('');
    const [additionalFields, setAdditionalFields] = useState([]);
    const [projectCost, setProjectCost] = useState('');
    const [costType, setCostType] = useState(null);
    const [notes, setNotes] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const userdata = useSelector((state) => state.auth.user?.data?.id);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(null)

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            dispatch(getProjectDetailById(projectId, (res) => {
                if (res.success && res.data) {
                    const data = res.data;
                    setValues(data); // optional, you may not need this if destructuring all
                    // alert(data.taxcalculation)
                    // Set form fields
                    setMilestone(String(data.milestone || ''));
                    setTax(data.taxcalculation || '');
                    setProjectCost(data.projectcost || '');
                    setCostType(data.costType || '');
                    setNotes(data.notes || '');

                    if (Array.isArray(data.additionalAmount)) {
                        const formatted = data.additionalAmount.map((item) => ({
                            id: generateId(),
                            label: item.label || '',
                            value: item.input || ''
                        }));
                        setAdditionalFields(formatted);
                    }

                    // Optional: calculate total right away
                    const cost = parseFloat(data.projectcost || 0);
                    const taxVal = parseFloat(data.tax || 0);
                    const additionalSum = data.additionalAmount?.reduce((sum, item) => {
                        const val = parseFloat(item.input);
                        return sum + (isNaN(val) ? 0 : val);
                    }, 0) || 0;
                    setTotalCost(cost + taxVal + additionalSum);
                }
                setLoading(false);
            }));
        }
    }, [projectId]);


    const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const addField = () => {
        setAdditionalFields([...additionalFields, { id: generateId(), label: '', value: '' }]);
    };

    const removeField = (id) => {
        setAdditionalFields(additionalFields.filter(field => field.id !== id));
    };

    const updateField = (id, key, val) => {
        setAdditionalFields(fields =>
            fields.map(field =>
                field.id === id ? { ...field, [key]: val } : field
            )
        );
    };

    // Calculate total cost whenever projectCost, tax or additional fields change
    useEffect(() => {
        const cost = parseFloat(projectCost) || 0;
        const taxAmount = parseFloat(tax) || 0;
        const additionalSum = additionalFields.reduce((sum, field) => {
            const val = parseFloat(field.value);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // total = project cost + tax amount + additional sums
        const total = cost + taxAmount + additionalSum;
        setTotalCost(total);
    }, [projectCost, tax, additionalFields]);

    const validateFields = () => {
        const errors = {};

        if (!milestone) errors.milestone = t('This field is required.');
        if (!projectCost || isNaN(projectCost) || parseFloat(projectCost) <= 0) errors.projectCost = t('Enter a valid project cost.');
        if (!tax || isNaN(tax) || parseFloat(tax) < 0) errors.tax = t('Enter a valid tax amount.');
        if (!costType) errors.costType = t('This field is required.');

        additionalFields.forEach(field => {
            const val = parseFloat(field.value);
            if (!field.label || field.label.trim() === '' || isNaN(val) || val < 0) {
                errors[`additional-${field.id}`] = t('Enter valid label and numeric value.');
            } else if (val > parseFloat(projectCost)) {
                errors[`additional-${field.id}`] = t('Value cannot exceed project cost.');
            }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = () => {
        console.log(additionalFields, "additionalFields")
        if (!validateFields()) {
            ToastAndroid.show(t('Please fill the fields'), ToastAndroid.SHORT);
            return;
        }
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('milestone', milestone);
        formData.append('projectcost', projectCost);
        formData.append('taxcalculation', tax);
        formData.append('costType', costType);
        formData.append('notes', notes);
        formData.append('totalcost', totalCost);
        const formattedAdditionalFields = additionalFields.map(field => ({
            label: field.label,
            input: field.value,
        }));
        formData.append('additionalAmount', JSON.stringify(formattedAdditionalFields));
        // alert(JSON.stringify(data))
        dispatch(updateProjectCost(formData, (res) => {
            console.log(JSON.stringify(res))
            ToastAndroid.show(res.message, ToastAndroid.SHORT);
            if (res.success) {
                navigation.goBack();
            }
        }));
    };

    const milestoneOptions = Array.from({ length: 9 }, (_, i) => ({
        label: `${i + 1}`, value: `${i + 1}`
    }));

    const costTypeOptions = [
        { label: t('hourly'), value: 'Hourly' },
        { label: t('salary'), value: 'Salary' }
    ];

    const pickerStyles = {
        inputIOS: {
            fontSize,
            paddingVertical: 12,
            paddingHorizontal: 10,
            color: theme.textPrimary,
            backgroundColor: theme.inputBackground,
            borderRadius: 8,
            ...Louis_George_Cafe.regular
        },
        inputAndroid: {
            fontSize,
            paddingHorizontal: 10,
            paddingVertical: 8,
            color: theme.textPrimary,
            backgroundColor: theme.inputBackground,
            borderRadius: 8,
            ...Louis_George_Cafe.regular,
        },
        placeholder: {
            color: theme.textPrimary,
            ...Louis_George_Cafe.regular
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView contentContainerStyle={{ padding: wp(5) }}>
                {/* Milestone */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('milestone')}</Text>
                <View style={{
                    // borderWidth: 1,
                    // borderColor: theme.textPrimary,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    backgroundColor: theme.inputBackground,
                    height: hp(6),
                    justifyContent: 'center',
                    marginBottom: 10
                }}>
                    <RNPickerSelect
                        onValueChange={setMilestone}
                        items={milestoneOptions}
                        style={pickerStyles}
                        placeholder={{ label: t('selectMilestone'), value: null }}
                        value={milestone}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                {validationErrors.milestone && <Text style={{ color: 'red', fontSize: 12, marginBottom: 8, marginTop: -8, ...Louis_George_Cafe.regular }}>{validationErrors.milestone}</Text>}

                {/* Project Cost */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('projectCost')}</Text>
                <TextInput
                    style={{
                        // borderWidth: 1,
                        borderRadius: 8,
                        padding: wp(3),
                        fontSize,
                        backgroundColor: theme.inputBackground,
                        color: theme.textPrimary,
                        borderColor: validationErrors.projectCost ? 'red' : '#ddd',
                        marginBottom: 10,
                        ...Louis_George_Cafe.regular
                    }}
                    placeholder={t('enterProjectCost')}
                    placeholderTextColor={theme.textPrimary}
                    keyboardType="numeric"
                    value={projectCost}
                    onChangeText={setProjectCost}
                />
                {validationErrors.projectCost && <Text style={{ color: 'red', fontSize: 12, marginBottom: 8, marginTop: -8, ...Louis_George_Cafe.regular }}>{validationErrors.projectCost}</Text>}

                {/* Tax */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('taxCalculation')}</Text>
                <TextInput
                    style={{
                        //  borderWidth: 1,
                        borderRadius: 8,
                        padding: wp(3),
                        fontSize,
                        backgroundColor: theme.inputBackground,
                        color: theme.textPrimary,
                        borderColor: validationErrors.tax ? 'red' : '#ddd',
                        marginBottom: 10,
                        ...Louis_George_Cafe.regular
                    }}
                    placeholder={t('enterTax')}
                    placeholderTextColor={theme.textPrimary}
                    keyboardType="numeric"
                    value={tax !== null && tax !== undefined ? String(tax) : ''}
                    onChangeText={(text) => {
                        const numericValue = parseFloat(text);
                        if (!isNaN(numericValue) && numericValue > 100) {
                            setTax('100'); // clamp at 100
                        } else {
                            setTax(text);
                        }
                    }}

                />
                {validationErrors.tax && <Text style={{ color: 'red', fontSize: 12, marginBottom: 8, marginTop: -8, ...Louis_George_Cafe.regular }}>{validationErrors.tax}</Text>}

                {/* Total Project Cost (Read-only) */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('totalProjectCost')}</Text>
                <TouchableOpacity
                    onPress={() => ToastAndroid.show('Manual entry is not allowed here.', ToastAndroid.SHORT)
                    }
                    style={{
                        //  borderWidth: 1,
                        borderRadius: 8,
                        padding: wp(3),
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.textPrimary,
                        marginBottom: 10,
                        height: hp(6),
                        justifyContent: 'center',
                    }}>
                    <Text style={{ fontSize, color: theme.textPrimary, ...Louis_George_Cafe.regular }}>
                        {totalCost.toFixed(2)}
                    </Text>
                </TouchableOpacity>
                {/* Additional Fields */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('additionalAmountCalculation')}</Text>
                {additionalFields.map((field) => (
                    <View key={field.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <TextInput
                        maxLength={15}

                            style={{
                                flex: 1,
                                //  borderWidth: 1,
                                padding: 10,
                                borderRadius: 6,
                                marginHorizontal: 4,
                                fontSize,
                                color: theme.textPrimary,
                                backgroundColor: theme.inputBackground,
                                borderColor: validationErrors[`additional-${field.id}`] ? 'red' : '#ccc',
                                ...Louis_George_Cafe.regular
                            }}
                            placeholder={t('label')}
                            value={field.label}
                            onChangeText={(text) => updateField(field.id, 'label', text)}
                            placeholderTextColor={theme.textPrimary}
                        />
                        <TextInput
                        maxLength={5}
                            style={{
                                flex: 1,
                                //  borderWidth: 1,
                                padding: 10,
                                borderRadius: 6,
                                marginHorizontal: 4,
                                fontSize,
                                color: theme.textPrimary,
                                backgroundColor: theme.inputBackground,
                                borderColor: validationErrors[`additional-${field.id}`] ? 'red' : '#ccc',
                                ...Louis_George_Cafe.regular
                            }}
                            placeholder={t('value')}
                            placeholderTextColor={theme.textPrimary}
                            keyboardType="numeric"
                            value={field.value}
                            onChangeText={(text) => updateField(field.id, 'value', text)}
                        />
                        <TouchableOpacity onPress={() => removeField(field.id)}>
                            <Text style={{ color: 'red', fontSize: 20, ...Louis_George_Cafe.regular }}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {Object.entries(validationErrors).map(([key, error]) =>
                    key.startsWith('additional-') ? <Text key={key} style={{ color: 'red', fontSize: 12, marginBottom: 8, marginTop: -8, ...Louis_George_Cafe.regular }}>{error}</Text> : null
                )}
                <TouchableOpacity onPress={addField} style={{
                    padding: 10,
                    alignItems: 'center',
                    borderRadius: 5,
                    marginBottom: 15,
                    borderWidth: wp(0.5),
                    borderStyle: 'dotted',
                    borderColor: theme.textPrimary
                }}>
                    <Text style={{ color: theme.textPrimary, ...Louis_George_Cafe.regular }}>{t('addField')}</Text>
                </TouchableOpacity>

                {/* Cost Type */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('costType')}</Text>
                <View style={{
                    //  borderWidth: 1,
                    borderColor: theme.textPrimary,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    backgroundColor: theme.inputBackground,
                    height: hp(6),
                    justifyContent: 'center',
                    marginBottom: 10
                }}>
                    <RNPickerSelect
                        onValueChange={setCostType}
                        items={costTypeOptions}
                        style={pickerStyles}
                        placeholder={{ label: t('selectType'), value: null }}
                        value={costType}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                {validationErrors.costType && <Text style={{ color: 'red', fontSize: 12, marginBottom: 8, marginTop: -8, ...Louis_George_Cafe.regular }}>{validationErrors.costType}</Text>}

                {/* Notes */}
                <Text style={{ fontSize: labelFontSize, color: theme.textPrimary, marginTop: 15, marginBottom: 8, ...Louis_George_Cafe.regular }}>{t('notes')}</Text>
                <TextInput
                    numberOfLines={4}
                    style={{
                        //  borderWidth: 1,
                        borderRadius: 8,
                        padding: wp(3),
                        fontSize,
                        backgroundColor: theme.inputBackground,
                        color: theme.textPrimary,
                        borderColor: theme.textPrimary,
                        ...Louis_George_Cafe.regular
                    }}
                    placeholder={t('writeNotesInHTML')}
                    placeholderTextColor={theme.textPrimary}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />
                {/* {notes ? (
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ marginBottom: 5, ...Louis_George_Cafe.regular, color: theme.textPrimary }}>{t('preview')}:</Text>
                        <RenderHtml
                            contentWidth={wp(90)}
                            source={{ html: notes }}
                            tagsStyles={{
                                p: { color: "red", },
                                div: { color: theme.textPrimary, },
                                span: { color: theme.textPrimary, },
                                li: { color: theme.textPrimary, },
                            }}
                        />

                    </View>
                ) : null} */}
                <TouchableOpacity
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 20,
                        backgroundColor: theme.buttonBg
                    }}
                    onPress={onSubmit}
                >
                    <Text style={[Louis_George_Cafe.regular.h4, { color: theme.buttonText, }]}>
                        {projectId ? t('update') : t('submit')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View >
    );
};

export default ProjectCostForm;
