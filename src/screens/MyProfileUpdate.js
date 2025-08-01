import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform,
    ToastAndroid,
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getProfileDetailsById, updateFormSubmit } from '../redux/authActions';
import { ActivityIndicator } from 'react-native-paper';
import ProfileScreenLoader from './ProfileLoader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import ProfileUploadPopUp from '../components/ProfileUploadPopUp';

const MyProfileUpdate = () => {

    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const [profileImage, setProfileImage] = useState(null);
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setisLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const [fields, setFields] = useState({
        fullname: '',
        username: '',
        designation: '',
        dob: "",
        email: '',
        phone: '',
    });

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getProfileDetailsById(userdata?.id, (response) => {
                if (response.success && response.data?.[0]) {
                    const data = response.data[0];
                    setisLoading(false)
                    setFields({
                        fullname: data?.full_name || '',
                        username: data?.designation, // You can assign if you have a `username` in API
                        designation: data?.designation || '',
                        dob: __DEV__ ? "TEST" :  data?.dob ,      // Assign if available in API
                        email: data.email || '',
                        phone: data.phone || '',
                    });
                }
                else {
                    // Alert.alert(response.message,"Error")
                }
            }));
        }, [userdata])
    );
    const [errors, setErrors] = useState({});
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
        if (!fields.fullname) newErrors.fullname = t('fullnameisrequired');
        // if (!fields.username) newErrors.username = t('usernameisrequired');
        // if (!fields.designation) newErrors.designation = t('designationisrequired');
        // // if (!fields.dob) newErrors.dob = t('dobisrequired');
        // if (!fields.email) newErrors.email = t('emailisrequired');
        // else if (!/\S+@\S+\.\S+/.test(fields.email)) newErrors.email = t('invalidemail');
        // if (!fields.phone) newErrors.phone = t('phoneisrequired');
        // else if (!/^[0-9]{10}$/.test(fields.phone)) newErrors.phone = t('invalidphonenumber');
        return newErrors;
    };
    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(updateFormSubmit(userdata?.id, fields, (response) => {
            if (response.success && response.data) {
                navigation.goBack();
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
            }
        }));
    };



    const handleChange = (key, value, eFlag) => {
        // if (eFlag) {
        //     // ToastAndroid.show(`You can't edit this field`, ToastAndroid.SHORT);
        //     return
        // }
        setFields({ ...fields, [key]: value });
        setErrors({ ...errors, [key]: '' });
    };

    return (
        <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}>
            <HeaderComponent title={t('My Profile')} showBackArray={true} />
            {/* <ThemeToggle /> */}
            {isLoading ?
                <ProfileScreenLoader />
                :
                <>
                    {/* Profile Image Section */}
                    <View style={styles.coverContainer}>
                        <LinearGradient
                            colors={['#C4A5EC', '#FFF7E3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.coverImage}
                        >
                            <View style={styles.profileImageContainer}>
                                <TouchableOpacity
                                    onPress={
                                        // handleImagePick
                                        () =>
                                            setShowDropdown(true)
                                    }>
                                    <Image
                                        source={{ uri: userdata?.profileImage }}
                                        style={styles.profileImage}
                                    />
                                    <MaterialCommunityIcons
                                        name={'camera'}
                                        size={hp(2.5)}
                                        color={"#000"}
                                        style={{
                                            position: "absolute", left: hp(11), padding: wp(1.5), backgroundColor: "#fff", borderRadius: wp(4)
                                            // , borderWidth: wp(0.3)
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                    {/* Scrollable Form Section */}
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        <ScrollView
                            contentContainerStyle={[
                                styles.container,
                                { backgroundColor: THEMECOLORS[themeMode].background }
                            ]}
                            keyboardShouldPersistTaps="handled"
                        >
                            {
                                isLoading ?
                                    <ActivityIndicator style={{ marginVertical: wp(5) }} />
                                    :
                                    <View style={styles.inputContainer}>
                                        {[
                                            { key: 'fullname', label: t('fullname'), placeholder: t('enteryourfullname'), editable: true },
                                            { key: 'username', label: t('username'), placeholder: t('enteryourusername'), editable: false },
                                            { key: 'designation', label: t('designation'), placeholder: t('enteryourdesignation'), editable: false },
                                            { key: 'dob', label: t('dob'), placeholder: t('yyyy-mm-dd'), editable: false },
                                            { key: 'email', label: t('email'), placeholder: t('enteryouremail'), editable: false },
                                            { key: 'phone', label: t('phone'), placeholder: t('enteryourphonenumber'), editable: false }
                                        ].map(field => (
                                            <View key={field.key} style={{ marginBottom: hp(2) }}>
                                                <Text style={[
                                                    isTamil ? Louis_George_Cafe.regular.h8 : Louis_George_Cafe.regular.h6,
                                                    styles.label,
                                                    {
                                                        color: THEMECOLORS[themeMode].textPrimary,
                                                        lineHeight: wp(5)
                                                    }
                                                ]}>
                                                    {field.label}
                                                </Text>

                                                <TouchableOpacity
                                                    activeOpacity={field.editable ? 1 : 0.7}
                                                    onPress={() => {
                                                        if (!field.editable) {
                                                            ToastAndroid.show(`${'u_cnt_edit'}`, ToastAndroid.SHORT);
                                                        }
                                                    }}
                                                >
                                                    <TextInput
                                                        maxLength={35}
                                                        pointerEvents={field.editable ? 'auto' : 'none'}
                                                        editable={field.editable}
                                                        value={fields[field.key]}
                                                        onChangeText={(value) => handleChange(field.key, value, field.editable)}
                                                        placeholder={field.placeholder}
                                                        placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                                                        style={[
                                                            styles.input,
                                                            {
                                                                color: THEMECOLORS[themeMode].textPrimary,
                                                                backgroundColor: field.editable
                                                                    ? THEMECOLORS[themeMode].inputBackground
                                                                    : THEMECOLORS[themeMode].background,
                                                                borderWidth: field.editable ? wp(0.4) : wp(0),
                                                                borderBottomWidth: field.editable ? wp(0.4) : wp(0.5),
                                                                borderColor: THEMECOLORS[themeMode].textPrimary,
                                                            },
                                                            isTamil && { fontSize: wp(3) }
                                                        ]}
                                                        keyboardType={
                                                            field.key === 'email'
                                                                ? 'email-address'
                                                                : field.key === 'phone'
                                                                    ? 'phone-pad'
                                                                    : 'default'
                                                        }
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
                            }
                            {/* <ThemeToggle /> */}
                        </ScrollView>
                    </KeyboardAvoidingView>
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
                                {t('updateprofile')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
            {showDropdown &&
                <ProfileUploadPopUp
                    option={{}}
                    isVisible={showDropdown}
                    onCancel={() => setShowDropdown(false)}
                />
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(3),
    },
    imageSection: {
        zIndex: 111,
        alignItems: 'center',
        marginTop: hp(2), position: "relative", top: hp(12), marginBottom: hp(3)
    },
    profileImage: {
        width: wp(30),
        height: wp(30),
        borderRadius: wp(15),
        marginBottom: hp(1),
    },
    changePhotoText: {
        textAlign: 'center',
        marginBottom: hp(2),
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
        // borderWidth: 1,
        borderRadius: wp(3),
        padding: wp(3),
    },
    fixedButtonWrapper: {
        padding: wp(3),
        borderColor: '#ccc',
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

export default MyProfileUpdate;
