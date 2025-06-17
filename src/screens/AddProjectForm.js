import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ActivityIndicator,
    Button
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddProjectForm = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [projectName, setProjectName] = useState('');
    const [company, setCompany] = useState(null);
    const [client, setClient] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [status, setStatus] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [requirementFile, setRequirementFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const companies = [{ label: 'Company A', value: 'companyA' }];
    const clients = [{ label: 'Client A', value: 'clientA' }];
    const statusOptions = [{ label: 'In Progress', value: 'inProgress' }, { label: 'Completed', value: 'completed' }];
    const employees = [{ label: 'John Doe', value: 'john' }];
    const admins = [{ label: 'Admin A', value: 'adminA' }];

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const handleFilePick = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
        });
        if (result.type === 'success') {
            setRequirementFile(result);
        }
    };

    const onSubmit = () => {
        if (!projectName || !company || !client || !status || !employee || !admin || !requirementFile) {
            ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            ToastAndroid.show('Project Added Successfully', ToastAndroid.SHORT);
            navigation.goBack();
        }, 2000);
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title="Add Project" />
            <ScrollView contentContainerStyle={styles.form}>
                {/* Project Name */}
                <Text style={styles.label}>Project Name</Text>
                <TextInput
                    style={styles.textInput}
                    value={projectName}
                    onChangeText={setProjectName}
                    placeholder="Enter Project Name"
                />

                {/* Select Company */}
                <Text style={styles.label}>Select Company</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={setCompany}
                        items={companies}
                        style={pickerStyles}
                        placeholder={{ label: 'Choose Company', value: null }}
                        value={company}
                    />
                </View>

                {/* Select Client */}
                <Text style={styles.label}>Select Client</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={setClient}
                        items={clients}
                        style={pickerStyles}
                        placeholder={{ label: 'Choose Client', value: null }}
                        value={client}
                    />
                </View>

                {/* Dates (Start and End) */}
                <View style={styles.dateRow}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                        <Text style={styles.label}>Start Date</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
                            <Text>{formatDate(startDate)}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}
                    </View>

                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={styles.label}>End Date</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
                            <Text>{formatDate(endDate)}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) setEndDate(selectedDate);
                                }}
                            />
                        )}
                    </View>
                </View>

                {/* Status */}
                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={setStatus}
                        items={statusOptions}
                        style={pickerStyles}
                        placeholder={{ label: 'Select Status', value: null }}
                        value={status}
                    />
                </View>

                {/* PDF Upload */}
                <Text style={styles.label}>Requirement PDF</Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={handleFilePick}>
                    <Text>{requirementFile ? requirementFile.name : 'Upload PDF'}</Text>
                </TouchableOpacity>

                {/* Select Employee */}
                <Text style={styles.label}>Select Employee</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={setEmployee}
                        items={employees}
                        style={pickerStyles}
                        placeholder={{ label: 'Choose Employee', value: null }}
                        value={employee}
                    />
                </View>

                {/* Select Project Admin */}
                <Text style={styles.label}>Project Admin</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        onValueChange={setAdmin}
                        items={admins}
                        style={pickerStyles}
                        placeholder={{ label: 'Choose Admin', value: null }}
                        value={admin}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                            Submit
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
        padding: wp(5),
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: 'center',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    uploadBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#eee',
    },
    button: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const pickerStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
};

export default AddProjectForm;
