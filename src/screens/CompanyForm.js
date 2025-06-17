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
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryList, getSubcategoryApiiCall, submitCreateForm, updateContactInfo } from '../redux/authActions';

const AddCompanyForm = ({ onNext, setCurrentStep, currentStep, dataObj, onSubmitSuccess, cId, companyDetails, onRefresh }) => {

    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    const [companyType, setCompanyType] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [openCategory, setOpenCategory] = useState(false);
    const [category, setCategory] = useState(null);
    const [subcategoryId, setSubCategoryId] = useState(null);
    const [categoryArr, setCategoryArr] = useState([]);
    const [subCatArr, setsubCatArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const [catloading, setcatloading] = useState(false);
    // Validation states
    const [errors, setErrors] = useState({});
    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const fetchCategories = () => {
        setcatloading(true);
        dispatch(
            getCategoryList('', null, null, '', (response) => {
                if (response) {
                    const formattedCategories = response.data.map((item) => ({
                        label: item.category_name,
                        value: item.category_id,
                    }));
                    setCategoryArr(formattedCategories);
                }
                setcatloading(false);
            })
        );
    };

    const fetchSubCategories = () => {
        setcatloading(true);
        dispatch(
            getSubcategoryApiiCall(userdata?.id, category, (response) => {
                if (response?.success) {
                    const formattedSubCategories = response.data.map((item) => ({
                        label: item.name,
                        value: item._id,
                    }));
                    setsubCatArr(formattedSubCategories);
                } else {
                    setsubCatArr([]);
                }
                setcatloading(false);
            })
        );
    };

    useEffect(() => {
        // alert(JSON.stringify(companyDetails))
        if (
            companyDetails?._id &&
            categoryArr.length > 0 &&
            dataObj?.companyTypes?.length > 0
        ) {
            const matchedCompanyType = dataObj.companyTypes.find(
                (item) => item.value.toLowerCase() === companyDetails.account_type?.toLowerCase()
            )?.value || null;

            const matchedCategory = categoryArr.find(
                (item) => item.value === companyDetails.selected_category_name
            )?.value || null;

            setCompanyType(matchedCompanyType);
            setCompanyName(companyDetails.company_name || '');
            setRegisterNumber(companyDetails.registration_number || '');
            setCategory(matchedCategory);

            if (matchedCategory) {
                dispatch(
                    getSubcategoryApiiCall(userdata?.id, matchedCategory, (response) => {
                        if (response?.success) {
                            const formattedSubCategories = response.data.map((item) => ({
                                label: item.name,
                                value: item._id,
                            }));
                            setsubCatArr(formattedSubCategories);
                            const matchedSubCategory = formattedSubCategories.find(
                                (item) => item.value === companyDetails.selected_sub_category_name
                            )?.value || null;
                            setSubCategoryId(matchedSubCategory);
                        } else {
                            setsubCatArr([]);
                            setSubCategoryId(null);
                        }
                    })
                );
            } else {
                setSubCategoryId(null);
            }
        }
    }, [companyDetails?.id, categoryArr.length, dataObj?.companyTypes?.length]);


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (category && categoryArr.length > 0) {
            fetchSubCategories();
        }
    }, [category, categoryArr]);


    const validateFields = () => {
        const newErrors = {};
        if (!companyType) newErrors.companyType = t('selectCompanyType');
        if (!companyName.trim()) newErrors.companyName = t('enterCompanyName');
        if (!registerNumber.trim()) newErrors.registerNumber = t('enterRegistrationNumber');
        if (!category) newErrors.category = t('selectCategory');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {
        if (!validateFields()) {
            ToastAndroid.show(t('fillAllFields'), ToastAndroid.SHORT);
            return;
        }

        if (cId || companyDetails?.id) {
            const formData = {
                account_type: companyType,
                luserid: userdata?.id,
                company_name: companyName,
                registration_number: registerNumber,
                selected_category_name: category,
                selected_sub_category_name: subcategoryId,
                _id: cId
            };
            setLoading(true);
            dispatch(
                updateContactInfo(formData, (response) => {
                    setLoading(false);
                    if (response.success) {
                        onRefresh();
                        const companyId = response?.data?._id;
                        onSubmitSuccess(companyId);
                        onNext();
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);

                    } else {
                        ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                    }
                })
            );
        }
        else {
            const formData = {
                account_type: companyType,
                luserid: userdata?.id,
                company_name: companyName,
                registration_number: registerNumber,
                selected_category_name: category,
                selected_sub_category_name: subcategoryId,
            };
            setLoading(true);
            dispatch(
                submitCreateForm(formData, (response) => {
                    setLoading(false);
                    if (response.success) {
                        onRefresh();
                        const companyId = response?.data?._id;
                        onSubmitSuccess(companyId);
                        onNext();
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);

                    } else {
                        ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                    }
                })
            );

        }
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
                {t('new_company')}
            </Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                {/* Company Type */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('companyType')}
                </Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setCompanyType(value);
                            if (value) setErrors((prev) => ({ ...prev, companyType: null }));
                        }}
                        items={dataObj?.companyTypes}
                        placeholder={{ label: t('selectCompanyType'), value: null }}
                        value={companyType}
                        style={{
                            inputIOS: { fontSize: isTamil ? wp(3.5) : wp(4) },
                            inputAndroid: { fontSize: isTamil ? wp(3.5) : wp(4) },
                        }}
                    />
                </View>
                {errors.companyType && <Text style={styles.errorText}>{errors.companyType}</Text>}

                {/* Company Name */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('companyName')}
                </Text>
                <TextInput
                    style={[styles.textInput]}
                    placeholder={t('enterCompanyName')}
                    value={companyName}
                    onChangeText={(text) => {
                        setCompanyName(text);
                        if (text) setErrors((prev) => ({ ...prev, companyName: null }));
                    }}
                />
                {errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}

                {/* Registration Number */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('registrationNumber')}
                </Text>
                <TextInput
                    maxLength={14}
                    style={styles.textInput}
                    placeholder={t('enterRegistrationNumber')}
                    value={registerNumber}
                    onChangeText={(text) => {
                        setRegisterNumber(text);
                        if (text) setErrors((prev) => ({ ...prev, registerNumber: null }));
                    }}
                />
                {errors.registerNumber && <Text style={styles.errorText}>{errors.registerNumber}</Text>}

                {/* Category */}
                <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('category')}
                </Text>
                <View style={{ zIndex: 1000, marginBottom: 15 }}>
                    {catloading ? (
                        <ActivityIndicator size={wp(8)} />
                    ) : (
                        <DropDownPicker
                            open={openCategory}
                            value={category}
                            items={categoryArr}
                            setOpen={setOpenCategory}
                            setValue={(callback) => {
                                const value = callback(category);
                                setCategory(value);
                                if (value) setErrors((prev) => ({ ...prev, category: null }));
                                return value;
                            }}
                            setItems={setCategoryArr}
                            searchable={true}
                            searchPlaceholder={t('searchCategories')}
                            placeholder={t('selectCategory')}
                            style={{ borderColor: '#ccc', backgroundColor: '#fff' }}
                            dropDownContainerStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }}
                            textStyle={{ fontSize: isTamil ? wp(3.5) : wp(4.2) }}
                            listMode="MODAL"
                            modalProps={{ animationType: 'none' }}
                            modalContentContainerStyle={{ backgroundColor: 'white' }}
                        />
                    )}
                    {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                </View>

                {/* Subcategory */}
                {subCatArr.length > 0 && (
                    <>
                        <Text style={[styles.label, Louis_George_Cafe.bold.h6, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {t('subCategory')}
                        </Text>
                        <View style={styles.pickerWrapper}>
                            <RNPickerSelect
                                onValueChange={setSubCategoryId}
                                items={subCatArr}
                                placeholder={{ label: t('selectSubCategory'), value: null }}
                                value={subcategoryId}
                                style={{
                                    inputIOS: { fontSize: isTamil ? wp(3.5) : wp(4) },
                                    inputAndroid: { fontSize: isTamil ? wp(3.5) : wp(4) },
                                }}
                            />
                        </View>
                    </>
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
    label: {
        marginBottom: 8,
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
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: wp(3.2),
    },
});

export default AddCompanyForm;
