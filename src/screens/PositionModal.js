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
import DropdownModal from '../components/DropDownModal';
import { THEMECOLORS } from '../resources/colors/colors';
import { wp } from '../resources/dimensions';
import { useTranslation } from 'react-i18next';
import { Louis_George_Cafe } from '../resources/fonts';
import { getDepartMentList } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const PositionModal = ({
    visible,
    onClose,
    onSave,
    initialData = null,
    initialStatus = '1',
    setStatus,
    isEditing = false,
    themeMode,
    errorText,
    setErrorText,
}) => {
    const { t } = useTranslation();

    const [positionTitle, setPositionTitle] = useState('');
    const [positionCode, setPositionCode] = useState('');
    const [level, setLevel] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [isActive, setIsActive] = useState(initialStatus === '1');
    const [departmentList, setDepartmentList] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);

    useEffect(() => {
        if (initialData) {
            setPositionTitle(initialData.positionTitle || '');
            setPositionCode(initialData.positionCode || '');
            setLevel(initialData.Level || '');
            setDepartmentName(initialData.Department?.DepartmentName || '');
            setDepartmentId(initialData.Department?._id || '');
            setIsActive(initialData.Status === '1');
        } else {
            setPositionTitle('');
            setPositionCode('');
            setLevel('');
            setDepartmentName('');
            setDepartmentId('');
            setIsActive(initialStatus === '1');
        }
        setErrorText('');
    }, [initialData, initialStatus, visible]);

    const handleSave = () => {
        if (!positionTitle.trim()) {
            setErrorText(t('enter_position_title'));
            return;
        }

        if (!departmentId) {
            setErrorText(t('select_department'));
            return;
        }

        setErrorText('');
        const data = {
            positionTitle: positionTitle.trim(),
            positionCode: positionCode.trim(),
            Level: level.trim(),
            DepartmentName: departmentName,
            DepartmentId: departmentId,
        };
        onSave(data, isActive ? '1' : '2');
    };

    const fetchDepartmentData = () => {
        dispatch(
            getDepartMentList(userdata, (response) => {
                if (response.success) {
                    const transformed = response.data.map((item) => ({
                        label: item.DepartmentName,
                        value: item._id,
                    }));
                    setDepartmentList(transformed);
                }
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDepartmentData();
        }, [userdata])
    );

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
                        {
                            marginBottom: wp(4),
                            color: THEMECOLORS[themeMode].textPrimary,
                        },
                    ]}
                >
                    {isEditing ? t('edit_position') : t('create_position')}
                </Text>

                <TextInput
                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                    placeholder={t('position_title')}
                    value={positionTitle}
                    onChangeText={(text) => {
                        setPositionTitle(text);
                        if (text.trim()) setErrorText('');
                    }}
                    style={[
                        styles.input,
                        {
                            color: THEMECOLORS[themeMode].textPrimary,
                            borderColor: errorText ? 'red' : THEMECOLORS[themeMode].textPrimary,
                        },
                    ]}
                    autoFocus={true}
                    returnKeyType="next"
                />
                {errorText ? (
                    <Text style={styles.errorText}>{errorText}</Text>
                ) : null}

                <TextInput
                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                    placeholder={t('position_code')}
                    value={positionCode}
                    onChangeText={setPositionCode}
                    style={[
                        styles.input,
                        { color: THEMECOLORS[themeMode].textPrimary, borderColor: THEMECOLORS[themeMode].textPrimary },
                    ]}
                />

                <TextInput
                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                    placeholder={t('level')}
                    value={level}
                    onChangeText={setLevel}
                    style={[
                        styles.input,
                        { color: THEMECOLORS[themeMode].textPrimary, borderColor: THEMECOLORS[themeMode].textPrimary },
                    ]}
                />

                {/* Department Dropdown Trigger */}
                <TouchableOpacity
                    onPress={() => setDropdownVisible(true)}
                    style={[
                        styles.input,
                        {
                            justifyContent: 'center',
                            borderColor: THEMECOLORS[themeMode].textPrimary,
                            backgroundColor: 'transparent',
                        },
                    ]}
                >
                    <Text
                        style={{
                            color: departmentName
                                ? THEMECOLORS[themeMode].textPrimary
                                : '#999',
                            fontSize: wp(4),
                        }}
                    >
                        {departmentName || t('select_department')}
                    </Text>
                </TouchableOpacity>
                {/* Buttons */}
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                    >
                        <Text style={{ color: '#333', fontWeight: 'bold' }}>{t('close')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.modalButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('save')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Dropdown Modal */}
                <DropdownModal
                    visible={dropdownVisible}
                    items={departmentList}
                    onSelect={(item) => {
                        setDepartmentName(item.label);
                        setDepartmentId(item.value);
                        setDropdownVisible(false);
                        setErrorText('');
                    }}
                    onCancel={() => setDropdownVisible(false)}
                    title={t('select_department')}
                    selectedValue={departmentId}
                />
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
        marginBottom: wp(3),
    },
    errorText: {
        color: 'red',
        marginVertical: wp(2),
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
        justifyContent: 'space-between',
        paddingHorizontal: wp(2),
    },
});

export default PositionModal;
