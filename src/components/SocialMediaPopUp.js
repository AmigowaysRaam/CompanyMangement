import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    FlatList, Image
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { getSocialMediasArray } from '../redux/authActions';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';

const SocialMediaPopUp = ({ isVisible, onCancel }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const { themeMode } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialMedias, setSocialMeddia] = useState([]);
    const userdata = useSelector((state) => state.auth.user?.data);

    useFocusEffect(
        React.useCallback(() => {
            fetchLeaveData();
        }, [userdata])
    );

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].card }]}>
            <View style={styles.cardHeader}>
                <View style={styles.leftSection}>
                    <Image
                        source={{ uri: item?.icon }}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={[Louis_George_Cafe.bold.h5, { color: THEMECOLORS[themeMode].black }]}>
                        {item.name}
                    </Text>
                </View>
                {!item.connected &&
                    <TouchableOpacity
                        // disabled={item.connected}
                        onPress={() => navigation.navigate('AddLeaveForm')} // replace with connect logic
                        style={[
                            styles.connectBtn,
                            {
                                backgroundColor
                                    : THEMECOLORS[themeMode].primaryApp
                            }
                        ]}
                    >
                        <Text style={[
                            Louis_George_Cafe.bold.h8,
                            {
                                color: THEMECOLORS[themeMode].white,
                                textTransform: "capitalize",
                                lineHeight: wp(4)
                            }
                        ]}>
                            {t('connect')}
                        </Text>
                        <MaterialCommunityIcons
                            name={'chevron-right'}
                            size={hp(2)}
                            color={THEMECOLORS[themeMode].white}
                            style={{ paddingHorizontal: wp(1) }}
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );


    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    const fetchLeaveData = () => {
        setLoading(true);
        dispatch(
            getSocialMediasArray(userdata?.id, (response) => {
                if (response.success) {
                    setSocialMeddia(response.data || []);
                    console.log(response.data)
                }
                setLoading(false);
                setRefreshing(false);
            })
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaveData();
    };

    return (
        <Modal
            isVisible={isVisible}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            animationInTiming={500}       // Slower slide in
            animationOutTiming={800}      // Slower slide out ✅
            backdropColor="black"
            backdropOpacity={0.5}
            backdropTransitionOutTiming={800}  // Fade out timing for backdrop ✅
            backdropTransitionInTiming={800}   // Optional: also slow fade-in
            onBackdropPress={!loading ? onCancel : null}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <>
                    <MaterialCommunityIcons
                        onPress={onCancel}
                        name={"close"}
                        size={hp(4)}
                        color={THEMECOLORS[themeMode].primaryApp}
                        style={{ marginVertical: wp(2), alignSelf: "flex-end" }}
                    />
                    {
                        loading ?
                            <ActivityIndicator style={{alignSelf:"center",marginTop:wp(10)}} />
                            :
                            <FlatList
                            showsHorizontalScrollIndicator={false}
                                data={socialMedias}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => `${item.platform}_${index}`}
                                contentContainerStyle={styles.listContainer}
                                ListEmptyComponent={
                                    <Text style={[Louis_George_Cafe.bold.h5, styles.emptyText, { color: THEMECOLORS[themeMode].textPrimary }]}>
                                        {t('no_data')}
                                    </Text>
                                }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[THEMECOLORS[themeMode].textPrimary]}
                                        tintColor={THEMECOLORS[themeMode].textPrimary}
                                    />
                                }
                            />
                    }

                </>

            </View>
        </Modal>
    );
};

export default SocialMediaPopUp;

const styles = StyleSheet.create({
    modal: {
        // // margin: 10,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#f9f9f9',
        width: '100%',
        // padding: wp(6),
        paddingHorizontal: wp(4),
        borderTopLeftRadius: wp(4),
        borderBottomLeftRadius: wp(4),
        position: "absolute",
        left: wp(6),
        top: hp(-1),
        minHeight:hp(52)
    },
    title: {
        // fontSize: wp(4),
        textAlign: 'center',
        marginBottom: hp(2),
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: hp(2),
    },
    button: {
        backgroundColor: '#013CA3',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: wp(2),
    },
    buttonText: {
        color: '#fff',
        fontSize: wp(4),
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#013CA3',
    },
    cancelText: {
        color: '#013CA3',
    },
    listContainer: {
        paddingBottom: hp(2),
    },
    card: {
        borderRadius: wp(3),
        borderBottomWidth: 1,
        borderColor: '#efefef',
        paddingVertical: wp(3),
        marginVertical: wp(1.5),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: wp(8),
        height: wp(8),
        marginRight: wp(3),
        borderRadius: wp(2),
    },
    connectBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(1),
        paddingVertical: wp(1.5),
        borderRadius: wp(2),
        justifyContent: "space-between"
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(10),
    },
});
