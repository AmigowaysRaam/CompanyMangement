import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
} from 'react-native';
import Modal from 'react-native-modal';
import { THEMECOLORS } from '../resources/colors/colors';
import { wp } from '../resources/dimensions';
import { useTranslation } from 'react-i18next';
import { Louis_George_Cafe } from '../resources/fonts';

const DepartmentModal = ({
    visible,
    onClose,
    onSave,
    initialName = '',
    initialStatus,
    isEditing = false,
    themeMode,
}) => {
    const { t } = useTranslation();
    const [departmentName, setDepartmentName] = useState(initialName);
    // Switch value: true = active(1), false = inactive(2)
    const [isActive, setIsActive] = useState(initialStatus === '1');
    const [departmentNameError, setDepartmentNameError] = useState('');

    useEffect(() => {
        setDepartmentName(initialName);
        setIsActive(initialStatus === '1');
        setDepartmentNameError('');
    }, [initialName, initialStatus, visible]);

    const handleSave = () => {
        if (!departmentName.trim()) {
            setDepartmentNameError(t('enter_department_name'));
            return;
        }
        setDepartmentNameError('');
        onSave({ departmentName: departmentName.trim(), status: isActive ? '1' : '2' });
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            avoidKeyboard={true}
            style={styles.modal}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[
                    styles.modalContent,
                    { backgroundColor: THEMECOLORS[themeMode].viewBackground },
                ]}
            >
                <Text
                    style={[
                        Louis_George_Cafe.bold.h5,
                        { marginBottom: wp(4), color: THEMECOLORS[themeMode].textPrimary },
                    ]}
                >
                    {isEditing ? t('edit_department') : t('create_department')}
                </Text>

                <TextInput
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                    placeholder={t('DepartmentName')}
                    value={departmentName}
                    onChangeText={(text) => {
                        setDepartmentName(text);
                        if (text.trim()) setDepartmentNameError('');
                    }}
                    style={[
                        styles.input,
                        {
                            color: THEMECOLORS[themeMode].textPrimary,
                            borderColor: departmentNameError
                                ? 'red'
                                : THEMECOLORS[themeMode].textPrimary,
                        },
                    ]}
                    autoFocus={true}
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                />
                {departmentNameError ? (
                    <Text style={styles.errorText}>{departmentNameError}</Text>
                ) : null}

                {/* Status Switch Toggle */}
                <View style={styles.statusSwitchContainer}>
                    <Text
                        style={{
                            fontSize: wp(4),
                            color: THEMECOLORS[themeMode].textPrimary,
                            marginRight: wp(4),
                            fontWeight: 'bold',
                        }}
                    >
                        {t('status')}
                    </Text>

                    <Switch
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        value={isActive}
                        onValueChange={setIsActive}
                        thumbColor={isActive ? THEMECOLORS[themeMode].primaryApp : '#f4f3f4'}
                        trackColor={{
                            false: '#ccc',
                            true: '#ccc',
                        }}
                    />
                </View>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                    >
                        <Text style={{ color: '#333', fontWeight: 'bold' }}>
                            {t('close')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.modalButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            {t('save')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: wp(5),
        borderRadius: wp(3),
        width: wp(90),
        borderWidth: wp(1),
        borderColor: '#CCC',
        paddingVertical: wp(6),
    },
    input: {
        borderWidth: 1,
        borderRadius: wp(2),
        padding: wp(3),
        fontSize: wp(4),
        marginBottom: wp(1),
    },
    errorText: {
        color: 'red',
        marginVertical: wp(4),
        fontSize: wp(3.5),
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: wp(4),
    },
    modalButton: {
        flex: 1,
        paddingVertical: wp(3),
        marginHorizontal: wp(1),
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: wp(4),
        justifyContent: "space-between",
        paddingHorizontal:wp(2)
    },
});

export default DepartmentModal;
