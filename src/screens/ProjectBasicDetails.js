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
import SelectMultipleEmp from './SelectMultipleTeam';
import SearchSelectScreen from './SearchSelectScreen';
import SearchSelectClient from './SearchSelectClient';
import DropdownModal from '../components/DropDownModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getProjectDetailById, submitProjectBasicDetails, updateProjectCost } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import SearchSelectCompany from './SearchSelectCompany copy';

const ProjectBasicDetails = ({ onNext, onSubmitSuccess, onRefresh, projectId, projectDetails }) => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [status, setStatus] = useState(null);
    const [priority, setPriority] = useState('');
    const [projectAdmins, setProjectAdmins] = useState(null);
    const [projectStatus, setProjectStatus] = useState('');
    const [selectDropDown, setselectDropDown] = useState(false);
    const [clientDropDown, setOpenClientDropDown] = useState(false);
    const [cleint, setClient] = useState(null);
    const userdata = useSelector((state) => state.auth.user?.data);
    const [description, setdescription] = useState('');



    const [companyDropDown, setCompanyDropDown] = useState(false);
    const [company, setcompany] = useState(null);

    const [employee, setEmployee] = useState([]);
    const [selectAdminDropDown, setselectAdminDropDown] = useState(false);
    const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
    const [priorityDropdownVisible, setPriorityDropdownVisible] = useState(false);
    const [projectStatusArrShow, setShowprojectStatusDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [tags, setTags] = useState([]);
    const [inputText, setInputText] = useState('');


    const handleInputChange = (text) => {
        setInputText(text);
        // Check if the last character is a space
        if (text.endsWith(' ')) {
            const newTag = text.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags((prevTags) => [...prevTags, newTag]);
            }
            setInputText('');
        }
    };
    const removeTag = (index) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    const fetchCompanyData = () => {
        // setLoading(true)
        // alert( JSON.stringify(projectDetails?_id))
        if (projectId != null) {
            dispatch(
                getProjectDetailById(projectId?.id || projectDetails._id, (response) => {
                    if (response.success) {
                        const project = response.data;
                        // console.log(JSON.stringify(project))
                        setProjectName(project.projectName || '');
                        setStartDate(project.startDate ? new Date(project.startDate) : new Date());
                        setEndDate(project.endDate ? new Date(project.endDate) : new Date());
                        setStatus(project.status);
                        setPriority(project.priority || '');
                        setProjectStatus(project.projectStatus || '');
                        setClient(project?.client)
                        setcompany(project?.company)
                        setdescription(project?.description)
                        // alert(JSON.stringify(project.company))
                        // Set tags (technology array)
                        if (Array.isArray(project.technology)) {
                            const tagLabels = project.technology.map(t => t.label || t);
                            setTags(tagLabels);
                        }

                        // Team members
                        if (Array.isArray(project.teamMembers)) {
                            const members = project.teamMembers.map(emp => ({
                                id: emp._id,
                                name: emp.full_name,
                                email: emp.email,
                                phone: emp.phone,
                            }));
                            setEmployee(members);
                        }
                        // Admins (assuming empty in your example, handle accordingly if data available)
                        if (project.projectAdmins && project.projectAdmins.length > 0) {
                            const admin = project.projectAdmins[0]; // assuming single admin
                            setProjectAdmins({
                                id: admin._id,
                                name: admin.full_name || admin.username || 'Admin',
                            });
                        }
                        setLoading(false)
                    }
                })
            );
        }
    };


    useEffect(() => {
        // alert(JSON.stringify(projectDetails))
        fetchCompanyData();
    }, [])

    useEffect(() => {
    }, [])


    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const statusOptions = [
        { label: t('active'), value: 1 },
        { label: t('inactive'), value: 0 },
    ];
    const priorityOptions = [
        { label: t('low'), value: 'Low' },
        { label: t('medium'), value: 'Medium' },
        { label: t('high'), value: 'High' },
    ];

    const projectStatusArr = [

        { label: t('pending'), value: 'Pending' },
        { label: t('inprogres'), value: 'In Progress' },
        { label: t('completed'), value: 'Completed' },
    ]
    const validateFields = () => {
        const newErrors = {};
        if (typeof projectName !== 'string' || !projectName.trim()) {
            newErrors.projectName = t('enterProjectName');
        }
        if (status === undefined || status === null || status === '') {
            newErrors.status = t('selectStatus');
        }
        if (!priority) newErrors.priority = t('selectPriority');
        if (!projectStatus) newErrors.projectStatus = t('selectProjectStatus');
        // if (!technologyField) newErrors.technologyField = t('enterTechnology');
        if (!employee || employee.length == 0) newErrors.employee = t('employeeRequired');
        if (!projectAdmins) newErrors.admin = t('adminRequired');
        if (!cleint) newErrors.cleint = t('cleintRequired');
        if (!company) newErrors.company = t('companyRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const dispatch = useDispatch();

    const onSubmit = () => {
        if (!validateFields()) return;
        if (projectId) {
            const formData = {
                projectName: projectName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status,
                priority,
                projectStatus,
                technology: tags.map(tag => ({ label: tag, value: tag })), // 👈 this line
                teamMembers: employee.map(emp => emp.id), // Assuming each `emp` has an `id`
                projectAdmins: projectAdmins?.id || null, // Assuming projectAdmins is an object
                projectId: projectId?.id || projectDetails._id,
                company: company?.id,
                client: cleint?.id,
                userdata: userdata?.id,
                description
            };
            // alert(JSON.stringify(formData))
            dispatch(
                updateProjectCost(formData, (response) => {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    if (response.success) {
                        const projectId = response?.data?._id;
                        onSubmitSuccess(projectId);
                        onNext?.();
                        onRefresh();
                    }
                })
            );
        } else {
            const formData = {
                projectName: projectName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status,
                priority,
                projectStatus,
                company,
                client: cleint,
                technology: tags.map(tag => ({ label: tag, value: tag })), // 👈 this line
                teamMembers: employee.map(emp => emp.id), // Assuming each `emp` has an `id`
                adminId: projectAdmins?.id || null, // Assuming projectAdmins is an object
                company: company?.id,
                client: cleint?.id,
                userdata: userdata?.id,
                description
            };
            dispatch(
                submitProjectBasicDetails(formData, (response) => {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    if (response.success) {
                        const projectId = response?.data?._id;
                        onSubmitSuccess(projectId);
                        onNext?.();
                        onRefresh();
                    }
                })
            );
        }
        // projectId
    };

    const Label = ({ title }) => (
        <Text style={[styles.label, Louis_George_Cafe.bold.h7, {
            color: THEMECOLORS[themeMode].textPrimary, textTransform: "capitalize"
        }]}>{title}</Text>
    );

    return (
        <View style={[styles.container, {
            backgroundColor: THEMECOLORS[themeMode].background,

        }]}>
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                {selectDropDown ? (
                    <SelectMultipleEmp
                        selectedEIds={employee}
                        onClose={(selectedIDs) => {
                            setEmployee(selectedIDs);
                            setselectDropDown(false);
                        }}
                    />
                ) : selectAdminDropDown ? (
                    <SearchSelectScreen
                        selectedEIds={projectAdmins}
                        onClose={(selectedIDs) => {
                            setProjectAdmins(selectedIDs);
                            setselectAdminDropDown(false);
                        }}
                    />
                ) : clientDropDown ? (
                    <SearchSelectClient
                        selectedEIds={cleint}
                        onClose={(selectedIDs) => {
                            setClient(selectedIDs);
                            setOpenClientDropDown(false);
                        }}
                    />
                ) : companyDropDown ? (
                    <SearchSelectCompany
                        selectedEIds={company}
                        onClose={(selectedIDs) => {
                            setcompany(selectedIDs);
                            setCompanyDropDown(false);
                        }}
                    />
                ) : (
                    <View>
                        <View
                        // style={{ opacity : selectDropDown || selectAdminDropDown ? 0.5 :1}}
                        >
                            <View style={styles.formInput}>
                                <Label title={t('projectName')} />
                                {/* <Input value={projectName} onChange={setProjectName} error={errors.projectName} placeholder={t('enterProjectName')} /> */}
                                <TextInput
                                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}

                                    style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }]}
                                    value={projectName}
                                    onChangeText={setProjectName}
                                    placeholder={t('enterProjectName')}
                                />
                                {errors?.projectName && <Text style={styles.errorText}>{errors.projectName}</Text>}


                            </View>
                            <View style={styles.dateRow}>
                                <View style={styles.dateContainer}>
                                    <Label title={t('startDate')} />
                                    <TouchableOpacity
                                        style={[styles.textInput, {
                                            backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                            color: THEMECOLORS[themeMode].textPrimary,


                                        }]}
                                        onPress={() => setShowStartPicker(true)}
                                    >
                                        <Text style={{ color: THEMECOLORS[themeMode].textPrimary, }}>{startDate ? startDate.toLocaleDateString() : t('selectStartDate')}</Text>
                                    </TouchableOpacity>
                                    {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
                                    {showStartPicker && (
                                        <DateTimePicker
                                            value={startDate || new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(_, date) => { setShowStartPicker(false); date && setStartDate(date); }}
                                        />
                                    )}
                                </View>
                                <View style={styles.dateContainer}>
                                    <Label title={t('endDate')} />
                                    <TouchableOpacity
                                        style={[styles.textInput, {
                                            backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                            color: THEMECOLORS[themeMode].textPrimary,

                                        }]}
                                        onPress={() => setShowEndPicker(true)}
                                    >
                                        <Text style={{
                                            color: THEMECOLORS[themeMode].textPrimary,

                                        }}>{endDate ? endDate.toLocaleDateString() : t('selectEndDate')}</Text>
                                    </TouchableOpacity>
                                    {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
                                    {showEndPicker && (
                                        <DateTimePicker
                                            value={endDate || new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(_, date) => { setShowEndPicker(false); date && setEndDate(date); }}
                                        />
                                    )}
                                </View>
                            </View>

                            <View style={styles.formInput}>
                                <Label title={t('teamMembers')} />
                                <TouchableOpacity onPress={() => setselectDropDown(true)}>
                                    <Text style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }]}>
                                        {employee.length > 0 ? `${employee.length} members Selected` : t('selectTeamMembers')}
                                    </Text>
                                </TouchableOpacity>
                                {employee.length > 0 && (
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
                                )}
                                {/* newErrors.employee */}
                                {errors.employee && <Text style={styles.errorText}>{errors.employee}</Text>}
                            </View>
                            <View style={styles.formInput}>
                                <Label title={t('Admin')} />
                                <TouchableOpacity onPress={() => setselectAdminDropDown(true)}>
                                    <Text style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }]}>
                                        {
                                            // JSON.stringify(projectAdmins.name)
                                            projectAdmins ? projectAdmins.name :
                                                t('selectProjectAdmins')
                                        }
                                    </Text>
                                </TouchableOpacity>
                                {errors.admin && <Text style={styles.errorText}>{errors.admin}</Text>}
                            </View>

                            <View style={styles.formInput}>
                                <Label title={t('client')} />
                                <TouchableOpacity onPress={() => setOpenClientDropDown(true)}>
                                    <Text style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }]}>
                                        {
                                            // JSON.stringify(projectAdmins.name)
                                            cleint ? cleint.name :
                                                t('selectClient')
                                        }
                                    </Text>
                                </TouchableOpacity>
                                {errors.cleint && <Text style={styles.errorText}>{errors.cleint}</Text>}
                            </View>
                            <View style={styles.formInput}>
                                <Label title={t('company')} />
                                <TouchableOpacity onPress={() => setCompanyDropDown(true)}>
                                    <Text style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }]}>
                                        {
                                            // JSON.stringify(projectAdmins.name)
                                            company ? company.name :
                                                t('company')
                                        }
                                    </Text>
                                </TouchableOpacity>
                                {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}
                            </View>

                            <View style={styles.formInput}>
                                <Label title={t('status')} />
                                <TouchableOpacity
                                    style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground
                                    }]}
                                    onPress={() => setStatusDropdownVisible(true)}
                                >
                                    <Text style={{
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }}>
                                        {status != null ?
                                            status != null || 'undefined'
                                                ? statusOptions.find(item => item.value == status)?.label
                                                :
                                                status

                                            :
                                            t('selectStatus')
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <DropdownModal
                                    selectedValue={status}
                                    visible={statusDropdownVisible}
                                    items={statusOptions}
                                    onSelect={(item) => {
                                        setStatus(item.value);
                                        setStatusDropdownVisible(false);
                                    }}
                                    onCancel={() => setStatusDropdownVisible(false)}
                                    title={t('selectStatus')}
                                />
                                {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
                            </View>

                            <View style={styles.formInput}>
                                <Label title={t('priority')} />
                                <TouchableOpacity
                                    style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground
                                    }]}
                                    onPress={() => setPriorityDropdownVisible(true)}
                                >
                                    <Text style={{
                                        textTransform: "capitalize",
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }}>
                                        {
                                            priority
                                                ? priorityOptions.find(item => item.value === priority)?.label : t('selectPriority')
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <DropdownModal
                                    selectedValue={priority}
                                    visible={priorityDropdownVisible}
                                    items={priorityOptions}
                                    onSelect={(item) => {
                                        setPriority(item.value);
                                        setPriorityDropdownVisible(false);
                                    }}
                                    onCancel={() => setPriorityDropdownVisible(false)}
                                    title={t('selectPriority')}
                                />

                                {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
                            </View>

                            <View style={styles.formInput}>
                                <Label title={t('projectStatus')} />
                                <TouchableOpacity
                                    style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground
                                    }]}
                                    onPress={() => setShowprojectStatusDropdownVisible(true)}
                                >
                                    <Text style={{
                                        textTransform: "capitalize",
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }}>
                                        {
                                            projectStatus
                                                ? projectStatusArr.find(item => item.value == projectStatus)?.label
                                                :
                                                t('projectStatus')
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <DropdownModal
                                    selectedValue={projectStatus}
                                    visible={projectStatusArrShow}
                                    items={projectStatusArr}
                                    onSelect={(item) => {
                                        setProjectStatus(item.value);
                                        setShowprojectStatusDropdownVisible(false);
                                    }}
                                    onCancel={() => setShowprojectStatusDropdownVisible(false)}
                                    title={t('projectStatus')}
                                />

                                {errors.projectStatus && <Text style={styles.errorText}>{errors.projectStatus}</Text>}
                            </View>

                            <View style={styles.formInput}>
                                <Label title={t('description')} />
                                {/* <Input value={projectName} onChange={setProjectName} error={errors.projectName} placeholder={t('enterProjectName')} /> */}
                                <TextInput
                                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                                    numberOfLines={4}
                                    multiline
                                    style={[styles.textInput, {
                                        backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                        color: THEMECOLORS[themeMode].textPrimary,
                                    }]}
                                    value={description}
                                    onChangeText={setdescription}
                                    placeholder={t('enterdescription')}
                                />
                                {/* {errors?.projectName && <Text style={styles.errorText}>{errors.projectName}</Text>} */}


                            </View>
                            <Label title={t('technology')} />

                            <View style={[styles.inputContainer, {
                                backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                color: THEMECOLORS[themeMode].textPrimary,

                            }]}>
                                <View style={styles.tagsContainer}>
                                    {tags.map((tag, index) => (
                                        <View key={index} style={styles.tag}>
                                            <Text style={[styles.tagText, {
                                                color: THEMECOLORS[themeMode].textPrimary,
                                            }]}>{tag}</Text>
                                            <TouchableOpacity onPress={() => removeTag(index)}>
                                                <Text style={styles.removeIcon}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <TextInput
                                        numberOfLines={4}
                                        style={[styles.textInputTag, {
                                            backgroundColor: THEMECOLORS[themeMode].inputBackground,
                                            color: THEMECOLORS[themeMode].textPrimary,

                                        }]}
                                        value={inputText}
                                        onChangeText={handleInputChange}
                                        placeholder={t('enterdescription')}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                                onPress={onSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                                ) : (
                                    <Text style={[Louis_George_Cafe.bold.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText, textTransform: "capitalize" }]}>
                                        {t('submit')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}




            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    // const styles = (themeMode) => StyleSheet.create({

    container: {
        flex: 1,
    },
    form: {
        padding: wp(4),
    },
    label: {
        marginBottom: wp(2),
        marginTop: wp(1),
        fontSize: wp(4),
    },
    formInput: {
        marginVertical: wp(1)
    },
    textInput: {
        borderWidth: wp(0.4),
        borderColor: '#999',
        borderRadius: wp(2),
        padding: wp(2.5),
        paddingVertical: wp(4),
        // backgroundColor: '#fff',
    },
    button: {
        marginTop: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: wp(5),
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: wp(3.2),
        marginHorizontal: wp(2),
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
    }, dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: wp(2) },
    dateContainer: { flex: 1, marginRight: wp(2) },
    inputContainer: {
        flexDirection: 'row', flexWrap: 'wrap',
        alignItems: 'center', borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: 5,
    },
    removeIcon: {
        fontSize: 12,
        color: '#ff0000',
        marginLeft: wp(2),
    },
    inputContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        // borderWidth: wp(0.5),
        // borderColor: '#ccc',
        borderRadius: wp(1),
        // padding: 5,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderWidth: wp(0.5),
        borderColor: '#ccc',

    },
    tag: {
        backgroundColor: '#888',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        color: '#f9f9f9',
        // marginRight: 5,
        fontWeight: "900"
    },
    removeIcon: {
        color: '#ff0000',
        // fontWeight: 'bold',
        fontWeight: "900",
        marginLeft: wp(2)
    },
    textInputTag: {
        // borderWidth: wp(0.4),
        borderColor: '#ccc',
        // borderRadius: wp(2),
        padding: wp(4),
        // backgroundColor: 'red',
        width: wp(89),
    },



});

export default ProjectBasicDetails;
