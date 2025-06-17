import React, { useState, useEffect } from 'react';
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
import { Louis_George_Cafe } from '../resources/fonts';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch } from 'react-redux';
import { updateClientDetails } from '../redux/authActions';

const OfficeDetailForm = ({ onNext, cId, dataObj, onRefresh,clientDetails }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [locationType, setLocationType] = useState(null);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Prefill from dataObj
    useEffect(() => {
        const location = clientDetails?.officeLocations?.[0];
        if (location) {
            setLocationType(location?.locationType || null);
            setPhone(location?.phone || '');
            setEmail(location?.email || '');
            setStreet(location?.address?.street || '');
            setCity(location?.address?.city || '');
            setState(location?.address?.state || '');
            setPostalCode(location?.address?.postalCode || '');
            setCountry(location?.address?.country || '');
        }
    }, [dataObj]);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (number) => /^[0-9]{7,15}$/.test(number);

    const validateFields = () => {
        const newErrors = {};
        if (!locationType) newErrors.locationType = t('select_location_type');
        if (!phone || !isValidPhone(phone)) newErrors.phone = t('invalid_phone');
        if (!email || !isValidEmail(email)) newErrors.email = t('invalid_email');
        if (!street.trim()) newErrors.street = t('enter_street');
        if (!city.trim()) newErrors.city = t('enter_city');
        if (!state.trim()) newErrors.state = t('enter_state');
        if (!postalCode.trim()) newErrors.postalCode = t('enter_postal');
        if (!country.trim()) newErrors.country = t('enter_country');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {
        if (!validateFields()) return;

        const formData = {
            officeLocations: [
                {
                    locationType: locationType,
                    address: {
                        street: street,
                        city: city,
                        state: state,
                        postalCode: postalCode,
                        country: country,
                    },
                    phone: phone,
                    email: email,
                }
            ],
            clientId: cId
        };

        setLoading(true);

        dispatch(
            updateClientDetails(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    onRefresh();
                    onNext();
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                }
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, {
                color: THEMECOLORS[themeMode].textPrimary,
                alignSelf: "center",
                textTransform: "capitalize",
                lineHeight: wp(8)
            }]}>
                {t('OfficeDetailForm')}
            </Text>

            <ScrollView contentContainerStyle={styles.form}>
                {/* Location Type */}
                <Text style={[styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('location_type')}
                </Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setLocationType(value);
                            setErrors(prev => ({ ...prev, locationType: '' }));
                        }}
                        items={dataObj?.LocationTypes || []}
                        value={locationType}
                        placeholder={{ label: t('select_location_type'), value: null }}
                        style={pickerStyles}
                    />
                </View>
                {errors.locationType && <Text style={styles.errorText}>{errors.locationType}</Text>}

                {/* Input Fields */}
                {[
                    { label: t('phone'), value: phone, setter: setPhone, key: 'phone', keyboardType: 'phone-pad', maxLength: 15 },
                    { label: t('email'), value: email, setter: setEmail, key: 'email', keyboardType: 'email-address', maxLength: 35 },
                    { label: t('street'), value: street, setter: setStreet, key: 'street', maxLength: 50 },
                    { label: t('city'), value: city, setter: setCity, key: 'city', maxLength: 20 },
                    { label: t('state'), value: state, setter: setState, key: 'state', maxLength: 20 },
                    { label: t('postal_code'), value: postalCode, setter: setPostalCode, key: 'postalCode', keyboardType: 'numeric', maxLength: 10 },
                    { label: t('country'), value: country, setter: setCountry, key: 'country', maxLength: 20 }
                ].map(({ label, value, setter, key, keyboardType, maxLength }) => (
                    <View key={key}>
                        <Text style={[styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>{label}</Text>
                        <TextInput
                            maxLength={maxLength}
                            style={styles.textInput}
                            placeholder={label}
                            value={value}
                            onChangeText={(text) => {
                                setter(text);
                                setErrors(prev => ({ ...prev, [key]: '' }));
                            }}
                            keyboardType={keyboardType || 'default'}
                        />
                        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
                    </View>
                ))}

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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        paddingHorizontal: wp(4),
        paddingBottom: wp(5),
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
        lineHeight: wp(6),
        marginHorizontal: wp(1),
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(0.2),
        backgroundColor: '#fff',
    },
    pickerWrapper: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        paddingHorizontal: wp(1),
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: 'center',
        marginBottom: wp(3),
    },
    button: {
        marginTop: wp(6),
        padding: wp(2),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: wp(3.5),
        marginTop: wp(1),
    },
    buttonText: {
        textAlign: 'center',
    },
});

const pickerStyles = {
    inputIOS: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: '#000',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#000',
    },
};

export default OfficeDetailForm;
