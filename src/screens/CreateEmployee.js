import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { THEMECOLORS } from '../resources/colors/colors';
import { hp, wp } from '../resources/dimensions';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createEmployeeCall, getRoleList } from '../redux/authActions';
import ProfileScreenLoader from './ProfileLoader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import DropdownModal from '../components/DropDownModal';

const CreateEmployee = () => {
    
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const [profileImage, setProfileImage] = useState(null);
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setisLoading] = useState(false);

    const [fields, setFields] = useState({
        fullname: __DEV__ ? 'test' : '',
        username: __DEV__ ? 'xtestcvcxv' : '',
        designation: __DEV__ ? 'xcvxcvtestxcv' : '',
        dob: '',
        email: __DEV__ ? 'divyaTest@gmail.com' : '',
        phone: __DEV__ ? '1234567896' : '',
        password: __DEV__ ? '1234' : '',
        role_id: null
    });

    const [errors, setErrors] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [roleDataList, setRoleDataList] = useState([]);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    const fetchCompanyData = () => {
        dispatch(
            getRoleList(userdata?.id, (response) => {
                if (response.success) {
                    setRoleDataList(response?.data);
                }
            })
        );
    };

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && !response.errorCode) {
                const uri = response.assets?.[0]?.uri;
                setProfileImage(uri);
            }
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!fields.fullname) newErrors.fullname = t('employeenameisrequired');
        if (!fields.username) newErrors.username = t('usernameisrequired');
        // if (!fields.designation) newErrors.designation = t('designationisrequired');
        if (!fields.dob) newErrors.dob = t('dobisrequired');
        if (!fields.email) newErrors.email = t('emailisrequired');
        if (!fields.password) newErrors.password = t('passwordRequired');
        if (!fields.role_id) newErrors.role_id = t('rolerequired');
        else if (!/\S+@\S+\.\S+/.test(fields.email)) newErrors.email = t('invalidemail');
        if (!fields.phone) newErrors.phone = t('phoneisrequired');
        else if (!/^[0-9]{10}$/.test(fields.phone)) newErrors.phone = t('invalidphonenumber');
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // alert(fields?.role_id)
        dispatch(createEmployeeCall(userdata?.id, fields, (response) => {
            ToastAndroid.show(response.message, ToastAndroid.SHORT);
            if (response?.success) {
                navigation?.goBack();
            }
        }));
    };

    const handleChange = (key, value) => {
        setFields({ ...fields, [key]: value });
        setErrors({ ...errors, [key]: '' });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formatted = selectedDate.toISOString().split('T')[0];
            setDate(selectedDate);
            handleChange('dob', formatted);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}>
            <HeaderComponent title={t('create_employee')} showBackArray={true} />
            {isLoading ? <ProfileScreenLoader /> : (
                <>
                    {/* Profile Image */}
                    <View style={styles.coverContainer}>
                        <LinearGradient
                            colors={['#C4A5EC', '#FFF7E3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.coverImage}
                        >
                            <View style={styles.profileImageContainer}>
                                <TouchableOpacity onPress={handleImagePick}>
                                    <Image
                                        source={profileImage ? { uri: profileImage } : require('../assets/animations/user_1.png')}
                                        style={styles.profileImage}
                                    />
                                    <MaterialCommunityIcons
                                        name="camera"
                                        size={hp(2.5)}
                                        color="#000"
                                        style={{
                                            position: "absolute",
                                            left: hp(11),
                                            padding: wp(1.5),
                                            backgroundColor: "#fff",
                                            borderRadius: wp(4)
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Form */}
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                        <ScrollView
                            contentContainerStyle={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.inputContainer}>
                                {/* Role Dropdown */}
                                <View style={{ marginBottom: hp(2) }}>
                                    <Text style={[
                                        isTamil ? Louis_George_Cafe.regular.h7 : Louis_George_Cafe.regular.h6,
                                        styles.label,
                                        { color: THEMECOLORS[themeMode].textPrimary }
                                    ]}>
                                        {t('select_role')}
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: THEMECOLORS[themeMode].viewBackground,
                                                borderColor: THEMECOLORS[themeMode].textPrimary,
                                            },
                                            isTamil && { fontSize: wp(3.5) }
                                        ]}
                                        onPress={() => setShowRoleDropdown(true)}
                                    >
                                        <Text style={{
                                            color: fields.role_id ? THEMECOLORS[themeMode].textPrimary : '#888',
                                            fontSize: wp(4)
                                        }}>
                                            {
                                                fields.role_id
                                                    ? roleDataList.find(role => role.id === fields.role_id)?.roleName
                                                    : t('select_role')
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                    {errors.role_id && (
                                        <Text style={[Louis_George_Cafe.regular.h8, { color: 'red', margin: wp(2) }]}>
                                            {errors.role_id}
                                        </Text>
                                    )}
                                </View>

                                {/* Text Inputs */}
                                {[
                                    {
                                        key: 'fullname',
                                        label: t('employee_name'),
                                        placeholder: t('enteremployeename'),
                                        maxLength: 50
                                    },
                                    {
                                        key: 'dob',
                                        label: t('dob'),
                                        placeholder: t('yyyy-mm-dd'),
                                        isDate: true,
                                        maxLength: 10
                                    },
                                    {
                                        key: 'email',
                                        label: t('email'),
                                        placeholder: t('enteryouremail'),
                                        maxLength: 100
                                    },
                                    {
                                        key: 'phone',
                                        label: t('phone'),
                                        placeholder: t('enteryourphonenumber'),
                                        maxLength: 10
                                    },
                                    {
                                        key: 'password',
                                        label: t('password'),
                                        placeholder: t('enteryourpassword'),
                                        maxLength: 20,
                                        secureTextEntry: true
                                    }
                                ].map(field => (
                                    <View key={field.key} style={{ marginBottom: hp(2) }}>
                                        <Text style={[
                                            isTamil ? Louis_George_Cafe.regular.h7 : Louis_George_Cafe.regular.h6,
                                            styles.label,
                                            { color: THEMECOLORS[themeMode].textPrimary }
                                        ]}>
                                            {field.label}
                                        </Text>
                                        <TouchableOpacity
                                            activeOpacity={field.isDate ? 0.8 : 1}
                                            onPress={() => field.isDate && setShowDatePicker(true)}
                                        >
                                            <TextInput
                                                editable={!field.isDate}
                                                value={fields[field.key]}
                                                placeholder={field.placeholder}
                                                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                                                style={[
                                                    styles.input,
                                                    {
                                                        backgroundColor: THEMECOLORS[themeMode].viewBackground,
                                                        color: THEMECOLORS[themeMode].textPrimary,
                                                        borderColor: THEMECOLORS[themeMode].textPrimary
                                                    },
                                                    isTamil && { fontSize: wp(3.5) }
                                                ]}
                                                keyboardType={
                                                    field.key === 'email'
                                                        ? 'email-address'
                                                        : field.key === 'phone'
                                                            ? 'phone-pad'
                                                            : 'default'
                                                }
                                                onChangeText={text => !field.isDate && handleChange(field.key, text)}
                                                maxLength={field.maxLength}
                                                secureTextEntry={field.secureTextEntry}
                                            />
                                        </TouchableOpacity>
                                        {errors[field.key] && (
                                            <Text style={[Louis_George_Cafe.regular.h8, { color: 'red', margin: wp(2) }]}>
                                                {errors[field.key]}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                    </KeyboardAvoidingView>

                    {/* Submit Button */}
                    <View style={styles.fixedButtonWrapper}>
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                { backgroundColor: THEMECOLORS[themeMode].buttonBg }
                            ]}
                            onPress={handleSubmit}
                        >
                            <Text style={[
                                Louis_George_Cafe.bold.h5,
                                {
                                    color: THEMECOLORS[themeMode].viewBackground,
                                    lineHeight: wp(7)
                                }
                            ]}>
                                {t('create_employee')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Role Dropdown Modal */}
                    <DropdownModal
                        visible={showRoleDropdown}
                        onCancel={() => setShowRoleDropdown(false)}
                        selectedValue={fields.role_id}
                        title={t('select_role')}
                        items={roleDataList.map(role => ({
                            label: role.roleName,
                            value: role.id
                        }))}
                        onSelect={(item) => {
                            handleChange('role_id', item.value);
                            setShowRoleDropdown(false);
                        }}
                    />
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
        marginTop: hp(5),
    },
    label: {
        marginBottom: hp(0.5),
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: wp(3),
        padding: wp(3),
    },
    fixedButtonWrapper: {
        padding: wp(3),
    },
    submitButton: {
        padding: wp(2.5),
        borderRadius: wp(2),
        alignItems: 'center',
        width: '100%',
    },
    coverContainer: {
        height: hp(24),
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    coverImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '80%',
        alignSelf: "center",
        justifyContent: "flex-end",
    },
    profileImageContainer: {
        zIndex: 2,
        alignSelf: "center",
        position: "relative",
        top: hp(4)
    },
    profileImage: {
        width: wp(35),
        height: wp(35),
        borderRadius: wp(18),
        borderWidth: 3,
        borderColor: '#fff'
    },
});

export default CreateEmployee;
