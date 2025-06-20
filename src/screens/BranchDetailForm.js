import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { Louis_George_Cafe } from '../resources/fonts';
import { useDispatch } from 'react-redux';
import { updateContactInfo } from '../redux/authActions';

const BranchDetailForm = ({ onNext, setCurrentStep, currentStep, cId, companyDetails }) => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [branches, setBranches] = useState([
        {
            branchName: '',
            contactNumber: '',
        },
    ]);
 
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (companyDetails?.branches?.length > 0) {
          const formattedBranches = companyDetails.branches.map(branch => ({
            branchName: branch.branch_name || '',
            contactNumber: branch.contact_number || '',
          }));
          setBranches(formattedBranches);
          setErrors(formattedBranches.map(() => ({}))); // reset errors for each branch
        }
      }, [companyDetails]);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const handleAddBranch = () => {
        setBranches([...branches, { branch_id: null, branchName: '', contactNumber: '' }]);
        setErrors([...errors, {}]);
    };

    const handleRemoveBranch = (index) => {
        const updatedBranches = branches.filter((_, i) => i !== index);
        setBranches(updatedBranches);

        const updatedErrors = errors.filter((_, i) => i !== index);
        setErrors(updatedErrors);
    };

    const handleChangeBranch = (index, field, value) => {
        const updatedBranches = [...branches];
        updatedBranches[index][field] = value;
        setBranches(updatedBranches);

        const updatedErrors = [...errors];
        if (updatedErrors[index]) {
            updatedErrors[index][field] = '';
            setErrors(updatedErrors);
        }
    };

    const formatBranchesForSubmission = () => {
        return branches.map(branch => ({
            branch_name: branch.branchName.trim(),
            contact_number: branch.contactNumber.trim(),
        }));
    };
    const onSubmit = () => {
        const newErrors = branches.map(branch => ({
            branchName: !branch.branchName.trim() ? t('branchNameRequired') : '',
            contactNumber: !branch.contactNumber.trim() ? t('contactNumberRequired') : '',
        }));

        const hasErrors = newErrors.some(err => err.branchName || err.contactNumber);
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // ✅ Ensure branches are included and cId is not a string literal
        const formattedBranches = formatBranchesForSubmission();
        const formData = {
            branches: formattedBranches,
            _id: cId, // make sure this is a valid string or ObjectId
        };
        console.log('Submitting formData:', JSON.stringify(formData, null, 2)); // ✅ Debug
        if (!cId) {
            alert('Error: Company ID is missing');
            return;
        }

        try {
            setLoading(true);
            dispatch(
                updateContactInfo(formData, (response) => {
                    setLoading(false);
                    console.log("API Response:", response);
                    // alert(JSON.stringify(response));
                    if (response?.success) {
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                        navigation.goBack()
                    } else {
                        ToastAndroid.show(response.message || 'Something went wrong', ToastAndroid.SHORT);
                    }
                })
            );
        } catch (error) {
            setLoading(false);
            console.error("Dispatch error:", error);
            alert('Unexpected error occurred. Please try again.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <Text
                style={[
                    Louis_George_Cafe.bold.h2,
                    { color: THEMECOLORS[themeMode].textPrimary, alignSelf: 'center', textTransform: 'capitalize' },
                ]}
            >
                {t('branches')}
            </Text>
            <ScrollView contentContainerStyle={styles.form}>
                {branches.map((branch, index) => (
                    <View key={index} style={styles.branchContainer}>
                        <Text
                            style={[
                                Louis_George_Cafe.regular.h4,
                                styles.branchTitle,
                                { color: THEMECOLORS[themeMode].black },
                            ]}
                        >
                            {t('branch')} {index + 1}
                        </Text>

                        <Text
                            style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].black }]}
                        >
                            {t('branchName')}
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t('enterBranchName')}
                            value={branch.branchName}
                            onChangeText={(text) => handleChangeBranch(index, 'branchName', text)}
                            autoCapitalize="words"
                        />
                        {errors[index]?.branchName ? (
                            <Text style={{ color: 'red', marginBottom: 4 }}>{errors[index].branchName}</Text>
                        ) : null}

                        <Text
                            style={[Louis_George_Cafe.bold.h6, styles.label, { color: THEMECOLORS[themeMode].black }]}
                        >
                            {t('contactNumber')}
                        </Text>
                        <TextInput
                            maxLength={10}
                            style={styles.textInput}
                            placeholder={t('enterContactNumber')}
                            value={branch.contactNumber}
                            onChangeText={(text) => handleChangeBranch(index, 'contactNumber', text)}
                            keyboardType="phone-pad"
                        />
                        {errors[index]?.contactNumber ? (
                            <Text style={{ color: 'red', marginBottom: 4 }}>{errors[index].contactNumber}</Text>
                        ) : null}

                        {index > 0 && (
                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveBranch(index)}>
                                <Text style={[styles.removeText, { color: 'red' }]}>{t('remove')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={handleAddBranch}>
                    <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].textPrimary }]}>
                        + {t('addAnotherBranch')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                    ) : (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.butonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                            {t('submit')}
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
        marginTop: wp(2),
        paddingHorizontal: wp(1),
        paddingBottom: wp(8),
    },
    branchContainer: {
        marginBottom: wp(6),
        borderColor: '#ddd',
        borderRadius: wp(2),
        padding: wp(3),
        backgroundColor: '#ccc',
        elevation: 1, shadowOffset: 3,
        shadowColor: "#000"
    },
    branchTitle: {
        alignSelf: 'center',
        marginBottom: wp(1),
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 10,
        lineHeight: wp(6),
    },
    textInput: {
        borderWidth: wp(0.5),
        borderColor: '#ccc',
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(1),
        backgroundColor: '#fff',
    },
    removeButton: {
        marginTop: wp(2),
        alignSelf: 'flex-end',
    },
    removeText: {
        fontWeight: 'bold',
    },
    addButton: {
        marginVertical: wp(4),
        alignItems: 'center',
    },
    button: {
        marginTop: wp(6),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
    },
    
});

export default BranchDetailForm;
