import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Image,
    TextInput,
    ToastAndroid,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SearchInput from './SearchInput';
import { Louis_George_Cafe } from '../resources/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getFilesdata, getUploaddata } from '../redux/authActions';
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';

const FileManager = () => {
    const [searchText, setSearchText] = useState('');
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const userdata = useSelector((state) => state.auth.user?.data);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const [selectedItemId, setSelectedItemId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileData, setfileData] = useState([]);

    const [fileName, setFileName] = useState('');
    const dispatch = useDispatch();
    const iconRefs = useRef({});

    useFocusEffect(
        React.useCallback(() => {
            fetchFilesData();
        }, [userdata])
    );

    const fetchFilesData = () => {
        setisLoading(true)
        dispatch(
            getFilesdata(userdata?.id, (response) => {
                if (response.success) {
                    // console.log(response.files);
                    setfileData(response.files)
                    setisLoading(false)

                }
            })
        );
    };

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    const handleMenuOpen = (itemId) => {
        const iconRef = iconRefs.current[itemId];
        if (iconRef) {
            iconRef.measureInWindow((x, y, width, height) => {
                setMenuPosition({ x: x + width - wp(30), y: y + height });
                setSelectedItemId(itemId);
                setMenuVisible(true);
            });
        }
    };

    const handleUploadFiles = () => {
        setUploadModalVisible(false);
        // setisLoading(true)

        dispatch(
            getUploaddata(userdata?.id, fileName, selectedFile, (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                if (response.success) {
                    setSelectedFile({}); // ✅ This sets the full object
                    setFileName('');
                    fetchFilesData();
                }
            })
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.fileItem, styles.shadowBox, { backgroundColor: THEMECOLORS[themeMode].white }]}>
            <View style={styles.fileContent}>
                <TouchableOpacity
                    ref={(ref) => iconRefs.current[item.id] = ref}
                    onPress={() => handleMenuOpen(item.id)}
                    style={{ alignSelf: "flex-end", margin: wp(1) }}
                >
                    <MaterialCommunityIcons name="dots-vertical" size={hp(2.5)} color={'#5B5B5B'} />
                </TouchableOpacity>

                <Image
                    source={require('../assets/animations/imagePic.png')}
                    style={styles.cardImage}
                    resizeMode="contain"
                />
            </View>
            <View style={{ margin: wp(2) }}>
                <Text numberOfLines={1} style={Louis_George_Cafe.bold.h9}>{item.folderName}</Text>
                <Text style={Louis_George_Cafe.regular.h9}>107.70 KB</Text>
                <Text style={{ fontSize: wp(1.5) }}>Last Modified: 19 Oct 2023</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('fileManager')} />
            <View style={{ margin: wp(2) }}>
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}>
                    <Text style={{ color: THEMECOLORS[themeMode].white }}>Folder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                    onPress={() => setUploadModalVisible(true)}
                >
                    <Text style={{ color: THEMECOLORS[themeMode].white }}>Upload</Text>
                </TouchableOpacity>
            </View>
            {
                isLoading ?
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6]}
                        renderItem={() =>
                            <View style={{
                                height: wp(34), width: wp(45), backgroundColor: THEMECOLORS[themeMode].tabInActive,
                                margin: wp(1), borderRadius: wp(2), marginVertical: wp(2)
                            }} />
                        }
                        keyExtractor={(item) => item}
                        numColumns={2}
                        contentContainerStyle={{ marginHorizontal: wp(2) }}
                    />
                    :
                    <FlatList
                        data={fileData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={{ marginHorizontal: wp(2) }}
                    />
            }
            {menuVisible && (
                <>
                    <TouchableOpacity
                        style={styles.menuBackdrop}
                        onPress={() => setMenuVisible(false)}
                    />
                    <View style={[styles.popupMenu, {
                        position: 'absolute',
                        top: menuPosition.y,
                        left: menuPosition.x,
                    }]}>
                        <TouchableOpacity onPress={() => {
                            console.log(`Download ${selectedItemId}`);
                            setMenuVisible(false);
                        }}>
                            <Text style={[Louis_George_Cafe.regular.h9, styles.menuItem]}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            console.log(`Delete ${selectedItemId}`);
                            setMenuVisible(false);
                        }}>
                            <Text style={[Louis_George_Cafe.regular.h9, styles.menuItem]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            <Modal
                isVisible={uploadModalVisible}
                onBackdropPress={() => setUploadModalVisible(false)}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                useNativeDriver={true}
            >
                <View style={{ backgroundColor: 'white', padding: wp(4), borderRadius: wp(2), height: hp(32) }}>

                    <View>
                        <TouchableOpacity
                            onPress={() =>
                                setUploadModalVisible(false)
                            }
                        >
                            <MaterialCommunityIcons style={{
                                alignSelf: "flex-end"
                            }} name="close-circle" size={hp(4)} color={'#5B5B5B'} />
                        </TouchableOpacity>
                        {selectedFile ?
                            <>
                                <Image
                                    source={require('../assets/animations/imagePic.png')}
                                    style={[
                                        {
                                            width: wp(15),
                                            height: wp(15),
                                            alignSelf: "center"
                                        }
                                    ]}
                                    resizeMode="contain"
                                />
                                <Text style={[Louis_George_Cafe.regular.h9, { color: '#555', alignSelf: "center", marginVertical: wp(3) }]}>{fileName}</Text>
                            </>
                            :
                            <>
                                <Text style={[Louis_George_Cafe.regular.h7, { marginBottom: hp(1), paddingHorizontal: wp(1) }]}>Upload File</Text>
                                <TouchableOpacity
                                    style={[{
                                        backgroundColor:
                                            THEMECOLORS[themeMode].white, marginBottom: hp(2), paddingVertical: wp(2.8), paddingHorizontal: wp(2), borderRadius: wp(2),
                                        borderColor: "#ccc", borderWidth: wp(0.3)
                                    }]}
                                    onPress={async () => {
                                        try {
                                            const res = await DocumentPicker.pickSingle({
                                                type: [DocumentPicker.types.allFiles],
                                            });
                                            // Create simulated uploaded file object
                                            const selected = {
                                                type: res.type || 'application/octet-stream',
                                                name: res.name, // simulate filename
                                                uri: res.uri, // mock full path
                                            };
                                            setSelectedFile(selected); // ✅ This sets the full object
                                            setFileName(res.name);     // Optional: Just name
                                            // console.log('Selected File Object:', selected);
                                        } catch (err) {
                                            if (DocumentPicker.isCancel(err)) {
                                                console.log('User canceled the picker');
                                            } else {
                                                console.error('DocumentPicker Error:', err);
                                            }
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#555' }}>Choose File</Text>
                                </TouchableOpacity>

                            </>
                        }

                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: wp(2),
                                padding: wp(2),
                                marginBottom: hp(2),
                            }}
                            placeholder="Enter file name"
                            value={fileName}
                            onChangeText={setFileName}
                        />

                        <TouchableOpacity
                            style={[{ backgroundColor: THEMECOLORS[themeMode].primaryApp, padding: wp(2), alignItems: "center", borderRadius: wp(5) }]}
                            onPress={() => {
                                // console.log('File to upload:', {
                                //     file: selectedFile,
                                //     name: fileName,
                                // });
                                handleUploadFiles()
                                // setUploadModalVisible(false);
                            }}
                        >
                            <Text style={[Louis_George_Cafe.bold.h7, { color: '#fff' }]}>Upload</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fileItem: {
        width: wp(45), // 45% of screen width
        margin: wp(2),
        padding: wp(1),
        borderRadius: wp(1),
        justifyContent: 'center',
        alignSelf: "center"
    },
    shadowBox: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    fileContent: {
        width: "100%",
        backgroundColor: "#E4E4E4",
        height: hp(10),
        borderRadius: wp(1),
    },
    cardImage: {
        width: wp(8),
        height: wp(8),
        alignSelf: "center"
    },
    buttonRow: {
        margin: wp(2),
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp(2)
    },
    actionButton: {
        alignItems: "center",
        padding: wp(2),
        borderRadius: wp(5),
        width: wp(45)
    },
    menuBackdrop: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
    },
    popupMenu: {
        backgroundColor: '#fff',
        padding: wp(2),
        borderRadius: wp(2),
        elevation: 5,
        width: wp(30),
        zIndex: 11,
    },
    menuItem: {
        fontSize: wp(4),
        paddingVertical: hp(1),
        color: '#333'
    }
});

export default FileManager;
