import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Louis_George_Cafe } from '../resources/fonts';
import { createTaskForm, getTaskDeytails, levaeFormSubmit, updateTaskForm } from '../redux/authActions';
import SearchSelectScreen from './SearchSelectScreen';
import SearchSelectProjectScreen from './SearchSelectProjectScreen';

const CreateTask = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const route = useRoute();
    const { taskId } = route.params || {};  // safely access taskId

    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [project, setProject] = useState(null);
    const [client, setClient] = useState(null);
    const [company, setCompany] = useState(null);
    const [status, setStatus] = useState(null);
    const [priority, setPriority] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [selectDropDown, setselectDropDown] = useState(false);
    const [selectProjectDropDown, setSelectProjectDropDown] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const statusOptions = [
        { label: t('active'), value: 1 },
        { label: t('inactive'), value: 0 },
    ];

    const priorityOptions = [
        { label: t('low'), value: 'Low' },
        { label: t('medium'), value: 'Medium' },
        { label: t('high'), value: 'High' },
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!taskTitle.trim()) newErrors.taskTitle = t('taskTitleRequired');
        if (!description.trim()) newErrors.description = t('descriptionRequired');
        if (!startDate) newErrors.startDate = t('startDateRequired');
        if (!endDate) newErrors.endDate = t('endDateRequired');
        if (!employee || employee.length === 0) newErrors.employee = t('employeeRequired');
        if (!project) newErrors.project = t('projectRequired');
        if (!project?.client?._id) newErrors.client = t('clientRequired');
        if (!project?.company?._id) newErrors.company = t('companyRequired');
        if (!status) newErrors.status = t('statusRequired');
        if (!priority) newErrors.priority = t('priorityRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // alert(taskId)
        setErrors({})
    }, [taskTitle, description, startDate, endDate, employee, project, status, priority])

    const onSubmit = () => {
        if (!validateForm()) return;
        const baseData = {
            title: taskTitle,
            description,
            startDate,
            endDate,
            employee: employee.id,  // single employee ID
            project: project?._id,
            client: project?.client?._id,
            companyId: project?.company?._id,
            status,
            priority,
            luser: userdata?.id,
        };
        // alert(JSON.stringify(baseData?.employee))
        setLoading(true);
        if (taskId) {
            dispatch(
                updateTaskForm(
                    { ...baseData, id: taskId },
                    (response) => {
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                        if (response.success) {
                            navigation.goBack();
                        }
                    }
                )
            );
        } else {
            dispatch(
                createTaskForm(
                    baseData,
                    (response) => {
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                        if (response.success) {
                            navigation.goBack();
                        }
                    }
                )
            );
        }
    };





    useEffect(() => {
        setLoading(true);
        const formData = {
            id: taskId
        };
        dispatch(
            getTaskDeytails(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    const task = response.data[0]; // assuming response.data holds the task object
                    console.log(task.project)
                    setTaskTitle(task.title || '');
                    console.log(task)
                    setDescription(task.description || '');
                    setStartDate(task.startDate ? new Date(task.startDate) : new Date());
                    setEndDate(task.endDate ? new Date(task.endDate) : new Date()); // If you have endDate in your data, else set as needed
                    setEmployee(task.employee);
                    setProject(task.project || null);
                    setClient(task.project?.client || null);
                    setCompany(task.company || null);
                    setStatus(task.status || null);
                    setPriority(task.priority || null);

                }
            })
        );
    }, [taskId]);


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            {selectDropDown ? (
                <SearchSelectScreen
                    selectedEIds={employee}
                    onClose={(selectedIDs) => {
                        console.log(selectedIDs)
                        setEmployee(selectedIDs);
                        setselectDropDown(false);
                    }}
                />
            ) : selectProjectDropDown ? (
                <SearchSelectProjectScreen
                    selectedProjectId={project}
                    onClose={(selectedProject) => {
                        setProject(selectedProject);
                        // console.log(JSON.stringify(selectedProject))
                        setSelectProjectDropDown(false);
                        setClient(selectedProject?._id);
                        setCompany(selectedProject?._id);
                    }}
                />
            ) : (
                <>
                    <HeaderComponent showBackArray={true} title={taskId ? t('update_task') : t('create_task')} />
                    {
                        loading ?
                            <ActivityIndicator></ActivityIndicator>
                            :
                            <ScrollView contentContainerStyle={styles.form}>
                                {/* Task Title */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('taskTitle')}
                                </Text>
                                <TextInput
                                    maxLength={20}
                                    style={styles.textInput}
                                    placeholder={t('taskTitlePlaceholder')}
                                    value={taskTitle}
                                    onChangeText={setTaskTitle}
                                />
                                {errors.taskTitle && <Text style={styles.errorText}>{errors.taskTitle}</Text>}


                                {/* Description */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('description')}
                                </Text>
                                <TextInput
                                    maxLength={100}

                                    style={[styles.textInput, { height: hp(12), textAlignVertical: 'top' }]}
                                    placeholder={t('descriptionPlaceholder')}
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                />
                                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}


                                {/* Date Pickers */}
                                <View style={styles.datesRow}>
                                    <View style={styles.dateContainer}>
                                        <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                            {t('startDate')}
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                                            <Text>{formatDate(startDate)}</Text>
                                        </TouchableOpacity>
                                        {showStartPicker && (
                                            <DateTimePicker
                                                value={startDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    setShowStartPicker(Platform.OS === 'ios');
                                                    if (selectedDate) setStartDate(selectedDate);
                                                }}
                                            />
                                        )}
                                        {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}

                                    </View>
                                    <View style={styles.dateContainer}>
                                        <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                            {t('endDate')}
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                                            <Text>{formatDate(endDate)}</Text>
                                        </TouchableOpacity>
                                        {showEndPicker && (
                                            <DateTimePicker
                                                value={endDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    setShowEndPicker(Platform.OS === 'ios');
                                                    if (selectedDate) setEndDate(selectedDate);
                                                }}
                                            />
                                        )}
                                        {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
                                    </View>
                                </View>
                                {/* Employee Selection */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('employee')}
                                </Text>
                                <TouchableOpacity onPress={() => setselectDropDown(true)} style={styles.pickerWrapper}>
                                    <Text style={{ fontSize: 16 }}>{employee.length != 0 ? `${employee?.name != '' || '' ? employee?.name : ''}` : t('selectEmployee')}</Text>
                                </TouchableOpacity>
                                {/* {employee.length > 0 && (
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10 }}>
                                        {employee.map((emp) => (
                                            <View key={emp.id} style={styles.selectedItemContainer}>
                                                <Text style={Louis_George_Cafe.regular.h9}>{emp.name}</Text>
                                                <TouchableOpacity onPress={() => setEmployee(prev => prev.filter(e => e.id !== emp.id))}>
                                                    <Text style={styles.removeIcon}>✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )} */}
                                {errors.employee && <Text style={styles.errorText}>{errors.employee}</Text>}
                                {/* Project Selection */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('project')}
                                </Text>
                                <TouchableOpacity onPress={() => setSelectProjectDropDown(true)} style={styles.pickerWrapper}>
                                    <Text style={{ fontSize: 16 }}>
                                        {project ? `${project.name} (${project.clientName || ''})` : t('selectProject')}
                                    </Text>
                                </TouchableOpacity>
                                {errors.project && <Text style={styles.errorText}>{errors.project}</Text>}
                                {/* Client */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('client')}
                                </Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: '#f9f9f9' }]}>
                                    <Text style={{ fontSize: 16 }}>
                                        {project?.client?.name || t('selectProjectFirst')}
                                    </Text>
                                </View>
                                {errors.client && <Text style={styles.errorText}>{errors.client}</Text>}
                                {/* <Text>{JSON.stringify(project?.company?.company_name )}</Text> */}
                                {/* Company */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('company')}
                                </Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: '#f9f9f9' }]}>
                                    <Text style={{ fontSize: 16 }}>
                                        {project?.company?.company_name || t('selectProjectFirst')}
                                    </Text>
                                </View>
                                {/* <Text style={{ fontSize: 16 }}>
                                        {JSON.stringify(project)}
                                    </Text> */}
                                {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}
                                {/* Status */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('status')}
                                </Text>
                                <View style={styles.pickerWrapper}>
                                    <RNPickerSelect
                                        onValueChange={setStatus}
                                        items={statusOptions}
                                        style={pickerStyles}
                                        placeholder={{ label: t('selectStatus'), value: null }}
                                        value={status}
                                    />
                                </View>
                                {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
                                {/* Priority */}
                                <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                    {t('priority')}
                                </Text>
                                <View style={styles.pickerWrapper}>
                                    <RNPickerSelect
                                        onValueChange={setPriority}
                                        items={priorityOptions}
                                        style={pickerStyles}
                                        placeholder={{ label: t('selectPriority'), value: null }}
                                        value={priority}
                                    />
                                </View>
                                {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}

                                {/* Submit */}
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                                    onPress={onSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                                    ) : (
                                        <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                                            {taskId ? t('update') : t('submit')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
                    }
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        margin: 4,
    },
    form: {
        padding: wp(5),
    },
    selectedItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
        marginBottom: 8,
    },
    removeIcon: {
        fontSize: 12,
        color: '#ff0000',
        marginLeft: wp(2),
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
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateContainer: {
        width: '48%',
    },
    button: {
        marginTop: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    pickerWrapper: {
        borderWidth: wp(0.3),
        borderColor: '#ccc',
        paddingHorizontal: wp(1),
        borderRadius: wp(2),
        backgroundColor: '#fff',
        height: hp(6),
        justifyContent: 'center',
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

export default CreateTask;