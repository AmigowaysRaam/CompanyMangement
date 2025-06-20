// AddProjectForm.js
import React, { useEffect, useState } from 'react';
import {
    View, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, ActivityIndicator, Text
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { createProjectForm, getCLinetData, getCompaniesList, getCompanyDetailById, getemployeeDetails, getProjectDetailById, updateProjectForm } from '../redux/authActions';
import { THEMECOLORS } from '../resources/colors/colors';
import { hp, wp } from '../resources/dimensions';
import ProjectFormFields from './ProjectFromFields';
import { Louis_George_Cafe } from '../resources/fonts';
import ProjectCostForm from './ProjectCostForm'
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const AddProjectForm = () => {

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);
    const route = useRoute();
    const projectData = route.params?.data;
    // Function to map API project data to form values
    const mapProjectDataToForm = (data) => {
        return {
            projectName: data.projectName || '',
            company: data.projectAdmins?.[0]?.company || null,
            client: data.client || null,
            startDate: data.startDate ? new Date(data.startDate) : new Date(),
            endDate: data.endDate ? new Date(data.endDate) : new Date(),
            status: data.status || null,
            description: data?.description,
            branch: data?.branch,
            hostingurl: data?.hostingurl,
            files: Array.isArray(data.file)
                ? data.file.map((filePath) => ({
                    uri: filePath,
                    name: filePath.split('/').pop(),
                    type: 'application/pdf', // or detect dynamically if needed
                }))
                : [],
            employee: data.teamMembers
                ? data.teamMembers.map((member) => member._id || member.id)
                : [],
            admin: data.projectAdmins?.[0]?._id || null,
        };
    };



    const [values, setValues] = useState({
        projectName: '',
        company: null,
        client: null,
        startDate: new Date(),
        endDate: new Date(),
        status: null,
        files: [], // array of files: [{ name, uri }]
        employee: [],
        admin: null,
        description: '',
        branch: null,
        hostingurl: '',
        notes: null
    });
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [clientList, setclientList] = useState([]);
    const [employeeList, setemployeeList] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [branchList, setbranchList] = useState([]);
    const [createdProjectId, setCreatedProjectId] = useState(projectData?.id);

    const statusOptions = [
        { label: t('active'), value: 1 },
        { label: t('inactive'), value: 0 },
    ];

    // Fetch dropdown data on mount
    useEffect(() => {
        setLoading(true);
        dispatch(getCLinetData(userdata, (res) => {
            if (res.success) {
                const clients = res.data.map(client => ({
                    label: client.companyName,
                    value: client._id
                }));
                setclientList(clients);
            }
            setLoading(false);
        }));

        dispatch(getCompaniesList(userdata, (res) => {
            if (res.success) {
                const companies = res.data.map(c => ({
                    label: c.company_name,
                    value: c._id
                }));
                setCompanyList(companies);
            }
        }));

        dispatch(getemployeeDetails(userdata, (res) => {
            if (res.success) {
                const employees = res.employeeList.map(e => ({
                    label: e.name,
                    value: e.id
                }));
                setemployeeList(employees);
            }
        }));
    }, []);

    // Fetch project details if editing and set form values
    useEffect(() => {
        if (projectData?.id) {
            setLoading(true);
            dispatch(getProjectDetailById(projectData.id, (res) => {
                if (res.success) {
                    console.log(res.data)
                    const formData = mapProjectDataToForm(res.data);
                    setValues(formData);
                }
                setLoading(false);
            }));
        }
    }, [projectData?.id]);

    useEffect(() => {
        if (values?.company != null)
            setLoading(true);
        dispatch(getCompanyDetailById(values?.company, (res) => {
            if (res.success) {
                // console.log(res.data.branches)
                setbranchList(
                    res.data.branches.map(branch => ({
                        label: branch.branch_name,
                        value: branch.branch_id
                    }))
                );
            }
            setLoading(false);
        }));
    }, [values?.company]);


    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!values.projectName) newErrors.projectName = t('validation_projectNameRequired');
        if (!values.company) newErrors.company = t('validation_companyRequired');
        if (!values.client) newErrors.client = t('validation_clientRequired');
        if (!values.status) newErrors.status = t('validation_statusRequired');
        if (!values.employee || values.employee.length === 0) newErrors.employee = t('validation_employeeRequired');
        if (!values.admin) newErrors.admin = t('validation_adminRequired');
        if (!values.description) newErrors.description = t('validation_description');
        // ✅ Hosting URL validation
        // if (!values.hostingurl) {
        //     newErrors.hostingurl = t('validation_hosting_url'); // e.g. "Hosting URL is required"
        // } else if (!isValidURL(values.hostingurl)) {
        //     newErrors.hostingurl = t('validation_valid_url'); // e.g. "Please enter a valid URL"
        // }
        if (!values.files) newErrors.requirementFile = t('validation_requirementFileRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const MAX_FILE_SIZE = 500 * 1024; // 500 KB in bytes

    
const handleFilePick = async () => {
    try {
        const result = await DocumentPicker.pick({
            type: DocumentPicker.types.allFiles,
            multiple: true,
        });

        if (result && result.length > 0) {
            const filteredFiles = result.filter(file => {
                if (file.size && file.size <= MAX_FILE_SIZE) {
                    return true;
                } else {
                    // Show toast when file size exceeds 500 KB
                    ToastAndroid.show(t('File exceeds 500 KB'), ToastAndroid.SHORT);
                    return false;
                }
            });

            const newFiles = filteredFiles.map((file) => ({
                name: file.name,
                uri: file.uri,
                type: file.type || 'application/octet-stream',
                size: file.size,
            }));

            setValues((prev) => {
                const existingFiles = prev.files.map(file => file.uri);
                const uniqueNewFiles = newFiles.filter(file => !existingFiles.includes(file.uri));
                return {
                    ...prev,
                    files: [...prev.files, ...uniqueNewFiles],
                };
            });
        } else {
            console.log('No files selected');
        }
    } catch (error) {
        if (DocumentPicker.isCancel(error)) {
            console.log('User canceled the picker');
        } else {
            console.error("File pick error:", error);
        }
    }
};

    const handleNavigateOtherDFomr = () => {

        if (projectData?.id)
            setTabIndex(1)
        else {
            ToastAndroid.show(t('otherDetailValidation'), ToastAndroid.SHORT);
        }
    }

    const handleFileRemove = (fileUriToRemove) => {
        setValues((prev) => ({
            ...prev,
            files: prev.files.filter(file => file.uri !== fileUriToRemove)
        }));
    };
    // Submit handler

    const onSubmit = () => {
        console.log(JSON.stringify(values, null, 2))
        if (!validate()) {
            ToastAndroid.show(t('validation_formIncomplete'), ToastAndroid.SHORT);
            return;
        }
        console.log(JSON.stringify(values.files))
        // setLoading(true);
        if (projectData?.id) {
            dispatch(updateProjectForm(values, projectData?.id, userdata, (res) => {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                if (res.success) {
                    setCreatedProjectId(res.data.id);
                    navigation.goBack();
                }
                setLoading(false);
            }));
        } else {
            dispatch(createProjectForm(values, userdata, (res) => {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
                if (res.success) {
                    setCreatedProjectId(res.data.id);
                    // setTabIndex(1);
                    navigation.goBack();
                    
                }
                setLoading(false);
            }));
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: THEMECOLORS[themeMode].background }}>
            <HeaderComponent showBackArray title={projectData?.id ? t('updateProject_title') : t('addProject_title')} />
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, tabIndex === 0 && styles.activeTab, {
                    backgroundColor: tabIndex === 0 ? THEMECOLORS[themeMode].primaryApp : "#eee"
                }]} onPress={() => setTabIndex(0)}>
                    <Text style={[styles.tabText, tabIndex === 0 && styles.activeTabText]}>{t('basicInfo')}</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[styles.tabButton, tabIndex === 1 && styles.activeTab, {
                    backgroundColor: tabIndex === 1 ? THEMECOLORS[themeMode].primaryApp : "#eee", opacity: projectData?.id ? 1 : 0.2
                }]} onPress={() => handleNavigateOtherDFomr()}>
                    <Text style={[styles.tabText, tabIndex === 1 && styles.activeTabText]}>{t('otherdetails')}</Text>
                </TouchableOpacity>


            </View>

            {tabIndex == 0 ?
                <ScrollView contentContainerStyle={{ padding: wp(5) }}>
                    <ProjectFormFields
                        themeMode={themeMode}
                        t={t}
                        values={values}
                        setValues={setValues}
                        errors={errors}
                        showStartPicker={showStartPicker}
                        setShowStartPicker={setShowStartPicker}
                        showEndPicker={showEndPicker}
                        setShowEndPicker={setShowEndPicker}
                        handleFilePick={handleFilePick}
                        handleFileRemove={handleFileRemove}
                        companyList={companyList}
                        clientList={clientList}
                        employeeList={employeeList}
                        statusOptions={statusOptions}
                        branchList={branchList}
                    />
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                        onPress={onSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                        ) : (
                            <Text style={[Louis_George_Cafe.regular.h4, styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                                {projectData?.id ? t('update') : t('submit')}
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
                :
                <ProjectCostForm projectId={createdProjectId} />

            }
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {

        textTransform: "capitalize"
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#eee',
        marginHorizontal: wp(5),
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: wp(0.1)
    },
    tabButton: {
        flex: 1,
        paddingVertical: hp(1.2),
        alignItems: 'center',
        borderRadius: 8,

    },
    activeTab: {
        // backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 14,
        // color: '#666',
    },
    activeTabText: {
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default AddProjectForm;
