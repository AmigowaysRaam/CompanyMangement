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
import { getCompanyData, getCompanyDetailById } from '../redux/authActions';

// Step form components
import AddCompanyForm from './CompanyForm';
import ContactForm from './ContactForm';
import WebForm from './WebForm';
import BankForm from './BankForm';
import TimingsForm from './TimingForm';
import BranchesForm from './BranchDetailForm';
import { Louis_George_Cafe } from '../resources/fonts';
import CompanyShiftForm from './CompanyShiftForm';
// Component mapping from string to actual component
const COMPONENT_MAP = {
    AddCompanyForm,
    ContactForm,
    WebForm,
    BankForm,
    // TimingsForm:CompanyShiftForm,
    BranchesForm,
    CompanyShiftForm
};

const CreateCompany = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const companyDetails = route.params?.data;
    const [currentStep, setCurrentStep] = useState(0);
    const [companyId, setCompanyId] = useState(companyDetails ? companyDetails : null);
    const [loading, setLoading] = useState(true);
    const [stepData, setStepData] = useState([]);
    const [dataObj, setdataObj] = useState({});
    const [companyDataArr, setcompanyDetails] = useState({});

    const fetchCompanyData = () => {
        if (companyId != null) {
            dispatch(
                getCompanyDetailById(companyId, (response) => {
                    if (response.success) {
                        if (Array.isArray(response.data) && response.data.length > 0) {
                            setcompanyDetails(response.data[0]);
                        } else {
                            setcompanyDetails(response.data);
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
            getCompanyData(userdata?.id, (response) => {
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
            fetchHomeData();
        }, [userdata])
    );

    useFocusEffect(
        React.useCallback(() => {
            fetchCompanyData();
        }, [userdata, currentStep, companyId])
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

    const CurrentForm = stepData[currentStep]
        ? COMPONENT_MAP[stepData[currentStep].component]
        : null;

    // Callback passed to child form to receive data
    const handleFormSubmitSuccess = (formDataFromChild) => {
        setCompanyId(formDataFromChild);
        fetchCompanyData();
        // alert(`Received Company ID in parent: ${formDataFromChild}`);
    };

    const loadingContainerComp = () => {
        return (
            <>
                {[...Array(7)].map((_, index) => (
                    <View>

                        <View
                            key={index}
                            style={{
                                backgroundColor: THEMECOLORS[themeMode].tabInActive,
                                width: wp(25),
                                height: wp(5),
                                // alignSelf: "center",
                                borderRadius: wp(2),
                                marginBottom: wp(2), marginVertical: wp(4),
                                marginHorizontal: wp(6), marginTop: wp(6)
                            }}
                        />
                        <View
                            key={index}
                            style={{
                                backgroundColor: THEMECOLORS[themeMode].tabInActive,
                                width: wp(90),
                                height: wp(10),
                                alignSelf: "center",
                                borderRadius: wp(4),
                                marginBottom: wp(4),
                                //  marginVertical: wp(4)
                            }}
                        />
                    </View>
                ))}
            </>
        );
    };


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={companyId != null ? t('updateCompany') : t('CreateCompany')} />
            {loading ? (
                <View style={styles.loadingContaier}>
                    {loadingContainerComp()}
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
                                                ? themeMode == 'light' ? THEMECOLORS[themeMode].primaryApp :
                                                    THEMECOLORS[themeMode].accent
                                                : THEMECOLORS[themeMode].textPrimary,
                                        opacity: companyId || index === 0 ? 1 : 0.3,
                                    },
                                ]}
                                onPress={() =>
                                    companyId ?
                                        setCurrentStep(index) :
                                        ToastAndroid.show(t('basic_detail_need'), ToastAndroid.SHORT)

                                }
                            >
                                <Icon
                                    name={step.icon}
                                    size={wp(currentStep === index ? 5 : 4)}
                                    color={
                                        currentStep === index
                                            ? themeMode == 'light' ? THEMECOLORS[themeMode].primaryApp :
                                                THEMECOLORS[themeMode].accent
                                            : THEMECOLORS[themeMode].textPrimary
                                    }
                                />
                                {currentStep === index ? (
                                    <Text
                                        style={[
                                            Louis_George_Cafe.regular.h8,
                                            {
                                                color: themeMode == 'light' ? THEMECOLORS[themeMode].primaryApp :
                                                    THEMECOLORS[themeMode].accent,
                                                paddingHorizontal: wp(2),
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
                                            size={wp(5)}
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
                                key={companyId || 'new'} // Force remount when companyId changes
                                onNext={goToNextStep}
                                setCurrentStep={setCurrentStep}
                                currentStep={currentStep}
                                cId={companyId}
                                dataObj={dataObj}
                                companyDetails={companyDataArr}
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

export default CreateCompany;
