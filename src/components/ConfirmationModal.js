import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';


const ConfirmationModal = ({ visible, message, onConfirm, onCancel }) => {

    const { themeMode, } = useTheme();
    const colors = THEMECOLORS[themeMode];
    const { t } = useTranslation();

    return (

        <Modal animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={visible}
            animationInTiming={100}       // Slower slide in
            // animationOutTiming={100}
            backdropTransitionOutTiming={0} // optional: avoids flicker
            useNativeDriver={true}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { backgroundColor: colors.cardBackground || '#fff', borderColor: colors.border || '#ccc' }]}>
                            <Text style={[styles.message, { color: colors.black }]}>{message}</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.confirmBtn, { backgroundColor: colors.buttonBg || '#013CA3' }]}
                                    onPress={onConfirm}
                                >
                                    <Text style={[styles.confirmText, {
                                        color: colors.buttonText
                                    }]}>{t('yes')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.confirmBtn, { backgroundColor: colors.tabInActive || '#013CA3' }]}
                                    onPress={onCancel}
                                >
                                    <Text style={[styles.cancelText, { color: colors.buttonText }]}>{t('no')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(100),
        alignSelf: "center"

    },
    container: {
        borderRadius: wp(4),
        padding: wp(5),
        width: wp(95),
        position: "absolute",
        bottom: wp(1),
        alignItems: "center",
        borderWidth: wp(0.3),
    },
    message: {
        fontSize: wp(4),
        marginBottom: hp(2),
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    confirmBtn: {
        width: wp(32),
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
        borderRadius: wp(2),
        alignItems: "center",
        marginHorizontal: wp(3),
    },
    cancelBtn: {
        width: wp(32),
        alignItems: "center",
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
        borderRadius: wp(2),
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelText: {
        fontWeight: 'bold',
    },
});
