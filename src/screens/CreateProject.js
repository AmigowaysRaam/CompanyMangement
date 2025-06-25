import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectDetailById, getProjectStepData, } from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import ProjectBasicDetails from './ProjectBasicDetails';
import ProjectCostForm from './ProjectCostForm';
import ProjectDocuments from './ProjectDocuments';

// Component mapping from string to actual component
const COMPONENT_MAP = {
    ProjectBasicDetails: ProjectBasicDetails,
    ProjectCostForm: ProjectCostForm,
    ClientBankDetails: ProjectDocuments,
    ProjectDocuments: ProjectDocuments
};

const CreateProject = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const clientDetails = route.params?.data;
    const [currentStep, setCurrentStep] = useState(0);
    const [projectId, setCompanyId] = useState(clientDetails ? clientDetails : null);
    const [loading, setLoading] = useState(true);
    const [stepData, setStepData] = useState([]);
    const [dataObj, setdataObj] = useState({});
    const [companyDataArr, setclientDetails] = useState({});

    const fetchCompanyData = (parasm) => {
        // alert(parasm)
        setLoading(true)
        if (projectId?.id || parasm) {
            dispatch(
                getProjectDetailById(projectId?.id || parasm, (response) => {
                    // alert(JSON.stringify(response.data, null, 2))
                    if (response.success) {
                        setclientDetails(response.data);
                        // alert(JSON.stringify(companyDataArr))
                        setLoading(false)

                    }
                })
            );
        }
    };

    // New state to keep all submitted form data
    const [submittedCompanyData, setSubmittedCompanyData] = useState(null);
    const userdata = useSelector((state) => state.auth.user?.data);

    const fetchHomeData = () => {
        setLoading(true);
        dispatch(
            getProjectStepData(userdata?.id, (response) => {
                if (response.success) {
                    setStepData(response.data);
                    setdataObj(response);
                }
                setLoading(false);
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            // alert(JSON.stringify(clientDetails))
            fetchHomeData();
        }, [userdata, currentStep])
    );

    const CurrentForm = stepData[currentStep]
        ? COMPONENT_MAP[stepData[currentStep].component]
        : null;

    useFocusEffect(
        React.useCallback(() => {
            fetchCompanyData(projectId);
        }, [userdata, currentStep, projectId,])
    );

    const goToNextStep = () => {
        if (currentStep < stepData.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('All steps completed. Final formData:', submittedCompanyData);
        }
    };

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) navigation.goBack();
    });

    // Callback passed to child form to receive data
    const handleFormSubmitSuccess = (formDataFromChild) => {
        setCompanyId(formDataFromChild);
        // alert(formDataFromChild)
        fetchCompanyData(formDataFromChild);
    };
    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={projectId != null ? t('updateProject') : t('CreateProject')} />

            <>
                {/* Step Icons Navigation */}
                <View style={styles.stepTabs}>
                    {stepData.map((step, index) => (
                        <TouchableOpacity
                            key={step.key}
                            style={[
                                styles.stepTab,
                                {
                                    borderBottomWidth: wp(currentStep === index ? 1 : 0),
                                    borderColor:
                                        currentStep === index
                                            ? themeMode == 'light' ? THEMECOLORS[themeMode].primaryApp : THEMECOLORS[themeMode].accent
                                            : THEMECOLORS[themeMode].textPrimary,
                                    opacity: projectId || index === 0 ? 1 : 0.3,

                                },
                            ]}
                            onPress={() =>
                                projectId &&
                                setCurrentStep(index)}
                        >
                            <Icon
                                style={{
                                }}

                                name={step.icon}
                                size={wp(currentStep === index ? 8 : 7)}
                                color={
                                    currentStep === index
                                        ? themeMode == 'light' ? THEMECOLORS[themeMode].primaryApp : THEMECOLORS[themeMode].accent
                                        : THEMECOLORS[themeMode].textPrimary
                                }
                            />
                            {currentStep === index ? (
                                <Text
                                    style={[
                                        Louis_George_Cafe.regular.h7,
                                        {
                                            color: themeMode == 'light' ? THEMECOLORS[themeMode].primaryApp : THEMECOLORS[themeMode].accent,
                                            paddingHorizontal: wp(2), textTransform: 'capitalize'
                                        },
                                    ]}
                                >
                                    {`${step.label}`}
                                </Text>
                            ) :
                                stepData.length != index + 1 ?
                                    <Icon
                                        style={{
                                            marginLeft: wp(4)
                                        }}
                                        name={'arrow-right'}
                                        size={wp(currentStep === index ? 7 : 6)}
                                        color={
                                            currentStep === index
                                                ? THEMECOLORS[themeMode].primaryApp
                                                : THEMECOLORS[themeMode].textPrimary
                                        }
                                    />
                                    : null
                            }
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Step Form Content */}
                <ScrollView contentContainerStyle={styles.form}>
                    {loading ?

                        <ActivityIndicator />
                        :
                        <>
                            {stepData.length > 0 && CurrentForm ? (
                                <CurrentForm
                                    key={projectId || 'new'} // Force remount when projectId changes
                                    onNext={goToNextStep}
                                    setCurrentStep={setCurrentStep}
                                    currentStep={currentStep}
                                    cId={projectId}
                                    projectId={projectId}
                                    dataObj={dataObj}
                                    projectDetails={companyDataArr}
                                    onSubmitSuccess={handleFormSubmitSuccess}
                                    onRefresh={fetchCompanyData}
                                />
                            ) : null}</>
                    }

                </ScrollView>
            </>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        paddingHorizontal: wp(1),
        paddingBottom: wp(10),
    },
    stepTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: wp(3),
        borderBottomWidth: wp(0.4),
        marginBottom: wp(4),
        borderColor: '#CCC',
        paddingHorizontal: wp(2),
    },
    stepTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: wp(1),
    },
});

export default CreateProject;
