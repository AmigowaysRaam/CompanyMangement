import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    ToastAndroid,
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
import { getClientDetailById, getClientStepData, getEmplDetailById, getEmployeeStepData } from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import EmployeeBasicDetails from './EmployeeBasicDetail';
import EmployeeAddressForm from './EmployeeAddressForm';
import EmployeeEducationForm from './EmployeeEducationForm';
import EmployeeJob from './EmployeeJob';
import EmployeeBankDetailForm from './EmpBankDetailForm';

// Component mapping from string to actual component
const COMPONENT_MAP = {
    EmployeeBasicDetails,
    AdressEmployeeForm: EmployeeAddressForm,
    EmployeeEducationForm,
    EmployeeJobForm:EmployeeJob,
    EmployeeBankDetailForm
    // ClientNotes:EmployeeEducationForm
};

const CreateEmployeeFrom = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const empDetails = route.params?.data;
    const [currentStep, setCurrentStep] = useState(0);
    const [clientId, setEmpId] = useState(empDetails ? empDetails : null);
    const [loading, setLoading] = useState(true);
    const [stepData, setStepData] = useState([]);
    const [dataObj, setdataObj] = useState({});
    const [companyDataArr, setempDetails] = useState({});

    const fetchCompanyData = () => {
        if (clientId != null) {
            dispatch(
                getEmplDetailById(clientId, (response) => {
                    // alert(JSON.stringify(response))
                    if (response.success) {
                        // setempDetails(response.data);
                        if (Array.isArray(response.data) && response.data.length > 0) {
                            setempDetails(response.data[0]);
                            // alert(JSON.stringify(empDetails))
                        } else {
                            setempDetails(response.data);
                        }
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
            getEmployeeStepData(userdata?.id, (response) => {
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
            // alert(JSON.stringify(empDetails))
            fetchHomeData();
        }, [userdata])
    );

    useFocusEffect(
        React.useCallback(() => {
            fetchCompanyData();
        }, [userdata, currentStep, clientId])
    );

    const goToNextStep = () => {
        if (currentStep < stepData.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // console.log('All steps completed. Final formData:', submittedCompanyData);
        }
    };

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) navigation.goBack();
    });

    const CurrentForm = stepData[currentStep]
        ? COMPONENT_MAP[stepData[currentStep].component]
        : null;


    // Callback passed to child form to receive data
    const handleFormSubmitSuccess = (formDataFromChild) => {
        setEmpId(formDataFromChild);
        fetchCompanyData();
        // alert(`Received Company ID in parent: ${formDataFromChild}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={clientId != null ? t('updateEmployee') : t('createEmployee')} />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={THEMECOLORS[themeMode].primaryApp} />
                </View>
            ) : (
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
                                                ? themeMode == 'dark' ? THEMECOLORS[themeMode].accent : THEMECOLORS[themeMode].primaryApp
                                                : THEMECOLORS[themeMode].textPrimary,
                                    },
                                ]}
                                onPress={() =>
                                    !clientId ?
                                        ToastAndroid.show(t('basic_detail_need'), ToastAndroid.SHORT)
                                        :
                                        setCurrentStep(index)}
                            >
                                <Icon
                                    name={step.icon}
                                    size={wp(currentStep === index ? 8 : 7)}
                                    color={
                                        currentStep === index
                                            ? themeMode == 'dark' ? THEMECOLORS[themeMode].accent : THEMECOLORS[themeMode].primaryApp
                                            : THEMECOLORS[themeMode].textPrimary
                                    }
                                />
                                {currentStep === index ? (
                                    <Text
                                        style={[
                                            Louis_George_Cafe.regular.h7,
                                            {
                                                color: themeMode == 'dark' ? THEMECOLORS[themeMode].accent : THEMECOLORS[themeMode].primaryApp,
                                                paddingHorizontal: wp(2), textTransform: 'capitalize'
                                            },
                                        ]}
                                    >
                                        {step?.label}
                                    </Text>
                                )
                                    :
                                    stepData.length != index + 1 ?
                                        <Icon
                                            style={{
                                                marginLeft: wp(4)
                                            }}
                                            name={'arrow-right'}
                                            size={wp(7)}
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
                        {stepData.length > 0 && CurrentForm ? (
                            <CurrentForm
                                key={clientId || 'new'} // Force remount when clientId changes
                                onNext={goToNextStep}
                                setCurrentStep={setCurrentStep}
                                currentStep={currentStep}
                                cId={clientId}
                                dataObj={dataObj}
                                empDetails={companyDataArr}
                                onSubmitSuccess={handleFormSubmitSuccess}
                                onRefresh={fetchCompanyData}
                            />
                        ) : null}
                    </ScrollView>
                </>
            )}
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

export default CreateEmployeeFrom;
