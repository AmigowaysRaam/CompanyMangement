import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { THEMECOLORS } from '../resources/colors/colors';
import { hp, wp } from '../resources/dimensions';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getRoleList, updateFormSubmit, createAdminApi, getAdminById, updateAdminDetails } from '../redux/authActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import DropdownModal from '../components/DropDownModal';
import { ActivityIndicator } from 'react-native-paper';
import ProfileScreenLoader from './ProfileLoader';

const AdminCreating = () => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const [profileImage, setProfileImage] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const userdata = useSelector((state) => state.auth.user?.data);
    const route = useRoute();
    const adminDetails = route.params?.data;

    const [fields, setFields] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        // role: '', // will store role _id
        status: '',
    });
    const [roleDataList, setRoleDataList] = useState([]);
    const [roleModalVisible, setRoleModalVisible] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    // New state
    const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

    // Options for image picker modal
    const imagePickerOptions = [
        { label: t('camera'), value: 'camera' },
        { label: t('file'), value: 'file' },
    ];

    // Replace handleImagePick
    const handleImagePick = () => {
        setImagePickerModalVisible(true);
    };

    // New handler for modal selection
    const onSelectImagePickerOption = (item) => {
        setImagePickerModalVisible(false);
        if (item.value === 'camera') {
            launchCamera(
                { mediaType: 'photo', quality: 0.7 },
                (response) => {
                    if (!response.didCancel && !response.errorCode) {
                        const uri = response.assets?.[0]?.uri;
                        setProfileImage(uri);
                    }
                }
            );
        } else if (item.value === 'file') {
            launchImageLibrary(
                { mediaType: 'photo', quality: 0.7 },
                (response) => {
                    if (!response.didCancel && !response.errorCode) {
                        const uri = response.assets?.[0]?.uri;
                        setProfileImage(uri);
                    }
                }
            );
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!fields.fullName) newErrors.fullName = t('fullNameisrequired');
        if (!fields.username) newErrors.username = t('usernameisrequired');

        if (!fields.email) {
            newErrors.email = t('emailisrequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
            newErrors.email = t('entervalidemail');  // Add this translation key in your i18n files
        }
        if (!fields.phone) newErrors.phone = t('phoneisrequired');
        if (!fields.password && !adminDetails?._id) newErrors.password = t('passwordisrequired');
        // if (!fields.role) newErrors.role = t('roleisrequired');
        return newErrors;
    };

    const handleSubmit = () => {
        setIsLoading(true);
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        Object.keys(fields).forEach((key) => {
            formData.append(key, fields[key]);
        });

        if (profileImage) {
            formData.append('profileImage', {
                uri: profileImage,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });
        }
        formData.append("userid", userdata?.id)
        if (adminDetails?._id) {
            formData.append("_id", adminDetails?._id)
        }
        // setIsLoading(true);
        let callAction = adminDetails?._id ? updateAdminDetails : createAdminApi
        dispatch(
            callAction(formData, (response) => {
                setIsLoading(false);
                // alert(JSON.stringify(response))
                if (response?.success) {
                    ToastAndroid.show(response?.message, ToastAndroid.SHORT);
                    navigation.goBack();
                } else {
                    ToastAndroid.show(t('error_occurred'), ToastAndroid.SHORT);
                }
            })
        );
    };

    useEffect(() => {
        fetchAdminDetails();
        dispatch(
            getRoleList(userdata?.id, (response) => {
                if (response.success) {
                    setRoleDataList(
                        response?.data?.map((item) => ({
                            label: item?.roleName,
                            value: item?.id,
                        }))
                    );
                }
            })
        );
    }, []);

    const fetchAdminDetails = () => {
        setIsLoading(true);

        if (adminDetails?._id) {
            dispatch(
                getAdminById(
                    { userid: userdata?.id, _id: adminDetails._id },
                    (response) => {
                        if (response.success) {
                            const data = response.data;
                            // alert(JSON.stringify(data, null, 2))
                            console.log('Fetched admin data:', data);
                            // alert( data.usertype)
                            // Bind API data into fields state
                            setFields({
                                fullName: data.fullName || '',
                                username: data.username || '',
                                email: data.email || '',
                                phone: data.phone || '',
                                password: '',   // You typically won't pre-fill password
                                status: data.status ? data.status.toString() : '',  // convert to string if needed
                            });
                            if (data.imageUrl) {
                                const imageUrl = data.imageUrl;
                                setProfileImage(imageUrl);
                                // console.log(imageUrl)
                            }
                            setIsLoading(false);
                        }
                    }
                )
            );
        }
    };


    const handleChange = (key, value) => {
        console.log(key, value)
        setFields({ ...fields, [key]: value });
        setErrors({ ...errors, [key]: '' });
    };

    // Find selected role label for display
    const selectedRoleLabel =
        roleDataList.find((r) => r.value === fields.role)?.label || t('select_role');

    return (
        <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}>
            <HeaderComponent title={adminDetails?._id ? t('update_admin') : t('create_admin')} showBackArray={true} />



            {
                isLoading ?

                    <ProfileScreenLoader />
                    :
                    <>
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
                                            source={profileImage ? { uri: profileImage } : null}
                                            style={styles.profileImage}
                                        />

                                        <MaterialCommunityIcons
                                            name={'camera'}
                                            size={hp(2.5)}
                                            color={'#000'}
                                            style={{
                                                position: 'absolute',
                                                left: hp(11),
                                                padding: wp(1.5),
                                                backgroundColor: '#fff',
                                                borderRadius: wp(4),
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1 }}
                        >
                            <ScrollView
                                contentContainerStyle={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.inputContainer}>
                                    {[
                                        {
                                            key: 'fullName',
                                            label: t('fullname'),
                                            placeholder: t('enteryourfullName'),
                                            maxLength: 50,
                                            autoCapitalize: 'words',
                                        },
                                        {
                                            key: 'username',
                                            label: t('username'),
                                            placeholder: t('enteryourusername'),
                                            maxLength: 30,
                                            autoCapitalize: 'none',
                                        },
                                        {
                                            key: 'email',
                                            label: t('email'),
                                            placeholder: t('enteryouremail'),
                                            keyboardType: 'email-address',
                                            autoCapitalize: 'none',
                                            textContentType: 'emailAddress',
                                            autoCorrect: false,
                                            maxLength: 50,
                                        },
                                        {
                                            key: 'phone',
                                            label: t('phone'),
                                            placeholder: t('enteryourphonenumber'),
                                            keyboardType: 'phone-pad',
                                            maxLength: 10,
                                            textContentType: 'telephoneNumber',
                                        },
                                        // Conditionally include password field
                                        ...(!adminDetails?._id ? [{
                                            key: 'password',
                                            label: t('password'),
                                            placeholder: t('enteryourpassword'),
                                            secureTextEntry: true,
                                            autoCapitalize: 'none',
                                            autoCorrect: false,
                                            maxLength: 20,
                                            textContentType: 'password',
                                        }] : []),
                                    ].map((field) => (
                                        <View key={field.key} style={{ marginBottom: hp(2) }}>
                                            <Text
                                                style={[
                                                    isTamil ? Louis_George_Cafe.regular.h8 : Louis_George_Cafe.regular.h6,
                                                    styles.label,
                                                    { color: THEMECOLORS[themeMode].textPrimary },
                                                ]}
                                            >
                                                {field.label}
                                            </Text>
                                            <TextInput
                                                editable={field.disabled && fields.key == 'password'}
                                                value={fields[field.key]}
                                                onChangeText={(value) => handleChange(field.key, value)}
                                                placeholder={field.placeholder}
                                                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                                                secureTextEntry={field.secureTextEntry}
                                                keyboardType={field.keyboardType || 'default'}
                                                autoCapitalize={field.autoCapitalize || 'sentences'}
                                                autoCorrect={field.autoCorrect ?? true}
                                                textContentType={field.textContentType || 'none'}
                                                maxLength={field.maxLength}
                                                style={[
                                                    styles.input,
                                                    {
                                                        color: THEMECOLORS[themeMode].textPrimary,
                                                        // backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                                        borderColor: THEMECOLORS[themeMode].textPrimary,
                                                        borderWidth: wp(0.4),
                                                    },
                                                    isTamil && { fontSize: wp(3) },
                                                ]}
                                            />
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
                    </>
            }


            <View style={styles.fixedButtonWrapper}>
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={handleSubmit}
                    disabled={isLoading}

                >
                    {isLoading ?
                        <ActivityIndicator /> :
                        <Text
                            style={[
                                Louis_George_Cafe.bold.h5,
                                {
                                    color: THEMECOLORS[themeMode].viewBackground,
                                    lineHeight: wp(7),
                                },
                            ]}
                        >
                            {adminDetails?._id ? t('update_admin') : t('create_admin')}
                        </Text>}
                </TouchableOpacity>
            </View>
            <DropdownModal
                visible={imagePickerModalVisible}
                items={imagePickerOptions}
                onSelect={onSelectImagePickerOption}
                onCancel={() => setImagePickerModalVisible(false)}
                title={t('choose_image_source')}
            />

            {/* Dropdown Modal for role */}
            <DropdownModal
                visible={roleModalVisible}
                items={roleDataList}
                onSelect={(item) => {
                    handleChange('role', item.value);
                    setRoleModalVisible(false);
                }}
                onCancel={() => setRoleModalVisible(false)}
                title={t('select_role')}
                selectedValue={fields.role}
            />
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
    },
    label: {
        marginBottom: hp(0.5),
        fontWeight: '600',
    },
    input: {
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
        alignItems: 'center',
    },
    coverImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '60%',
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
    profileImageContainer: {
        zIndex: 2,
        alignSelf: 'center',
        position: 'relative',
        top: hp(4),
    },
    profileImage: {
        width: wp(35),
        height: wp(35),
        borderRadius: wp(18),
        borderWidth: 3,
        borderColor: '#fff',
    },
});

export default AdminCreating;
