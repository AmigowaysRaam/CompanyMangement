import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';

const LogoutModal = ({ isVisible, onCancel }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        setTimeout(async () => {
            try {
                await AsyncStorage.clear();
                dispatch({ type: 'APP_USER_LOGIN_SUCCESS', payload: null });
                navigation.replace('LoginScreen');
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                setLoading(false);
            }
        }, 1000); // 1 second delay to enhance the transition
    };

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="slide"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={!loading ? onCancel : null}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            {loading ? (
                                <>
                                    <ActivityIndicator size="large" color="#013CA3" />
                                    <Text style={[Louis_George_Cafe.regular.h7, { marginTop: hp(2), lineHeight: wp(10) }]}>
                                        {t('logging_out') || 'Logging out...'}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={[Louis_George_Cafe.regular.h6, { marginBottom: hp(4) }]}>
                                        {t('confirm_logout_message')}
                                    </Text>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.button} onPress={handleLogout}>
                                            <Text style={styles.buttonText}>{t('yes')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                                            <Text style={[styles.buttonText, styles.cancelText]}>{t('no')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default LogoutModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: wp(6),
        borderTopLeftRadius: wp(8),
        borderTopRightRadius: wp(8),
        alignItems: 'center',
        width: '100%',
        borderColor: "#D8D8D8",
        borderTopWidth: wp(0.7),
        borderEndWidth: wp(0.1),
        borderStartWidth: wp(0.1),
        transform: [{ translateY: 0 }],
        opacity: 1,
      },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#013CA3',
        borderRadius: 8,
        alignItems: 'center',
        lineHeight: wp(4)
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    cancelText: {
        color: '#000',
    }
});
