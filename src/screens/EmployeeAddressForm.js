import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,ScrollView,Text, TextInput, TouchableOpacity,ToastAndroid,ActivityIndicator,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch } from 'react-redux';
import { updateClientDetails, updateEmployeeById } from '../redux/authActions';

const EmployeeAddressForm = ({ onNext, cId, onRefresh, clientDetails, empDetails }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useEffect(() => {
        // alert(JSON.stringify(empDetails,null,2))
        const location = empDetails;
        if (location) {
            setAddress(location?.address_head_office || '');
            setCity(location?.city || '');
            setState(location.state_province || '');
            setPincode(location.postal_zip_code || '');
        }
    }, [clientDetails]);

    const validateFields = () => {
        const newErrors = {};
        if (!address.trim()) newErrors.address = t('enter_street');
        if (!city.trim()) newErrors.city = t('enter_city');
        if (!state.trim()) newErrors.state = t('enter_state');
        if (!pincode.trim()) newErrors.pincode = t('enter_postal');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {
        if (!validateFields()) return;
        const formData = {
            address_head_office:address,
            city:city,
            state_province:state,
            postal_zip_code:pincode,
            employeeId: empDetails._id
        };

        setLoading(true);
        dispatch(
            updateEmployeeById(formData, (response) => {
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
                {[
                    { label: t('Street'), value: address, setter: setAddress, key: 'address', maxLength: 30 },
                    { label: t('City'), value: city, setter: setCity, key: 'city', maxLength: 15 },
                    { label: t('State'), value: state, setter: setState, key: 'state', maxLength: 15 },
                    { label: t('Pincode'), value: pincode, setter: setPincode, key: 'pincode', keyboardType: 'numeric', maxLength: 8 }
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
                        <ActivityIndicator color={THEMECOLORS[themeMode].textPrimary} />
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

export default EmployeeAddressForm;
