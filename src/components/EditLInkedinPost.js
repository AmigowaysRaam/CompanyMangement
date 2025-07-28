import React, { useEffect, useState } from 'react';
import {
    TextInput, View, Image, TouchableOpacity, StyleSheet,
    ActivityIndicator, ToastAndroid, Text, ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import ConfirmationModal from './ConfirmationModal';
import ImagePicker from 'react-native-image-crop-picker';
import { getPostDetails, postToLinkedIn, updatePostToLinkedIn } from '../api/linkedinApi';
import DropdownModal from './DropDownModal';

const EditLInkedinPost = ({ org, accessToken, onClose, seletedPostUrn }) => {

    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [imageActionIndex, setImageActionIndex] = useState(null); // Track selected image index
    const [showDropdownModal, setShowDropdownModal] = useState(false);  // Manage Dropdown Modal visibility
    const { themeMode } = useTheme();
    const theme = THEMECOLORS[themeMode];
    const hasContent = postText?.trim() !== '' || selectedImages?.length > 0;
    const dropdownItems = [
        { label: 'Edit', value: 'Edit' },
        { label: 'Remove', value: 'Remove' },
    ];

    const pickImages = async () => {
        setLoading(true);
        try {
            const images = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                cropping: true,
            });

            // Append new images to the existing ones and mark them as local
            const localImages = images.map(img => ({
                ...img,
                isLocal: true,  // Add the flag to mark this as a locally picked image
            }));

            setSelectedImages(prevImages => [...prevImages, ...localImages]);
        } catch (error) {
            console.log('Image picker error:', error);
        }
        setLoading(false);
    };

    // Rendering Images
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: wp(3) }}>
        {Array.isArray(selectedImages) && selectedImages.length > 0 ? (
            selectedImages.map((img, i) => (
                <View key={i} style={styles.imageWrapper}>
                    {/* Image display */}
                    <Image
                        source={{ uri: img?.uri || img?.path || '' }}
                        style={styles.previewImage}
                    />

                    {/* Show edit option only for local images */}
                    {img.isLocal && (
                        <TouchableOpacity
                            onPress={() => showImageActionMenu(i)}
                            style={styles.imageActionBtn}
                        >
                            <MaterialCommunityIcons name="dots-horizontal" size={wp(4)} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            ))
        ) : (
            <Text>No images selected</Text>
        )}
    </ScrollView>

    // Remove selected image by index
    const handleRemoveImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setShowDropdownModal(false);  // Close dropdown modal after action
    };
    // Edit selected image (crop)
    const handleEditImage = async (index) => {
        try {
            const image = selectedImages[index];

            // Check if image is local and proceed with editing
            if (image.isLocal) {
                const editedImage = await ImagePicker.openCropper({
                    path: image.path, // Use the original path
                    width: 300,  // Set width as per your requirement
                    height: 300, // Set height as per your requirement
                    cropping: true,
                });

                // Update the selected images array, preserving isLocal flag
                const newImages = [...selectedImages];
                newImages[index] = { ...editedImage, isLocal: true };  // Add the flag back

                setSelectedImages(newImages);
            }
        } catch (error) {
            console.log('Error while editing image:', error);
        }
        setShowDropdownModal(false);  // Close dropdown modal after action
    };

    // Confirmation to post
    const handlePostConfirm = () => {
        setShowConfirmModal(false);
        handlePost(seletedPostUrn);
    };
    // Post to LinkedIn
  // Post to LinkedIn
const handlePost = async (id) => {
    if (!hasContent) return;  // Don't proceed if there is no content

    // Prepare the payload for the update
    let payload = {
        postId: id,  // Post URN (ID) to update
        orgId: org.id,  // Organization ID
        accessToken,  // LinkedIn Access Token
        postText,  // Post text content
        selectedImages,  // List of selected images
    };

    try {
        setLoading(true);  // Set loading state to true before making the API call
        const result = await updatePostToLinkedIn(payload);  // API call to update the post
        
        if (result?.success) {
            // Handle success (show success message, reset form, etc.)
            ToastAndroid.show('Post updated successfully!', ToastAndroid.SHORT);
            onClose();  // Close the modal or go back to the previous screen
        } else {
            // Handle failure (show error message, etc.)
            ToastAndroid.show(`Error: ${result.error}`, ToastAndroid.SHORT);
        }
    } catch (error) {
        // Handle any errors that might occur during the API call
        console.error('Error while updating post:', error);
        ToastAndroid.show('An error occurred while updating the post', ToastAndroid.SHORT);
    } finally {
        setLoading(false);  // Set loading state to false after the request completes
    }
};

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);  // Set loading state to true before making the request
            const result = await getPostDetails(accessToken, seletedPostUrn);  // Assuming getPostDetails is your API call
            setLoading(false);  // Set loading state to false after the request is complete
            if (result?.success) {
                // Extracting the post text
                const postText = result?.data?.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary?.text;
                const imageUrlData = result?.data?.specificContent['com.linkedin.ugc.ShareContent']?.media;
                const images = Array.isArray(imageUrlData)
                    ? imageUrlData.map(media => ({
                        uri: media?.originalUrl || '', // Use optional chaining to safely access 'originalUrl'
                        description: media?.description?.text || "No description", // Safely handle missing description
                    }))
                    : []; // Return an empty array if imageUrlData is not an array or is undefined
                setSelectedImages(images);
                setPostText(postText);
            } else {
                setError(result.error);  // Store the error in state
                ToastAndroid.show(`Error: ${result.error}`, ToastAndroid.SHORT);  // Show error in toast
            }
        };

        fetchData();
    }, [accessToken, seletedPostUrn]);  // Run effect when accessToken or selectedPostUrn changes

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
        if (action.value === 'Edit') {
            handleEditImage(imageActionIndex);  // Edit image at the selected index
        } else if (action.value === 'Remove') {
            handleRemoveImage(imageActionIndex);  // Remove image at the selected index
        }
        setShowDropdownModal(false);  // Close dropdown modal after action
    };

    return (
        <View style={styles.container(theme)}>
            <>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: wp(4), height: hp(7), backgroundColor: theme.background, paddingLeft: wp(6) }}>
                    <MaterialCommunityIcons name="chevron-left" onPress={() => onClose()} size={hp(3)} color={theme.textPrimary} style={{ marginRight: wp(4) }} />
                    <Text style={[Louis_George_Cafe.bold.h4, styles.schedueText]}>{'Edit Post'}</Text>
                </View>
                {loading ?
                    <ActivityIndicator size={wp(8)} style={{ marginTop: wp(8) }} color={theme?.primaryApp} />
                    :
                    <View style={{ backgroundColor: theme.background }}>
                        <View style={{ padding: wp(4) }}>
                            <View style={styles.topRow}>
                                {hasContent && (
                                    <TouchableOpacity onPress={() => setShowConfirmModal(true)} style={styles.tabButton(themeMode)}>
                                        <MaterialCommunityIcons name="square-edit-outline" size={hp(3)} color={theme.buttonText} />
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
                                    value={postText}  // Bind the fetched post text here
                                    onChangeText={handleChangeText}
                                />
                                {/* Display selected images */}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: wp(3) }}>
                                    {/* <Text>{selectedImages?.length}</Text> */}
                                    {/* Ensure selectedImages is an array and contains valid objects */}
                                    {Array.isArray(selectedImages) && selectedImages.length > 0 ? (
                                        selectedImages.map((img, i) => (
                                            <View key={i} style={styles.imageWrapper}>
                                                {/* Use optional chaining and default fallback */}
                                                <Image
                                                    source={{ uri: img?.uri || img?.path || '' }}  // Ensure either 'uri' or 'path' exists
                                                    style={styles.previewImage}
                                                />
                                                {!img.isLocal == '' ?
                                                    <TouchableOpacity
                                                        onPress={() => showImageActionMenu(i)}
                                                        style={styles.imageActionBtn}
                                                    >
                                                        <MaterialCommunityIcons name="dots-horizontal" size={wp(4)} color="#fff" />
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity
                                                        onPress={() => { showImageActionMenu(i), handleRemoveImage(i) }}
                                                        // onPress={() => showImageActionMenu(i)}
                                                        style={styles.imageActionBtn}
                                                    >
                                                        <MaterialCommunityIcons name="close" size={wp(4)} color="#fff" />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        ))
                                    ) : (
                                        <Text>No images selected</Text>  // Show a message if no valid images exist
                                    )}
                                </ScrollView>

                                {/* Add image picker icon */}
                                <TouchableOpacity onPress={pickImages} style={styles.imageIconWrap}>
                                    <MaterialCommunityIcons name="image-multiple" size={hp(3)} color={theme.textPrimary} />
                                </TouchableOpacity>
                            </View>
                            {/* Dropdown Modal for Image Action */}
                            {showDropdownModal && (
                                <DropdownModal
                                    visible={showDropdownModal}
                                    items={dropdownItems}
                                    onSelect={handleImageAction}
                                    onCancel={() => setShowDropdownModal(false)}
                                    title="Choose"
                                />
                            )}
                            {/* Confirmation Modal */}
                            <ConfirmationModal
                                visible={showConfirmModal}
                                message={"Are sure want to submit?"}
                                onConfirm={() => handlePostConfirm()}
                                onCancel={() => setShowConfirmModal(false)}
                            />

                        </View>
                    </View>
                }



            </>
        </View>
    );
};
const styles = StyleSheet.create({
    container: (theme) => ({
        flex: 1,
        backgroundColor: theme.background,
    }),
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
        alignSelf: "flex-start",
    },
    actionBtn: {
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
    },
    submitBtnText: {
        color: '#fff', fontSize: wp(4), fontWeight: 'bold'
    },
});
export default EditLInkedinPost;
