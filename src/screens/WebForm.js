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
    Platform
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
import { updateContactInfo } from '../redux/authActions';

const WebForm = ({ onNext, setCurrentStep, currentStep, dataObj, cId, companyDetails,
    onRefresh
 }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [domainName, setDomainName] = useState('');
    const [domainProvider, setDomainProvider] = useState(null);
    const [sslProvider, setSslProvider] = useState('');
    const [loading, setLoading] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        domainName: '',
        domainProvider: '',
        sslProvider: ''
    });

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useEffect(() => {
        if (companyDetails && dataObj?.domainprovider?.length > 0) {
            setDomainName(companyDetails.domain_name || '');
            setSslProvider(companyDetails.ssl_provider || '');
    
            // Match domain provider from list
            const matchedDomainProvider = dataObj.domainprovider.find(
                (item) => item.value.toLowerCase() === companyDetails.domain_provider?.toLowerCase()
            )?.value || null;
    
            setDomainProvider(matchedDomainProvider);
        }
    }, [companyDetails, dataObj?.domainprovider]);
    
    const onSubmit = () => {
        onRefresh();

        const newErrors = {
            domainName: domainName ? '' : t('error_fill_all_fields'),
            domainProvider: domainProvider ? '' : t('error_fill_all_fields'),
            sslProvider: sslProvider ? '' : t('error_fill_all_fields')
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(err => err !== '');
        if (hasError) {
            ToastAndroid.show(t('error_check_fields'), ToastAndroid.SHORT);
            return;
        }

        const formData = {
            domain_name: domainName,
            domain_provider: domainProvider,
            ssl_provider: sslProvider,
            _id: cId
        };
        setLoading(true);
        dispatch(
            updateContactInfo(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    onNext();
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(t('failed'), ToastAndroid.SHORT);
                }
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text style={[Louis_George_Cafe.bold.h2, { color: THEMECOLORS[themeMode].textPrimary, alignSelf: "center", textTransform: "capitalize", lineHeight: wp(8) }]}>
                {t('web_title')}
            </Text>
            <ScrollView contentContainerStyle={styles.form}>
                {/* Domain Name */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('web_domain_name')}
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={t('placeholder_domain_name')}
                    value={domainName}
                    onChangeText={(text) => {
                        setDomainName(text);
                        setErrors(prev => ({ ...prev, domainName: '' }));
                    }}
                    autoCapitalize="none"
                />
                {errors.domainName ? <Text style={styles.errorText}>{errors.domainName}</Text> : null}

                {/* Domain Provider */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('web_domain_provider')}
                </Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setDomainProvider(value);
                            setErrors(prev => ({ ...prev, domainProvider: '' }));
                        }}
                        items={dataObj?.domainprovider}
                        value={domainProvider}
                        placeholder={{ label: t('placeholder_select_provider'), value: null }}
                        style={pickerStyles}
                    />
                </View>
                {errors.domainProvider ? <Text style={styles.errorText}>{errors.domainProvider}</Text> : null}

                {/* SSL Provider */}
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('web_ssl_provider')}
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={t('placeholder_ssl_provider')}
                    value={sslProvider}
                    onChangeText={(text) => {
                        setSslProvider(text);
                        setErrors(prev => ({ ...prev, sslProvider: '' }));
                    }}
                    autoCapitalize="none"
                />
                {errors.sslProvider ? <Text style={styles.errorText}>{errors.sslProvider}</Text> : null}

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
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
    },
    form: {
        paddingHorizontal: wp(2)
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
        lineHeight: wp(6)
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(1),
        backgroundColor: '#fff',
    },
    pickerWrapper: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        paddingHorizontal: wp(1),
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: "center",
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

export default WebForm;
