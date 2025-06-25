import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { COLORS } from '../resources/Colors';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatDetails, removeParticipant, updateParticipants } from '../redux/authActions';
import Icon from 'react-native-vector-icons/Ionicons';
import ConfirmationModal from '../components/ConfirmationModal';
import SelectMultipleEmp from './SelectMultipleTeam';

const GroupChatDetails = ({ route }) => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { chatId, projectName } = route.params;
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);

    const [participants, setParticipants] = useState([]);
    const [GroupDetails, setGroupDetails] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(() => { });
    const [confirmMessage, setConfirmMessage] = useState('');
    const [selectDropDown, setselectDropDown] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const onRefresh = () => {
        setRefreshing(true);
        fetchHomeData();
    };

    const fetchHomeData = () => {
        setIsLoading(true);
        const payload = {
            chatId,
            userId: userdata?.id,
        };
        dispatch(
            getChatDetails(payload, (response) => {
                if (response.success && response.participants?.length > 0) {
                    setParticipants(response.participants);
                    setEmployee(response?.participants);
                    setGroupDetails(response);
                }
                setIsLoading(false);
                setRefreshing(false);
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchHomeData();
        }, [userdata])
    );

    const handleRemove = (user) => {
        setConfirmMessage(`${t('remove')} ${user?.full_name}`);
        setConfirmAction(() => () => {
            const payload = {
                projectId: GroupDetails.projectid,
                memberId: user?.id,
                userid: userdata?.id,
            };
            dispatch(
                removeParticipant(payload, (response) => {
                    ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                    if (response.success) fetchHomeData();
                    setRefreshing(false);
                })
            );
        });
        setConfirmVisible(true);
    };

    const UpdateParticipants = (selectedIDs) => {
        const payload = {
            projectId: GroupDetails.projectid,
            memberId: selectedIDs.map(user => user?.id),
            userid: userdata?.id,
        };
        dispatch(
            updateParticipants(payload, (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                if (response.success) fetchHomeData();
                setRefreshing(false);
            })
        );
    };

    const renderParticipantItem = ({ item }) => (
        <View style={[styles.participantItem, { backgroundColor: themeMode == 'dark' ? '#f9f9f9' : '#c9c9c9' }]}>
            <Image
                source={item.profileImage ? { uri: item.profileImage } : require('../../src/assets/animations/anew.png')}
                style={styles.participantImage}
            />
            <View style={styles.participantDetails}>
                {
                    userdata?.id == item.id ?
                        <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].primaryText, textTransform: "capitalize" }]}>
                            {t('you')}
                        </Text>
                        :
                        <>
                            <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h7, { color: THEMECOLORS[themeMode].primaryText }]}>
                                {item.full_name}
                            </Text>
                            <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h9, { color: THEMECOLORS[themeMode].primaryText }]}>
                                📞 {item.phone}
                            </Text>
                        </>
                }

            </View>
            {userdata?.id !== item.id && (
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
                    <Icon name="remove-circle-outline" size={wp(6)} color="red" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={projectName} titleAlign={'center'} />
            {selectDropDown ? (
                <View style={{ padding: wp(5) }}>
                    <SelectMultipleEmp
                        selectedEIds={employee}
                        onClose={(selectedIDs) => {
                            setEmployee(selectedIDs);
                            setselectDropDown(false);
                            UpdateParticipants(selectedIDs);
                        }}
                    />
                </View>
            ) : isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.button_bg_color} />
                </View>
            ) : (
                <>
                    <Image
                        source={require('../../src/assets/animations/anew.png')}
                        style={[styles.participantImage, {
                            alignSelf: 'center',
                            width: wp(20),
                            height: wp(20),
                            borderRadius: wp(10),
                            marginTop: wp(4)
                        }]}
                    />
                    <View style={[styles.cardContainer, {
                        backgroundColor: THEMECOLORS[themeMode].cardBackground,
                        borderRadius: wp(1),
                    }]}>
                        <Text style={[Louis_George_Cafe.bold.h7, { marginBottom: wp(2) }]}>
                            {`${t('description')} : `}
                        </Text>
                        <Text
                            numberOfLines={showFullDescription ? undefined : 2}
                            style={[Louis_George_Cafe.regular.h8]}
                        >
                            {GroupDetails?.description}
                        </Text>
                        {GroupDetails?.description?.length > 100 && (
                            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                                <Text style={[Louis_George_Cafe.bold.h9, { color: COLORS.button_bg_color, marginTop: wp(2) }]}>
                                    {showFullDescription ? t('show_less') : t('read_more')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {participants.length === 0 ? (
                        <Text style={[Louis_George_Cafe.bold.h4, styles.noNotificationText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                            {t('no_data')}
                        </Text>
                    ) : (
                        <FlatList
                            ListHeaderComponent={<>
                                <Text style={[Louis_George_Cafe.regular.h1, {
                                    marginHorizontal: wp(4), textTransform: "capitalize"
                                }]}>{t('participants')}</Text>
                            </>}
                            data={participants}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderParticipantItem}
                            contentContainerStyle={{ paddingBottom: hp(10) }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[COLORS.button_bg_color]}
                                    tintColor={COLORS.button_bg_color}
                                />
                            }
                        />
                    )}
                    <TouchableOpacity style={styles.addButton} onPress={() => setselectDropDown(true)}>
                        <Icon name="person-add" size={28} color="#fff" />
                    </TouchableOpacity>
                </>
            )}

            <ConfirmationModal
                visible={confirmVisible}
                message={confirmMessage}
                onConfirm={() => {
                    confirmAction();
                    setConfirmVisible(false);
                }}
                onCancel={() => setConfirmVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(2)
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        padding: wp(3),
        borderRadius: wp(3),
        margin: wp(3),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(3),
        marginHorizontal: wp(3),
        marginVertical: wp(1),
        borderRadius: wp(2),
        elevation: 1,
    },
    participantImage: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        borderWidth: wp(0.3),
        borderColor: "#000",
    },
    participantDetails: {
        flex: 1,
        marginLeft: wp(3),
    },
    removeBtn: {
        padding: wp(1),
    },
    noNotificationText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
    addButton: {
        position: 'absolute',
        bottom: hp(4),
        right: wp(4),
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7),
        backgroundColor: COLORS.button_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
    },
});

export default GroupChatDetails;
