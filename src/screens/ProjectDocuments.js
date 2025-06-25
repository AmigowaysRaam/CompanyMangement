import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    FlatList,
    Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getProjectDetailById, projectDocumentSubmit, } from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { hp, wp } from '../resources/dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAX_FILE_SIZE = 500 * 1024; // 500 KB

const ProjectDocuments = ({ cId, onRefresh, projectId }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // alert(projectId?.id)
        if (projectId?.id) {
            dispatch(getProjectDetailById(projectId.id, (res) => {
                if (res.success && res.data?.file?.length > 0) {
                    const formatted = res.data.file.map((fileName, index) => ({
                        id: index.toString(),
                        name: fileName,
                        uri: fileName, // Full URL
                        type: 'application/pdf',
                        existing: true,
                    }));
                    setFiles(formatted);
                }
            }));
        }
    }, [projectId]);


    const removeFile = (id) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    };

    const pickFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf],
            });

            if (res.size > MAX_FILE_SIZE) {
                ToastAndroid.show(t('file_too_large'), ToastAndroid.SHORT);
                return;
            }

            setFiles((prev) => [...prev, res]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User canceled
            } else {
                console.warn(err);
                ToastAndroid.show(t('error_selecting_file'), ToastAndroid.SHORT);
            }
        }
    };

    const onSubmit = () => {
        if (files.length === 0) {
            ToastAndroid.show(t('error_check_fields'), ToastAndroid.SHORT);
            return;
        }
        const formData = new FormData();
        formData.append('projectId', projectId?.id || projectId);
        files.forEach((file, index) => {
            formData.append('files', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });
        });
        setLoading(true);
        dispatch(
            projectDocumentSubmit(formData, (response) => {
                setLoading(false);
                if (response.success) {
                    ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    onRefresh();
                    navigation.goBack();
                } else {
                    ToastAndroid.show(t('failed'), ToastAndroid.SHORT);
                }
            })
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <MaterialCommunityIcons
                    onPress={() => removeFile(item.id)}
                    name="close-circle"
                    size={hp(3)}
                    color="#FF0000"
                    style={{ position: 'absolute', top: wp(1), right: wp(1) }}
                />
                <Image
                    source={require('../assets/animations/imagePic.png')}
                    style={{ width: wp(14), height: wp(14), alignSelf: 'center' }}
                    resizeMode="contain"
                />
                <Text
                    numberOfLines={1}
                    style={[
                        Louis_George_Cafe.regular.h9,
                        {
                            textAlign: 'center',
                            color: '#555',
                            marginTop: wp(3),
                            fontSize: wp(2)
                        },
                    ]}
                >
                    {item.name}
                </Text>
            </View>
        </View>
    );


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
        <TouchableOpacity onPress={pickFile} style={styles.addDoc}>
            <Image
                source={require('../assets/animations/addDoc.png')}
                style={{ width: wp(14), height: wp(14), alignSelf: 'center' }}
                resizeMode="contain"
            />
        </TouchableOpacity>
    
        <FlatList
            data={files}
            keyExtractor={(item) => item.uri}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: wp(3) }}
            style={{ flex: 1 }}
        />
    
        {files.length !== 0 &&
            <TouchableOpacity
                style={[styles.button, { backgroundColor: THEMECOLORS[themeMode].buttonBg }]}
                onPress={onSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={THEMECOLORS[themeMode].buttonText} />
                ) : (
                    <Text style={[styles.buttonText, { color: THEMECOLORS[themeMode].buttonText }]}>
                        {t('button_submit')}
                    </Text>
                )}
            </TouchableOpacity>
        }
    </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: wp(2),
    },addDoc: {
        backgroundColor: "#e9e9e9",
        borderRadius: wp(1),
        padding: wp(2),
        width: wp(90),
        height: wp(23),
        margin: wp(1),
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
    },
    
    button: {
        marginHorizontal: wp(4),
        padding: wp(3),
        borderRadius: wp(2),
        alignItems: 'center',
        marginBottom: wp(4),
    },
    buttonText: {
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    fileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: wp(2),
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    cardContainer: {
        width: wp(42),
        margin: wp(2),
        marginVertical: wp(4)
    },
    card: {
        borderRadius: wp(2),
        padding: wp(2),
        width: '100%',
        height: wp(30),
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Android Elevation
        elevation: 6,
        backgroundColor: '#fff',
    }
});
export default ProjectDocuments;
