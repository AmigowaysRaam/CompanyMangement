import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { updateContactInfo } from '../redux/authActions';
import { useDispatch } from 'react-redux';

const ContactStep = ({ onNext, setCurrentStep, currentStep, cId, companyDetails,
    onRefresh
}) => {

    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();


    // Form fields
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);

    // Error states
    const [phoneError, setPhoneError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [postcodeError, setPostcodeError] = useState('');
    const [stateError, setStateError] = useState('');
    const [countryError, setCountryError] = useState('');

    // Detect if language is Tamil
    const isTamil = i18n.language === 'ta';
    useEffect(() => {
        console.log(companyDetails)
        if (companyDetails) {
            setPhone(companyDetails.phone || '');
            setMobile(companyDetails.mobile || '');
            setAddress(companyDetails.address || '');
            setCity(companyDetails.city || '');
            setPostcode(companyDetails.postal_code || '');
            setState(companyDetails.state || '');
            setCountry(companyDetails.country || '');
        }
    }, [companyDetails]);


    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const validate = () => {
        let valid = true;

        // Reset errors
        setPhoneError('');
        setMobileError('');
        setAddressError('');
        setCityError('');
        setPostcodeError('');
        setStateError('');
        setCountryError('');

        // Phone validation (simple length check or regex)
        if (!phone.trim()) {
            setPhoneError(t('error_phone_required'));
            valid = false;
        } else if (!/^\+?[0-9]{7,15}$/.test(phone.trim())) {
            setPhoneError(t('error_phone_invalid'));
            valid = false;
        }

        // Mobile validation
        if (!mobile.trim()) {
            setMobileError(t('error_mobile_required'));
            valid = false;
        } else if (!/^\+?[0-9]{7,15}$/.test(mobile.trim())) {
            setMobileError(t('error_mobile_invalid'));
            valid = false;
        }

        // Address validation
        if (!address.trim()) {
            setAddressError(t('error_address_required'));
            valid = false;
        }

        // City validation
        if (!city.trim()) {
            setCityError(t('error_city_required'));
            valid = false;
        }

        // Postcode validation (numeric and length between 3-10)
        if (!postcode.trim()) {
            setPostcodeError(t('error_postcode_required'));
            valid = false;
        } else if (!/^[0-9]{3,10}$/.test(postcode.trim())) {
            setPostcodeError(t('error_postcode_invalid'));
            valid = false;
        }

        // State validation
        if (!state.trim()) {
            setStateError(t('error_state_required'));
            valid = false;
        }

        // Country validation
        if (!country.trim()) {
            setCountryError(t('error_country_required'));
            valid = false;
        }

        return valid;
    };

    const onSubmit = () => {
        if (!validate()) {
            ToastAndroid.show(t('error_fill_all_fields_correctly'), ToastAndroid.SHORT);
            return;
        }
        setLoading(true);
        const formData = {
            _id: cId,
            phone: phone,
            mobile: mobile,
            address: address,
            city: city,
            postal_code: postcode,  // renamed from postcode to postal_code
            state: state,
            country: country
        };

        dispatch(
            updateContactInfo(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    onNext();
                    onRefresh();
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
                }
            })
        );
        ToastAndroid.show(t('contact_info_submitted'), ToastAndroid.SHORT);
    };

    useEffect(() => {
        // alert(cId);
    }, [])

    return (
        <View  style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text
                style={[
                    Louis_George_Cafe.bold.h2,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        alignSelf: "center",
                        textTransform: "capitalize",
                        lineHeight: wp(5),
                        fontSize: wp(4),
                    }
                ]}
            >
                {t('contact_title')}
            </Text>
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_phone')}
                </Text>
                <TextInput
                    maxLength={10}
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_phone')}
                    value={phone}
                    onChangeText={(text) => {
                        setPhone(text);
                        if (phoneError) setPhoneError('');
                    }}
                    keyboardType="phone-pad"
                />
                {!!phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_mobile')}
                </Text>
                <TextInput
                    maxLength={10}
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_mobile')}
                    value={mobile}
                    onChangeText={(text) => {
                        setMobile(text);
                        if (mobileError) setMobileError('');
                    }}
                    keyboardType="phone-pad"
                />
                {!!mobileError && <Text style={styles.errorText}>{mobileError}</Text>}

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_address')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_address')}
                    value={address}
                    onChangeText={(text) => {
                        setAddress(text);
                        if (addressError) setAddressError('');
                    }}
                    multiline
                />
                {!!addressError && <Text style={styles.errorText}>{addressError}</Text>}

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_city')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_city')}
                    value={city}
                    onChangeText={(text) => {
                        setCity(text);
                        if (cityError) setCityError('');
                    }}
                />
                {!!cityError && <Text style={styles.errorText}>{cityError}</Text>}

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_postcode')}
                </Text>
                <TextInput
                    maxLength={7}
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_postcode')}
                    value={postcode}
                    onChangeText={(text) => {
                        setPostcode(text);
                        if (postcodeError) setPostcodeError('');
                    }}
                    keyboardType="numeric"
                />
                {!!postcodeError && <Text style={styles.errorText}>{postcodeError}</Text>}

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_state')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_state')}
                    value={state}
                    onChangeText={(text) => {
                        setState(text);
                        if (stateError) setStateError('');
                    }}
                />
                {!!stateError && <Text style={styles.errorText}>{stateError}</Text>}

                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    styles.label,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(3.5) : wp(4.2),
                        lineHeight: wp(5)
                    }
                ]}>
                    {t('contact_country')}
                </Text>
                <TextInput
                    style={[styles.textInput, { fontSize: isTamil ? wp(3.5) : wp(4) }]}
                    placeholder={t('placeholder_country')}
                    value={country}
                    onChangeText={(text) => {
                        setCountry(text);
                        if (countryError) setCountryError('');
                    }}
                />
                {!!countryError && <Text style={styles.errorText}>{countryError}</Text>}

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
                            { color: THEMECOLORS[themeMode].buttonText, lineHeight: wp(5) }
                        ]}>
                            {t('button_submit')}
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
        padding: wp(3)
    },
    label: {
        marginVertical: wp(2),
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(1),
        backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(6),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: {},
    errorText: {
        color: 'red',
        fontSize: wp(3.2),
        marginTop: wp(0.5),
        marginBottom: wp(1),
        marginHorizontal: wp(2)
    },
});

export default ContactStep;
