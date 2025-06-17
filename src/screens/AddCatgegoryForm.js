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
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { Louis_George_Cafe } from '../resources/fonts';
import { createSubCatgoryForm, updateSubCatgoryForm } from '../redux/authActions';

const AddCategoryForm = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const route = useRoute();
    const cData = route.params?.data;

    const isTamil = i18n.language === 'ta';

    const [categoryName, setCategoryName] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [subrolesName, setSubrolesName] = useState('');
    const [statusType, setActiveStatus] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const statusTypes = [
        { label: t('active'), value: 1 },
        { label: t('inactive'), value: 0 },
    ];

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const validateForm = () => {
        const newErrors = {};
        if (!categoryName.trim()) newErrors.categoryName = t('categoryNameRequired');
        if (statusType === null) newErrors.status = t('statusRequired');
        return newErrors;
    };

    const onSubmit = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = {
            category_name: categoryName,
            sub_category: [
                {
                    name: subcategoryName,
                    sub_roles: subrolesName.split(',').map(r => r.trim()),
                    order: 1,
                },
            ],
            status: statusType,
        };

        setLoading(true);
        const callback = (response) => {
            setLoading(false);
            ToastAndroid.show(response.message, ToastAndroid.SHORT);
            if (response.success) {
                navigation.goBack();
            } else {
                ToastAndroid.show('Something went wrong, please try again.', ToastAndroid.SHORT);
            }
        };

        if (cData?._id) {
            formData.id = cData._id;
            dispatch(updateSubCatgoryForm(formData, callback));
        } else {
            dispatch(createSubCatgoryForm(formData, callback));
        }
    };

    useEffect(() => {
        if (cData) {
            setCategoryName(cData.category_name || '');
            setActiveStatus(Number(cData.status) === 1 ? 1 : 0);
            if (Array.isArray(cData.sub_category) && cData.sub_category.length > 0) {
                setSubcategoryName(cData.sub_category[0].name || '');
                setSubrolesName((cData.sub_category[0].sub_roles || []).join(', '));
            }
        }
    }, [cData]);

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('AddCategoryForm')} />
            <ScrollView contentContainerStyle={styles.form}>
                {/* Category Name */}
                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.2) : wp(4),
                    }
                ]}>
                    {t('categoryName')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.2) : wp(4) }]}
                    placeholder={t('categoryNamePlaceholder')}
                    value={categoryName}
                    onChangeText={(text) => {
                        setCategoryName(text);
                        setErrors((prev) => ({ ...prev, categoryName: '' }));
                    }}
                />
                {errors.categoryName && (
                    <Text style={[styles.errorText, { fontSize: isTamil ? wp(3) : wp(3.5) }]}>
                        {errors.categoryName}
                    </Text>
                )}

                {/* Subcategory Name */}
                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.2) : wp(4),
                    }
                ]}>
                    {t('subcategoryName')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.2) : wp(4) }]}
                    placeholder={t('subcategoryNamePlaceholder')}
                    value={subcategoryName}
                    onChangeText={setSubcategoryName}
                />

                {/* Subroles Name */}
                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.2) : wp(4),
                    }
                ]}>
                    {t('subrolesName')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.2) : wp(4) }]}
                    placeholder={t('subrolesNamePlaceholder')}
                    value={subrolesName}
                    onChangeText={setSubrolesName}
                />

                {/* Status */}
                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.2) : wp(4),
                    }
                ]}>
                    {t('status')}
                </Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setActiveStatus(value);
                            setErrors((prev) => ({ ...prev, status: '' }));
                        }}
                        items={statusTypes}
                        style={{
                            inputAndroid: {
                                fontSize: isTamil ? wp(3.2) : wp(4),
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                color: 'black',
                            },
                            inputIOS: {
                                fontSize: isTamil ? wp(3.2) : wp(4),
                                paddingHorizontal: 10,
                                paddingVertical: 12,
                                color: 'black',
                            }
                        }}
                        placeholder={{ label: t('status'), value: null }}
                        value={statusType}
                    />
                </View>
                {errors.status && (
                    <Text style={[styles.errorText, { fontSize: isTamil ? wp(3) : wp(3.5) }]}>
                        {errors.status}
                    </Text>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[
                            Louis_George_Cafe.bold.h4,
                            styles.buttonText,
                            {
                                color: THEMECOLORS[themeMode].buttonText,
                                fontSize: isTamil ? wp(3) : wp(4.5),
                            }
                        ]}>
                            {t('create')}
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
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(4),
        padding: wp(2),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    pickerWrapper: {
        borderWidth: wp(0.3),
        borderColor: '#ccc',
        paddingHorizontal: wp(1),
        borderRadius: wp(2),
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
});

export default AddCategoryForm;
