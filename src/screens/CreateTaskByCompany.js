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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Louis_George_Cafe } from '../resources/fonts';
import { createTaskForm, getTaskDeytails, updateTaskForm } from '../redux/authActions';
import SearchSelectScreen from './SearchSelectScreen';
import SearchSelectProjectScreen from './SearchSelectProjectScreen';
import DropdownModal from '../components/DropDownModal';

const CreateTaskByCompany = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);
    const route = useRoute();
    const { taskId,data } = route.params || {};  // safely access taskId

    // Modal DropDown
    const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
    const [priorityDropdownVisible, setPriorityDropdownVisible] = useState(false);
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
        if (!status) newErrors.status = t('statusRequired');
        if (!priority) newErrors.priority = t('priorityRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // alert(JSON.stringify(data))
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
            project: data?._id,
            client: data?.client?._id,
            companyId: data?.company?._id,
            status,
            priority,
            luser: userdata?.id,
        };
        // alert(JSON.stringify(baseData))
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
        setLoading(false);

    };

    useEffect(() => {
        if (taskId) {
            setLoading(true);
            const formData = {
                id: taskId,
                userid: userdata?.id,
            };
            dispatch(
                getTaskDeytails(formData, (response) => {
                    setLoading(false);
                    // alert(JSON.stringify(response))
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
                    else {
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);

                    }
                })
            );
        }
    }, [taskId]);


    const renderStaticMapItem = () => {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
            <View style={{ marginTop: wp(0) }}>
                <View
                    key={index}
                    style={{
                        backgroundColor: themeMode === 'dark' ? "#222" : "#f1f1f1",
                        width: wp(90),
                        height: hp(6),
                        borderRadius: wp(3),
                        alignSelf: "center",
                        marginVertical: wp(4),
                    }}
                />
            </View>
        ));
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            {selectDropDown ? (
                <SearchSelectScreen
                    selectedEIds={employee}
                    onClose={(selectedIDs) => {
                        // console.log(selectedIDs)
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
                            <>{renderStaticMapItem()}</>
                            :
                            <>
                                <ScrollView contentContainerStyle={styles.form}>
                                    {/* Task Title */}
                                    <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {t('taskTitle')}
                                    </Text>
                                    <TextInput
                                        maxLength={40}
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
                                    {errors.employee && <Text style={styles.errorText}>{errors.employee}</Text>}
                                    {/* Status */}
                                    <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {t('status')}
                                    </Text>

                                    <View style={styles.pickerWrapper}>
                                        <TouchableOpacity
                                            style={[{
                                                paddingHorizontal: wp(2)
                                            }]}
                                            onPress={() => setStatusDropdownVisible(true)}
                                        >
                                            <Text style={[Louis_George_Cafe.regular.h7, {
                                                textTransform: "capitalize"
                                            }]}>
                                                {
                                                    status
                                                        ? statusOptions.find(item => item.value === status)?.label
                                                        : t('selectStatus')
                                                }
                                            </Text>
                                        </TouchableOpacity>

                                        <DropdownModal
                                            visible={statusDropdownVisible}
                                            items={statusOptions}
                                            onSelect={(item) => {
                                                setStatus(item.value);
                                                setStatusDropdownVisible(false);
                                            }}
                                            onCancel={() => setStatusDropdownVisible(false)}
                                            title={t('selectStatus')}
                                        />
                                    </View>
                                    {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}

                                    {/* Priority */}
                                    <Text style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {t('priority')}
                                    </Text>

                                    <View style={styles.pickerWrapper}>
                                        <TouchableOpacity
                                            style={{
                                                paddingHorizontal: wp(2)
                                            }}
                                            onPress={() => setPriorityDropdownVisible(true)}
                                        >
                                            <Text style={{ textTransform: "capitalize" }}>
                                                {
                                                    priority
                                                        ? priorityOptions.find(item => item.value === priority)?.label
                                                        : t('selectPriority')
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                        <DropdownModal
                                            visible={priorityDropdownVisible}
                                            items={priorityOptions}
                                            onSelect={(item) => {
                                                setPriority(item.value);
                                                setPriorityDropdownVisible(false);
                                            }}
                                            onCancel={() => setPriorityDropdownVisible(false)}
                                            title={t('selectPriority')}
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
                                            <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText, textTransform: "capitalize" }]}>
                                                {taskId ? t('update') : t('submit')}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </ScrollView>

                            </>
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
    pickerWrapper: {
        marginVertical: hp(1),
    },
    pickerTouchable: {
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        borderWidth: wp(0.3),
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




export default CreateTaskByCompany;