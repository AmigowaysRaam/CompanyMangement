import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  // Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { hp, wp } from '../resources/dimensions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updatrProfilePic } from '../redux/authActions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import Modal from 'react-native-modal';

const ProfileUploadPopUp = ({ isVisible, onCancel }) => {
  const navigation = useNavigation();
  const userdata = useSelector((state) => state.auth.user?.data);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);

  const [selectedImage, setSelectedImage] = useState(
    userdata?.profileImage ? { uri: userdata.profileImage } : null
  );
  const { themeMode } = useTheme();

  const handleCamera = async () => {
    setLoading(true);
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        setLoading(false);

        if (response.didCancel) {
          // console.log(t('user_cancelled_image_picker'));
        } else if (response.errorCode) {
          console.log(t('image_picker_error') + ': ', response.errorMessage);
          Toast.show({ text1: t('error_launching_camera'), type: 'error' });
        } else if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          setSelectedImage(image);
          setIsNewImage(true); // ✅ new image
        }
      }
    );
  };

  const handleFile = async () => {
    setLoading(true);
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && !result.errorCode && result.assets?.length > 0) {
      setSelectedImage(result.assets[0]);
      setIsNewImage(true); // ✅ new image

    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('userid', userdata?.id);
    formData.append('profileImage', {
      uri: selectedImage.uri,
      name: selectedImage.fileName || 'profile.jpg',
      type: selectedImage.type || 'image/jpeg',
    });

    dispatch(
      updatrProfilePic(formData, (response) => {
        setLoading(false);
        if (response.success) {
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
          onCancel();
        } else {
          ToastAndroid.show(t('failed'), ToastAndroid.SHORT);
        }
      })
    );
    console.log('Saved Image:', selectedImage);
  };
  const handleRemove = () => {
    if (userdata?.profileImage) {
      setSelectedImage({ uri: userdata.profileImage });
    } else {
      setSelectedImage(null);
    }
    setIsNewImage(false); // 🔁 back to original
  };
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => onCancel()}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
    // useNativeDriver={true}
    >
      <TouchableWithoutFeedback onPress={!loading ? onCancel : null}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <MaterialCommunityIcons
                onPress={onCancel}
                name="close"
                size={wp(8)}
                color="#000"
                style={styles.closeButton}
              />
              <Text style={styles.title}>{t('upload_profile_picture')}</Text>
              <>
                <View style={styles.contentContainer}>
                  {loading ? (
                    <ActivityIndicator
                      size={wp(10)}
                      style={{ marginTop: wp(10) }}
                      color={THEMECOLORS[themeMode].primaryApp}
                    />
                  ) : (
                    <>
                      <View style={styles.imagePreviewContainer}>
                        <Image
                          source={{ uri: selectedImage?.uri }}
                          style={styles.imagePreview}
                        />
                        {selectedImage && isNewImage && (
                          <TouchableOpacity onPress={handleRemove}>
                            <Text style={styles.removeText}>
                              {t('remove_image')}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <TouchableOpacity style={styles.button} onPress={handleCamera}>
                        <MaterialCommunityIcons
                          name="camera-outline"
                          size={wp(6)}
                          color="#fff"
                          style={styles.icon}
                        />
                        <Text style={styles.buttonText}>{t('take_photo')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button} onPress={handleFile}>
                        <MaterialCommunityIcons
                          name="image-outline"
                          size={wp(6)}
                          color="#fff"
                          style={styles.icon}
                        />
                        <Text style={styles.buttonText}>
                          {t('choose_from_gallery')}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                {!loading && (
                  <View style={styles.saveButtonContainer}>
                    <TouchableOpacity
                      style={[styles.button, { width: '100%' }]}
                      onPress={handleSave}
                      disabled={!selectedImage}
                    >
                      <Text style={styles.buttonText}>{t('save')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ProfileUploadPopUp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    // width:wp(100)
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    height: hp(70),
    borderRadius: wp(2),
    position: 'relative',
    paddingHorizontal: wp(6),
    paddingTop: wp(10),
    paddingBottom: wp(4),
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: wp(3),
    right: wp(4),
    zIndex: 10,
  },
  icon: {
    marginRight: wp(4),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  imagePreview: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(2),
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  removeText: {
    color: 'red',
    marginTop: wp(2),
    textDecorationLine: 'underline',
  },
  button: {
    marginVertical: wp(1.5),
    width: '80%',
    paddingVertical: 14,
    backgroundColor: '#013CA3',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonContainer: {
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
