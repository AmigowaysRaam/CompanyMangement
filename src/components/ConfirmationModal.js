import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';

const ConfirmationModal = ({ visible, message, onConfirm, onCancel }) => {
    
    const { themeMode,  } = useTheme();
    const colors = THEMECOLORS[themeMode];

    return (
        <Modal transparent visible={visible} animationType="none">
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { backgroundColor: colors.background || '#fff', borderColor: colors.border || '#ccc' }]}>
                            <Text style={[styles.message, { color: colors.textPrimary }]}>{message}</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.confirmBtn, { backgroundColor: colors.buttonBg || '#013CA3' }]}
                                    onPress={onConfirm}
                                >
                                    <Text style={[styles.confirmText,{
                                        color: colors.buttonText 
                                    }]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.confirmBtn, { backgroundColor: colors.tabInActive || '#013CA3' }]}
                                    onPress={onCancel}
                                >
                                    <Text style={[styles.cancelText, { color: colors.buttonText }]}>No</Text>
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
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        borderRadius: wp(4),
        padding: wp(5),
        width: wp(96),
        position: "absolute",
        bottom: wp(4),
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
