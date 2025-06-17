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
import { useDispatch } from 'react-redux';
import { updateClientDetails, updateContactInfo } from '../redux/authActions';

const ClientNotes = ({ onNext, cId, clientDetails, onRefresh }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });
    useEffect(() => {
        if (clientDetails?.notes?.length > 0) {
            setNotes(clientDetails.notes[0]?.note || '');
        }
    }, [clientDetails]);
    
    const onSubmit = () => {
        onRefresh();
        if (!notes.trim()) {
            setError(t('error_fill_all_fields'));
            ToastAndroid.show(t('error_check_fields'), ToastAndroid.SHORT);
            return;
        }

        const formData = {
            notes: [{ note: notes }],
            clientId: cId
          };

        setLoading(true);
        dispatch(
            updateClientDetails(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    navigation.goBack();
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(t('failed'), ToastAndroid.SHORT);
                }
            })
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                    {t('notes')}
                </Text>
                <TextInput
                    style={[styles.textInput, { height: hp(20), textAlignVertical: 'top' }]}
                    placeholder={t('placeholder_notes')}
                    value={notes}
                    onChangeText={(text) => {
                        setNotes(text);
                        setError('');
                    }}
                    multiline
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    // disabled={loading}
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
        paddingHorizontal: wp(4),
    },
    label: {
        fontWeight: '600',
        marginBottom: wp(2),
        marginTop: wp(2),
        lineHeight: wp(6),
        paddingHorizontal: wp(1),

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

export default ClientNotes;
