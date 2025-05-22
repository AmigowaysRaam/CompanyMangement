import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  // SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, Modal,
  ImageBackground,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../resources/dimensions";
import { useSelector } from "react-redux";
import { deleteGroupMessages, deleteMessages, getGroupDetails, getListConversation, getListGroupMessages, getListMessages, getSiteSettings, getStickerArray, sendGroupMessage, updateUserStatus } from "../redux/authActions";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useWallpaper } from "../context/WallpaperContext";
import { Louis_George_Cafe } from "../resources/fonts";
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect
import { COLORS } from "../resources/Colors";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import ImageCropPicker from "react-native-image-crop-picker";
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';


const GroupChatScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { username, groupId, avatar } = route.params;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { wallpaper, changeWallpaper } = useWallpaper()
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const stickersArray = useSelector((state) => state.auth.stickersList);
  const [canSendMessages, setCanSendMessages] = useState(null);
  // const getFrontSite = useSelector((state) => state.auth.getFrontSite);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const [, setCanSendMessagesFlagLoad] = useState(null);

  useFocusEffect(

    React.useCallback(() => {
      setCanSendMessagesFlagLoad(true)
      // This code will run every time the screen is focused
      dispatch(getListMessages(userId, username));
      dispatch(getListGroupMessages(userId, groupId));
      dispatch(getStickerArray(userId));
      dispatch(
        getGroupDetails(userId, groupId, (response) => {
          const group = response.data[0];
          setCanSendMessages(group.allowSendMessage === 1 ? true : false)
          setCanSendMessagesFlagLoad(false)
        })
      );
      // Call your refresh function or set state here
      return () => {

      };
    }, []) // The empty array ensures the callback is called only when the screen is focused
  );


  const groupMessageList = useSelector(
    (state) => state.auth.groupMessageList[`${groupId}`]
  );


  const handleSendImage = async () => {

    const formData = new FormData();
    const payload = {
      userid: profile?._id,
      // fullname: name,
      // phonenumber: phoneNumber,
      // email: email,
    };

    // Append user details
    formData.append('userid', profile?._id);
    formData.append('fullname', name);  // Use updated state `name`
    formData.append('phonenumber', phoneNumber);
    formData.append('email', email);

    // Check if a new image is selected
    if (imageSelected?.uri) {
      formData.append('profilepicture', {
        uri: imageSelected.uri,  // URI of the selected image
        type: imageSelected.type || 'image/jpeg',  // MIME type (e.g. 'image/jpeg')
        name: imageSelected.fileName,  // The image file name (e.g. 'profile.jpg')
      });
    } else {
      formData.append('profilepicture', {
        uri: profileImage,
        type: 'image/jpeg',
        name: `${profile?.fullname}-profile`,
      });
    }

    // URL to which the request is sent
    const url = 'https://sana.scriptzol.in/api/?url=app-update-profile-user';

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',  // Ensure the correct content type for file uploads
      },
    })
      .then(response => response.json())  // Parse JSON response
      .then(responseJson => {
        if (responseJson.success) {
          // dispatch(updateUserProfile(payload))
          Toast.show({
            text1: 'Success',
            text2: responseJson.message,
            type: 'success',
          });
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        } else {
          Toast.show({
            text1: 'Error',
            text2: responseJson.message,
            type: 'error',
          });
        }
      })
      .catch(error => {
        console.error("Error in Sending Image: ", error);
        Toast.show({
          text1: 'Error',
          text2: 'There was an error Sending Image. Please try again later.',
          type: 'error',
        });
      });
  };
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenDialogBox = (item, e) => {
    // Get the location of the press
    const { pageX, pageY } = e.nativeEvent;

    // Set the popup location to the coordinates of the tap
    setModalPosition({ x: pageX, y: pageY });
    setIsModalVisible(true);
  }

  const handleSendSticker = (stickerUrl) => {

    if (stickerUrl) {
      const sendtStickerUrl = stickerUrl.value
      const newMessage = {
        id: new Date().getTime().toString(),
        text: sendtStickerUrl,
        stickerUrl: sendtStickerUrl,
        sender: "me",
        timestamp: new Date().toISOString(),
        position: "right",
        image: 1
      };

      // Add the sticker message to chat
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      dispatch(sendGroupMessage(userId, username, stickerUrl.key)); // Sending an empty text and sticker URL
      closeModal()
    }
  };

  useEffect(() => {
    if (userId) {
      setCanSendMessagesFlagLoad(false)
      dispatch(getListMessages(userId, username));
      dispatch(getListGroupMessages(userId, groupId));
      dispatch(getStickerArray(userId));
      dispatch(
        getGroupDetails(userId, groupId, (response) => {
          const group = response.data[0];
          setCanSendMessages(group.allowSendMessage === 1 ? true : false)
          setCanSendMessagesFlagLoad(true)
        })
      );
    }
  }, [userId]);

  useEffect(() => {
    if (groupMessageList && groupMessageList.length) {
      const formattedMessages = groupMessageList
        .map((item) => {
          if (item.message?.length > 0) {
            return {
              id: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
              text: item.message,
              messageid: item.messageid,
              position: item.position,
              sender: "me",
              username: item.username,
              userimage: item.userimage,
              timestamp: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
            };
          } else if (item.receivedmessage) {
            return {
              id: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
              text: item.receivedmessage,
              username: item.username,
              userimage: item.userimage,
              sender: "other",
              timestamp: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
            };
          }
          return null;
        })
        .filter(Boolean);
      setChatMessages(formattedMessages);
    }
  }, [groupMessageList]);

  const formatTimestamp = (timestamp) => {

    const now = new Date();
    const messageDate = new Date(timestamp);

    const isToday = now.toDateString() === messageDate.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      messageDate.toDateString();

    if (isToday) {
      return (
        "Today " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else if (isYesterday) {
      return (
        "Yesterday " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return (
        messageDate.toLocaleDateString() +
        " " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };


  const handleSend = () => {

    if (message.trim()) {
      const newMessage = {
        id: new Date().getTime().toString(),
        text: message,
        sender: "me",
        timestamp: new Date().toISOString(),
        position: "right", // Set the position for sent messages
      };
      // Update chat messages to include the new message at the end
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      // Clear the input field
      setMessage("");
      // Send message via WebSocket
      // socket.send(JSON.stringify(newMessage));
      dispatch(sendGroupMessage(userId, groupId, message));
      dispatch(getListConversation(userId));
      dispatch(getListGroupMessages(userId, groupId));
      dispatch(getSiteSettings(userId));
    }
  };
  // handleNaviagteGroupDetails
  const handleNaviagteGroupDetails = () => {
    navigation.navigate("GroupDetailsScreen", { groupId, });
  };

  const renderMessage = ({ item, handleAlertDelete, handleOpenDialogBox }) => (

    <TouchableWithoutFeedback
    
    >
      <TouchableOpacity
        onPress={(e) => { item.position !== 'right' && handleOpenDialogBox(item, e) }}
        onLongPress={(e) => item.position === "right" ? handleAlertDelete(item) : handleOpenDialogBox(item, e)}
        style={
          item.position === "right"
            ? styles.myMessageContainer
            : styles.otherMessageContainer
        }
      >
        <View
          style={item.position === "right" ? !item.image && styles.myMessage : !item.image && styles.otherMessage}>
          {
            item.position !== "right" ? (
              <View style={styles.userInfo}>
                {/* Profile picture with the user's image */}
                <Image source={item.userimage ? { uri: item.userimage } : ""} style={styles.profilePic} />
                {/* User's name with the default styling */}
                <Text numberOfLines={1} style={[styles.userName, { maxWidth: wp(30) }]}>{item.username}</Text>
              </View>
            )
              :
              <View style={styles.userInfo}>
                {/* Profile picture with the user's image */}
                <Image source={item.userimage ? { uri: item.userimage } : ""} style={styles.profilePic} />
                {/* User's name with white color overriding default styling */}
                <Text numberOfLines={1} style={[styles.userName, { color: "#fff", maxWidth: wp(30) }]}>{item.username}</Text>
              </View>
          }

          {item.image ? (
            <Image source={item.text ? { uri: item.text } : ""} style={styles.stickerImage} />
          ) : (
            <Text style={item.position === "right" ? styles.messageText : styles.othermessageText}>
              {item.text}
            </Text>
          )}
          {/* Display Timestamp */}
          <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
            <Text
              style={[
                styles.timestamp,
                Louis_George_Cafe.regular.h9,
                {
                  color: item.position === "right" ? "#FFF" : "#000",
                },
              ]}
            >
              {formatTimestamp(item.timestamp)}
            </Text>
            {
              item.position === "right" &&
              <Text style={{ position: "relative", top: wp(2), left: wp(1), color: "#FFF" }}>
                <MaterialIcons name={"check"} size={14} style={[styles.nocon,]} color={COLORS.black} />
              </Text>
            }

          </View>

        </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );

  const handleAlertDelete = (item) => {
    // Show confirmation alert
    Alert.alert(
      "Are you sure?",
      "Do you want to delete this message?",
      [
        {
          text: "No", // No button
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes", // Yes button
          onPress: () => fnHandleDeleteMessage(item),
        },
      ],
      { cancelable: false } // Prevent closing the alert by clicking outside
    );
  };

  function fnHandleDeleteMessage(item) {
    // alert(JSON.stringify(item))

    dispatch(
      deleteGroupMessages(userId, item.messageid, (response) => {
        console.log(response.message, 'deleteMessage')
        Toast.show({
          text1: response.message,
          type: 'success',
          position: 'top',
        });
        dispatch(getListMessages(userId, username));

        dispatch(getListGroupMessages(userId, groupId));
        // dispatch(getListConversation(userId));
      })
    );
  }

  // 
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [audioFile, setAudioFile] = useState('');
  const [storedAudioFiles, setStoredAudioFiles] = useState([]); // To store list of recorded files

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAudioPermission(); // Request permission for Android
    }
  }, []);

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          // console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          ImageCropPicker.openCropper({
            path: response.assets[0].uri,
            width: 800,
            height: 1200,
          }).then((image) => {
            handleCreateStory(image?.path);

          });
        }
      }
    );
  };
  const emojiList = ['👍', '❤️', '😂', '😢', '😲'];


  // app-send-message-group
  const handleCreateStory = async (image) => {

    // const userId = "user123";
    const apiUrl = "https://sana.scriptzol.in/api/?url=app-send-message-group";
    if (!image) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    const formData = new FormData();

    formData.append("userid", userId);
    formData.append("message", "image");
    formData.append("tousername", username);

    const imageData = {
      uri: image,
      type: "image/jpeg",
      name: "story-image.jpg",
    };

    formData.append("image", imageData);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      // console.log(response,"result")
      const result = await response.json();
      if (result.success) {
        console.log(result, "result")
        console.log("Success", "Message Sent to Group successfully.");
        // onRefresh();
        setImageUri(null);
      } else {
        // Alert.alert("Error", "Failed to upload story. Please try again.");
      }
    } catch (error) {
      console.log("Error uploading story:", error);
      // Alert.alert("Error", "Failed to upload story. Please try again.");
    }
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          ImageCropPicker.openCropper({
            path: response.assets[0].uri,
            width: 300,
            height: 400,
          }).then((image) => {
            setImageUri(image.path);
          });
        }
      }
    );
  };

  // Request permission to record audio on Android
  const requestAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Denied', 'You need to allow the microphone permission');
    }
  };

  // Start Recording
  const startRecording = async () => {
    if (!isRecording) {

      const path = `${RNFS.DocumentDirectoryPath}/hello_${new Date().getTime()}.mp4`; // Unique filename based on timestamp

      try {
        await audioRecorderPlayer.startRecorder(path);
        audioRecorderPlayer.addRecordBackListener((e) => {
          setRecordingTime(audioRecorderPlayer.mmssss(e.current_position));
        });

        setIsRecording(true);
        setAudioFile(path); // Store the path of the audio file
      } catch (error) {
        console.error("Error starting recorder: ", error);
        Alert.alert('Error', JSON.stringify(error));
      }
    }
    else {
      stopRecording();
    }
  };

  // Stop Recording
  const stopRecording = async () => {
    if (isRecording) {
      try {
        await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);
        // Store the audio file path in your stored files list for later access
        setStoredAudioFiles((prevFiles) => [...prevFiles, audioFile]);
        Alert.alert('Recording Stopped', `Audio file saved at ${audioFile}`);
      } catch (error) {
        console.error("Error stopping recorder: ", error);
        Alert.alert('Error', 'Failed to stop recording');
      }
    }
    else {
      startRecording();
    }

  };

  return (
    <ImageBackground
      source={wallpaper ? { uri: wallpaper ? wallpaper : "" } : ""}
      style={styles.imageBackground}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {
          backgroundColor: wallpaper === null && COLORS.black,
        }]}>
          <LinearGradient
            colors={["#F0F0F0", "#FFF"]}
            style={styles.headContainer}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconContainer}
            >
              <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileContainer}
              onPress={() => handleNaviagteGroupDetails()}>
              <Image
                source={avatar ? {
                  uri: avatar,
                } : ""}
                style={styles.profileImage}
              />
              <View style={styles.textContainer}>
                <Text numberOfLines={1} style={[styles.name, { textTransform: "capitalize", width: wp(55) }]}>{username}</Text>
                <Text style={styles.about}>Group Members</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <FlatList
            inverted
            data={chatMessages}
            renderItem={({ item }) => renderMessage({ item, handleAlertDelete, handleOpenDialogBox })}

            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
          // ListFooterComponent={ListFooter}
          />
          <Toast zIndex={1} />

          {
            !canSendMessages ?
              <>
                <View style={[styles.noContainer]}>
                  <TextInput
                    editable={false}
                    style={styles.textInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="You can't send messages to this group" />
                </View>
              </>
              :
              <View style={{ flexDirection: "row" }}>
                <View style={styles.noContainer}>
                  {
                    isRecording ?
                      <LottieView
                        speed={3}
                        source={require("../assets/animations/recording.json")}
                        style={{ width: wp(72), height: hp(4) }}
                        autoPlay
                        loop={true}
                      />
                      :
                      <TextInput
                        style={styles.textInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type Your Message" />
                  }


                  <TouchableOpacity onPress={openGallery}
                    style={{ borderRadius: wp(8) / 2, height: wp(8), width: wp(8), }}
                  >
                    <MaterialIcons name="attachment" size={30} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={openCamera}
                  style={{ borderRadius: wp(8) / 2, height: wp(8), width: wp(8), }}
                >
                  <MaterialIcons name="camera-enhance" size={28} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                </TouchableOpacity> */}
                </View>
                {
                  message == '' ?
                    <>
                      {/* <TouchableOpacity onPressIn={startRecording}
                      onPressOut={stopRecording}
                      style={{ borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1) }}
                    >
                      <MaterialIcons name={isRecording ? "stop-circle" : 'mic'} size={24} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                    </TouchableOpacity> */}

                      {
                        isRecording ?
                          <TouchableOpacity
                            onPress={() => stopRecording()}
                            style={{
                              borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1), marginBottom: wp(1),
                              marginHorizontal: wp(1.5)
                            }}
                          >
                            <MaterialIcons name={isRecording ? "stop-circle" : 'mic'} size={34} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={() => startRecording()}
                            style={{
                              borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1),
                              marginBottom: wp(1),
                              marginHorizontal: wp(1.5)
                            }}
                          >
                            <MaterialIcons name="mic" size={34} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                          </TouchableOpacity>
                      }
                    </>
                    :

                    <TouchableOpacity onPress={handleSend}
                      style={{ borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1) }}
                    >
                      <MaterialIcons name="telegram" size={36} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                    </TouchableOpacity>
                }


              </View>

          }
          {/* Modal Box */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={() => closeModal()}>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { top: modalPosition.y - 50, },]}>
                  <FlatList
                    contentContainerStyle={{
                      marginTop: wp(1)
                    }}
                    horizontal={true}
                    data={emojiList}
                    keyExtractor={(item) => item._id}
                    style={{ paddingLeft: wp(2), flex: 1, marginHorizontal: wp(0), }}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSendSticker(item)} style={{ marginTop: wp(0.5) }}>
                        <Text style={styles.emoji}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Icon name="close" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({

  noContainer: {

    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: wp(1),
    backgroundColor: "#fff",
    borderRadius: wp(5),
    paddingHorizontal: 10,
    width: wp(86),
    borderColor: '#838383',
    borderWidth: wp(0.5),
    marginBottom: wp(2),
    marginVertical: wp(0.5)

  },
  userInfo: {
    flexDirection: 'row',
    padding: wp(1)
  },
  emoji: {
    fontSize: wp(4),
    marginBottom: wp(2),
    marginHorizontal: wp(1),
  },

  profilePic: {
    width: wp(5), // Adjust size as needed
    height: wp(5),
    borderRadius: wp(5), // Make the image circular
    marginRight: wp(2),
    borderColor: COLORS.button_bg_color,
    borderWidth: wp(0.3)
  },
  userName: {
    fontSize: 14,
    marginBottom: wp(2)
  },
  modalOverlay: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",

  },
  stickerList: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(7),
    margin: wp(6),
  },
  closeButton: {
    position: 'absolute', // Absolutely position the button inside the modalContent
    top: 2, // 10px from the top
    right: 10, // 10px from the right
    zIndex: 1, // Ensure it's above other elements if needed
  },
  stickerItem: {
    alignItems: 'center',
    paddingBottom: wp(5),
    margin: wp(1)
  },
  stickerImage: {
    width: wp(45), // Size of each sticker
    height: wp(45),
    resizeMode: 'contain',
  },
  modalContent: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: '#555555',
    width: wp(55),
    height: wp(10),
    borderColor: "#888888",
    borderRadius: wp(10),
    marginHorizontal: wp(3)
  },

  modalText: {
    fontSize: 18,
    marginBottom: wp(5),
  },
  imageBackground: {
    flex: 1,
    height: hp(100)

  },
  noIcon: {
    backgroundColor: "#a020cb",
    borderRadius: wp(4),
    marginHorizontal: 5,
  },

  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 70,
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  iconContainer: {
    // marginRight: 15,
    paddingHorizontal: wp(2)
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    borderColor: COLORS.button_bg_color,
    borderWidth: wp(0.3),
    marginHorizontal: wp(3),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "#fff",
  },
  about: {
    fontSize: 14,
    // color: "#fff",
  },
  myMessageContainer: {
    alignItems: "flex-end",
    margin: wp(2),
  },
  otherMessageContainer: {
    alignItems: "flex-start",
    margin: wp(2),
  },
  myMessage: {
    backgroundColor: "#a020cb",
    borderRadius: 10,
    padding: wp(3),
    maxWidth: wp(80),
  },
  otherMessage: {
    backgroundColor: "#f1f0f0",
    borderRadius: 10,
    padding: wp(3),
    maxWidth: wp(80),
  },
  messageText: {
    fontSize: 16,
    color: "#fff"
  },

  timestamp: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    marginRight: wp(10),

  },
});

export default GroupChatScreen;