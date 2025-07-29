import React, { useState } from 'react';
import {
    TextInput, View, Image, TouchableOpacity, StyleSheet,
    ActivityIndicator, ToastAndroid, Text, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import ConfirmationModal from './ConfirmationModal';
import ImagePicker from 'react-native-image-crop-picker';
import { postToLinkedIn } from '../api/linkedinApi';
import DropdownModal from './DropDownModal';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const NewLinkedinPostForm = ({ org, accessToken, onClose }) => {
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [scheduleMode, setScheduleMode] = useState(false);
    const [scheduledDate, setScheduledDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [imageActionIndex, setImageActionIndex] = useState(null); // Track selected image index
    const [showDropdownModal, setShowDropdownModal] = useState(false);  // Manage Dropdown Modal visibility
    const { themeMode } = useTheme();
    const theme = THEMECOLORS[themeMode];
    const hasContent = postText.trim() !== '' || selectedImages.length > 0;

    useAndroidBackHandler(() => {
        onClose();
      });

    const dropdownItems = [
        { label: 'Edit', value: 'Edit' },
        { label: 'Remove', value: 'Remove' },

    ];

    // Function to pick images using ImagePicker
    const pickImages = async () => {
        setLoading(true);
        try {
            const images = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                cropping: true,
            });
            setSelectedImages(images);
        } catch (error) {
            console.log('Image picker error:', error);
        }
        setLoading(false);
    };

    // Remove selected image by index
    const handleRemoveImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setShowDropdownModal(false);  // Close dropdown modal after action
    };
    // Edit selected image (crop)
    const handleEditImage = async (index) => {
        try {
            const image = selectedImages[index];
            const editedImage = await ImagePicker.openCropper({
                path: image.path,
                width: 300, // set width as per your requirement
                height: 300, // set height as per your requirement
                cropping: true,
            });
            const newImages = [...selectedImages];
            newImages[index] = editedImage;
            setSelectedImages(newImages);
        } catch (error) {
            console.log('Error while editing image:', error);
        }
        setShowDropdownModal(false);  // Close dropdown modal after action
    };

    // Confirmation to post
    const handlePostConfirm = () => {
        setShowConfirmModal(false);
        handlePost();
    };

    // Post to LinkedIn
    const handlePost = async () => {
        if (!hasContent) return;

        try {
            setLoading(true);
            const result = await postToLinkedIn({
                orgId: org.id,
                accessToken,
                postText,
                selectedImages,
            });
            setLoading(false);
            if (result.success) {
                ToastAndroid.show('Post shared to LinkedIn!', ToastAndroid.SHORT);
                setPostText('');
                setSelectedImages([]);
                setScheduleMode(false);
                setScheduledDate(null);
                onClose();
            } else {
                ToastAndroid.show('Post failed: ' + result.error, ToastAndroid.SHORT);
            }
        } catch (error) {
            setLoading(false);
            ToastAndroid.show('Error: Network issue', ToastAndroid.SHORT);
        }
    };

    // Handle schedule submit action
    const handleScheduleSubmit = () => {
        if (!scheduledDate) return;
        ToastAndroid.show(`Scheduled: ${scheduledDate.toLocaleString()}`, ToastAndroid.SHORT);
        setScheduleMode(false);
    };
    // Handle date picker change
    const handleDateChange = (_, date) => {
        if (date) {
            setScheduledDate(date);
            setShowDatePicker(false);
            setShowTimePicker(true);
        } else {
            setShowDatePicker(false);
        }
    };

    // Handle time picker change
    const handleTimeChange = (_, time) => {
        if (time) {
            const newDate = new Date(scheduledDate || new Date());
            newDate.setHours(time.getHours(), time.getMinutes());
            setScheduledDate(newDate);
        }
        setShowTimePicker(false);
    };

    // Handle text change in the post
    const handleChangeText = (text) => {
        if (text.length > 3000) {
            ToastAndroid.show('Max length exceeded', ToastAndroid.SHORT);
            setPostText(text.slice(0, 3000));
        } else {
            setPostText(text);
        }
    };

    // Show dropdown modal when image action button is clicked
    const showImageActionMenu = (index) => {
        setImageActionIndex(index);  // Store the index of the image being selected
        setShowDropdownModal(true);  // Show the dropdown modal
    };
    // Handle dropdown modal action (Edit / Remove)
    const handleImageAction = (action) => {
        // alert(action.value)
        if (action.value === 'Edit') {
            handleEditImage(imageActionIndex);  // Edit image at the selected index
        } else if (action.value === 'Remove') {
            handleRemoveImage(imageActionIndex);  // Remove image at the selected index
        }
        setShowDropdownModal(false);  // Close dropdown modal after action
    };
    return (
        <View>
            {loading ? (
                <ActivityIndicator color={theme.textPrimary} size={wp(10)} />
            ) : (
                <>
                    {/* Top row with "Post" and "Schedule" buttons */}
                    <View style={styles.topRow}>
                        {hasContent && !scheduleMode && (
                            <TouchableOpacity onPress={() => setShowConfirmModal(true)} style={styles.tabButton(themeMode)}>
                                <MaterialCommunityIcons name="check" size={hp(3)} color={theme.buttonText} />
                            </TouchableOpacity>
                        )}
                        {hasContent && !scheduleMode && (
                            <TouchableOpacity onPress={() => {
                                setScheduleMode(true);
                                setShowDatePicker(true);
                            }} style={styles.tabButton(themeMode)}>
                                <MaterialCommunityIcons name="clock" size={hp(3)} color={theme.buttonText} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Post Text Area */}
                    <View style={styles.inputBox}>
                        <TextInput
                            maxLength={3000}
                            placeholderTextColor={theme.textPrimary}
                            style={[Louis_George_Cafe.regular.h6, styles.textArea, { color: theme.textPrimary }]}
                            placeholder="What's on your mind?"
                            multiline
                            value={postText}
                            onChangeText={handleChangeText}
                        />

                        {/* Display selected images */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: wp(3) }}>
                            {selectedImages.map((img, i) => (
                                <View key={i} style={styles.imageWrapper}>
                                    <Image source={{ uri: img.path }} style={styles.previewImage} />
                                    <TouchableOpacity onPress={() => showImageActionMenu(i)} style={styles.imageActionBtn}>
                                        <MaterialCommunityIcons name="dots-horizontal" size={wp(4)} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={pickImages} style={styles.imageIconWrap}>
                            <MaterialCommunityIcons name="image-multiple" size={hp(3)} color={theme.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    {scheduleMode && (
                        <View style={styles.scheduleBox}>
                            <MaterialCommunityIcons onPress={() => setScheduleMode(false)} name="close" size={wp(8)} color="#FF0000" style={{ alignSelf: "flex-end" }} />
                            <Text style={styles.scheduleText}>Scheduled for: {scheduledDate ? scheduledDate.toLocaleString() : 'Not set'}</Text>
                            <View style={styles.scheduleBtnRow}>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.actionBtn}>
                                    <MaterialCommunityIcons name="calendar" size={wp(5)} color="#fff" />
                                    <Text style={styles.btnText}>Edit Date</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.actionBtn}>
                                    <MaterialCommunityIcons name="clock-outline" size={wp(5)} color="#fff" />
                                    <Text style={styles.btnText}>Edit Time</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={handleScheduleSubmit} style={styles.submitBtn}>
                                <Text style={styles.submitBtnText}>Submit Scheduled Post</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {showDatePicker && (
                        <DateTimePicker
                            value={scheduledDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={scheduledDate || new Date()}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                    {/* Dropdown Modal for Image Action */}
                    {showDropdownModal && (
                        <DropdownModal
                            visible={showDropdownModal}
                            items={dropdownItems}
                            onSelect={handleImageAction}
                            onCancel={() => setShowDropdownModal(false)}
                            title="Cvcbvcbhoose"
                        />
                    )}
                    {/* Confirmation Modal */}
                    <ConfirmationModal
                        visible={showConfirmModal}
                        message={"Are sure want to post this ?"}
                        onConfirm={handlePostConfirm}
                        onCancel={() => setShowConfirmModal(false)}
                    />

                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row', alignSelf: 'flex-end', marginBottom: wp(3)
    },
    tabButton: (themeMode) => ({
        paddingHorizontal: wp(1), borderRadius: wp(6), width: wp(12),
        alignItems: 'center', height: wp(12), justifyContent: 'center',
        marginHorizontal: wp(1), backgroundColor: THEMECOLORS[themeMode].buttonBg,
    }),
    inputBox: {
        borderWidth: wp(1), marginBottom: hp(2), borderRadius: wp(2),
        borderColor: '#CCC', padding: wp(2),
        // height: wp(80)
    },
    imageWrapper: {
        position: 'relative', marginRight: wp(3),
    },
    textArea: {
        // height: wp(60)
    },
    previewImage: {
        width: wp(25), height: wp(25), borderRadius: wp(2), marginVertical: wp(10)
    },
    imageActionBtn: {
        position: 'absolute', top: wp(12), right: 2, backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: wp(3), padding: 5,
    },
    imageIconWrap: {
        alignSelf: "flex-start", marginTop: wp(2),
    },
    scheduleBox: {
        padding: wp(4), backgroundColor: '#f1f1f1', borderRadius: wp(2),
        marginBottom: wp(4)
    },
    scheduleText: {
        fontSize: wp(4), marginBottom: wp(2)
    },
    scheduleBtnRow: { flexDirection: 'row', marginBottom: wp(3) }, actionBtn: {
        flexDirection: 'row', backgroundColor: '#333', padding: wp(3), borderRadius: wp(2),
        marginRight: wp(2),
        alignItems: 'center',
    },
    btnText: {
        color: '#fff', marginLeft: wp(2), fontSize: wp(3.5),
    },
    submitBtn: {
        backgroundColor: '#0077b5', paddingVertical: wp(3), borderRadius: wp(2),
        alignItems: 'center'
    }, submitBtnText: {
        color: '#fff', fontSize: wp(4), fontWeight: 'bold'
    },
});

export default NewLinkedinPostForm;
