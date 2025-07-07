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
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { createNewClient, updateClientDetails } from '../redux/authActions';

const ClientBasicDetails = ({ onNext, onSubmitSuccess, cId, onRefresh, clientDetails }) => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const dispatch = useDispatch();

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [altNumber, setAltNumber] = useState('');
    const [website, setWebsite] = useState('');
    const [industry, setIndustry] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Helper components
    const Label = ({ title }) => (
        <Text style={[styles.label, Louis_George_Cafe.bold.h6, {
            color: THEMECOLORS[themeMode].textPrimary
        }]}>{title}</Text>
    );

    // Bind data on mount
    useEffect(() => {
        if (clientDetails) {
            setName(clientDetails?.name || '');
            setEmail(clientDetails?.email || '');
            setPhoneNumber(clientDetails?.officeLocations?.[0]?.phone || '');
            setAltNumber('');
            setWebsite(clientDetails?.website || '');
            setIndustry(clientDetails?.industry || '');
            setCompanyName(clientDetails?.companyName || '');
        }
    }, [clientDetails]);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => /^[0-9]{7,}$/.test(phone);

    const validateFields = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = t('enterName');
        if (!email.trim() || !isValidEmail(email)) newErrors.email = t('enterValidEmail');
        if (!phoneNumber.trim() || !isValidPhone(phoneNumber)) newErrors.phoneNumber = t('enterValidPhone');
        if (altNumber.trim() && !isValidPhone(altNumber)) newErrors.altNumber = t('enterValidAltNumber');
        if (!companyName.trim()) newErrors.companyName = t('enterCompanyName');
        if (!industry.trim()) newErrors.industry = t('enterIndustry');

        // Only require password for new client creation
        if (!clientDetails?._id && !password.trim()) {
            newErrors.password = t('enterPassword');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {
        if (!validateFields()) return;

        const formData = {
            luserid: userdata?.id,
            name,
            email,
            phone_number: phoneNumber,
            alternate_number: altNumber,
            website,
            industry,
            companyName,
        };

        // Only add password for new clients
        if (!clientDetails?._id && password) {
            formData.password = password;
        }

        setLoading(true);

        const callback = (response) => {
            setLoading(false);
            if (response.success) {
                onRefresh();
                const newClientId = response?.data?._id;
                onSubmitSuccess(newClientId);
                onNext();
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(t('submissionFailed'), ToastAndroid.SHORT);
            }
        };

        if (clientDetails?._id) {
            formData.clientId = clientDetails._id;
            dispatch(updateClientDetails(formData, callback));
        } else {
            dispatch(createNewClient(formData, callback));
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
                {t('ClientBasicDetails')}
            </Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <Label title={t('name')} />
                <Input value={name} onChange={setName} error={errors.name} placeholder={t('enterName')} />

                <Label title={t('companyName')} />
                <Input value={companyName} onChange={setCompanyName} error={errors.companyName} placeholder={t('enterCompanyName')} />

                <Label title={t('email')} />
                <Input value={email} onChange={setEmail} error={errors.email} placeholder={t('enterEmail')} keyboardType="email-address" />

                <Label title={t('phoneNumber')} />
                <Input value={phoneNumber} onChange={setPhoneNumber} error={errors.phoneNumber} placeholder={t('enterPhoneNumber')} keyboardType="phone-pad" maxLength={10} />

                <Label title={t('alternateNumber')} />
                <Input value={altNumber} onChange={setAltNumber} error={errors.altNumber} placeholder={t('enterAlternateNumber')} keyboardType="phone-pad" />

                <Label title={t('website')} />
                <Input value={website} onChange={setWebsite} placeholder={t('enterWebsite')} autoCapitalize="none" />

                <Label title={t('industry')} />
                <Input value={industry} onChange={setIndustry} error={errors.industry} placeholder={t('enterIndustry')} />

                {/* Password Field - Only shown when creating */}
                {!clientDetails?._id && (
                    <>
                        <Label title={t('password')} />
                        <Input
                            value={password}
                            onChange={setPassword}
                            error={errors.password}
                            placeholder={t('enterPassword')}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </>
                )}

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

const Input = ({ value, onChange, error, placeholder, maxLength, keyboardType = 'default', autoCapitalize = 'sentences', secureTextEntry = false }) => (
    <>
        <TextInput
            maxLength={maxLength}
            style={styles.textInput}
            value={value}
            onChangeText={(text) => onChange(text)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: wp(4),
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
        fontSize: wp(5),
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: wp(3.2),
        marginHorizontal: wp(2),
    },
});

export default ClientBasicDetails;
