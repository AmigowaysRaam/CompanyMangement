import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Image,
    UIManager,
    findNodeHandle
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from "../context/ThemeContext";
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import SearchInput from './SearchInput';
import { Louis_George_Cafe } from '../resources/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const fileData = [
    { id: '1', name: 'Document.pdf', type: 'pdf' },
    { id: '2', name: 'Image.png', type: 'image' },
    { id: '3', name: 'Music.mp3', type: 'audio' },
    { id: '4', name: 'Video.mp4', type: 'video' },
    { id: '5', name: 'Notes.txt', type: 'text' },
    { id: '6', name: 'Presentation.pptx', type: 'ppt' },
];

const FileManager = () => {
    const [searchText, setSearchText] = useState('');
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const iconRefs = useRef({});

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

    const renderItem = ({ item }) => {
        return (
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
                    <Text style={Louis_George_Cafe.regular.h8}>{item.name}</Text>
                    <Text style={Louis_George_Cafe.regular.h9}>107.70 KB</Text>
                    <Text style={{ fontSize: wp(1.5) }}>
                        Last Modified: 19 Oct 2023
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

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
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}>
                    <Text style={{ color: THEMECOLORS[themeMode].white }}>Upload</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={fileData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ marginHorizontal: wp(2) }}
            />

            {/* Pop-up menu near icon */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fileItem: {
        flex: 1,
        margin: wp(2),
        padding: wp(1),
        borderRadius: wp(1),
        justifyContent: 'center',
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
