import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Animated, Easing, ToastAndroid, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { wp, hp } from '../resources/dimensions';
import HistoryRecords from './HistoryRecords';
import { useDispatch, useSelector } from 'react-redux';
import { getPunchinOutHistory, punchInOutApi } from '../redux/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATIC_COLORS = {
    text: '#333',
    textSecondary: '#666',
    buttonIn: '#013CA3',
    buttonOut: '#dc3545',
    break: '#ffc107',
    lunch: '#17a2b8',
    buttonText: '#ffffff',
};

const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const PunchInOut = () => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data);

    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [punchTime, setPunchTime] = useState(null);
    const [elapsed, setElapsed] = useState('00:00:00');

    const [loading, setIsloading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const [isOnBreak, setIsOnBreak] = useState(false);
    const [breakStart, setBreakStart] = useState(null);
    const [breakDuration, setBreakDuration] = useState('00:00:00');

    const [isOnLunch, setIsOnLunch] = useState(false);
    const [lunchStart, setLunchStart] = useState(null);
    const [lunchDuration, setLunchDuration] = useState('00:00:00');

    const [storedUserId, setStoredUserId] = useState(null);
    const scaleAnim = useState(new Animated.Value(1))[0];

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    // Load persisted state
    useEffect(() => {
        const loadAllPersistedState = async () => {
            try {
                const storedPunch = await AsyncStorage.getItem('punchInTime');
                const storedBreak = await AsyncStorage.getItem('breakStart');
                const storedLunch = await AsyncStorage.getItem('lunchStart');
                const storedIsBreak = await AsyncStorage.getItem('isOnBreak');
                const storedIsLunch = await AsyncStorage.getItem('isOnLunch');
                const storedUid = await AsyncStorage.getItem('punchUserId');

                if (storedUid) setStoredUserId(Number(storedUid));

                if (storedPunch) {
                    setPunchTime(Number(storedPunch));
                    setIsPunchedIn(true);
                }
                if (storedBreak && storedIsBreak === 'true') {
                    setBreakStart(Number(storedBreak));
                    setIsOnBreak(true);
                }
                if (storedLunch && storedIsLunch === 'true') {
                    setLunchStart(Number(storedLunch));
                    setIsOnLunch(true);
                }
            } catch (err) {
                console.error('Failed to load persisted state', err);
            } finally {
                setInitialLoading(false);
            }
        };
        loadAllPersistedState();
    }, []);

    // Timers
    useEffect(() => {
        let interval;
        if (isPunchedIn && punchTime) {
            interval = setInterval(() => {
                const diff = Date.now() - punchTime;
                setElapsed(formatTime(diff));
            }, 1000);
        } else {
            setElapsed('00:00:00');
        }
        return () => clearInterval(interval);
    }, [isPunchedIn, punchTime]);

    useEffect(() => {
        let interval;
        if (isOnBreak && breakStart) {
            interval = setInterval(() => {
                const diff = Date.now() - breakStart;
                setBreakDuration(formatTime(diff));
            }, 1000);
        } else {
            setBreakDuration('00:00:00');
        }
        return () => clearInterval(interval);
    }, [isOnBreak, breakStart]);

    useEffect(() => {
        let interval;
        if (isOnLunch && lunchStart) {
            interval = setInterval(() => {
                const diff = Date.now() - lunchStart;
                setLunchDuration(formatTime(diff));
            }, 1000);
        } else {
            setLunchDuration('00:00:00');
        }
        return () => clearInterval(interval);
    }, [isOnLunch, lunchStart]);

    // Fetch History
    useEffect(() => {
        const uid = userdata?.id || storedUserId;
        if (!uid) return;

        setIsloading(true);
        dispatch(getPunchinOutHistory(uid, (response) => {
            if (response.success) {
                setHistory(response.data);
            }
            setIsloading(false);
        }));
    }, [isOnBreak, breakStart, isOnLunch, lunchStart, isPunchedIn, punchTime, storedUserId]);

    const handlePunchToggle = async () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
        ]).start();

        if (!isPunchedIn) {
            const now = Date.now();
            await AsyncStorage.setItem('punchInTime', now.toString());
            if (userdata?.id) {
                await AsyncStorage.setItem('punchUserId', userdata.id.toString());
                setStoredUserId(userdata.id);
            }
            setPunchTime(now);
            setIsPunchedIn(true);
            dispatch(punchInOutApi(userdata?.id, "in", (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
            }));
        } else {
            await AsyncStorage.multiRemove(['punchInTime', 'breakStart', 'lunchStart', 'isOnBreak', 'isOnLunch', 'punchUserId']);
            setIsPunchedIn(false);
            setPunchTime(null);
            setIsOnBreak(false);
            setIsOnLunch(false);
            setBreakStart(null);
            setLunchStart(null);
            setBreakDuration('00:00:00');
            setLunchDuration('00:00:00');
            dispatch(punchInOutApi(userdata?.id || storedUserId, "out", (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
                dispatch(getPunchinOutHistory(userdata?.id || storedUserId, (res) => {
                    if (res.success) {
                        setHistory(res.data);
                    }
                }));
            }));
        }
    };

    const toggleBreak = async () => {
        if (isOnBreak) {
            await AsyncStorage.multiRemove(['breakStart', 'isOnBreak']);
            setIsOnBreak(false);
            setBreakStart(null);
            dispatch(punchInOutApi(userdata?.id || storedUserId, "break_out", (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
            }));
        } else {
            const now = Date.now();
            await AsyncStorage.setItem('breakStart', now.toString());
            await AsyncStorage.setItem('isOnBreak', 'true');
            setIsOnBreak(true);
            setBreakStart(now);
            dispatch(punchInOutApi(userdata?.id || storedUserId, "break_in", (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
            }));
        }
    };

    const toggleLunch = async () => {
        if (isOnLunch) {
            await AsyncStorage.multiRemove(['lunchStart', 'isOnLunch']);
            setIsOnLunch(false);
            setLunchStart(null);
            dispatch(punchInOutApi(userdata?.id || storedUserId, "lunch_out", (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
            }));
        } else {
            const now = Date.now();
            await AsyncStorage.setItem('lunchStart', now.toString());
            await AsyncStorage.setItem('isOnLunch', 'true');
            setIsOnLunch(true);
            setLunchStart(now);
            dispatch(punchInOutApi(userdata?.id || storedUserId, "lunch_in", (response) => {
                ToastAndroid.show(`${response.message}`, ToastAndroid.SHORT);
            }));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeMode?.background || '#fff' }]}>
            <HeaderComponent showBackArray={true} title={t('punchInOut')} />
            <View style={styles.content}>
                {
                    initialLoading ? <ActivityIndicator size="large" color={themeMode === 'dark' ? "#555" : '#000'} />
                        :
                        <>
                            <Text style={[styles.statusText, { color: STATIC_COLORS.text }]}>
                                {isPunchedIn ? t('youArePunchedIn') : t('youArePunchedOut')}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                                {isPunchedIn &&
                                    <MaterialCommunityIcons name={'radiobox-marked'} size={hp(2.8)} color={'red'} />
                                }
                                <Text style={[styles.timestamp, { color: STATIC_COLORS.textSecondary }]}>
                                    {t('duration')}: {elapsed}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", width: wp(95), justifyContent: "space-around" }}>
                                <View>
                                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                {
                                                    backgroundColor: isPunchedIn ? STATIC_COLORS.buttonOut : STATIC_COLORS.buttonIn,
                                                    width: wp(30),
                                                    height: wp(30),
                                                    borderRadius: wp(15),
                                                },
                                            ]}
                                            onPress={handlePunchToggle}
                                        >
                                            <MaterialCommunityIcons
                                                name={isPunchedIn ? 'logout' : 'login'}
                                                size={wp(5)}
                                                color={STATIC_COLORS.buttonText}
                                            />
                                            <Text style={styles.buttonText}>
                                                {isPunchedIn ? t('punchOut') : t('punchIn')}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </View>

                                {isPunchedIn && (
                                    <View>
                                        <TouchableOpacity
                                            style={[styles.subButton, { backgroundColor: STATIC_COLORS.break }]}
                                            onPress={toggleBreak}
                                        >
                                            <Text style={styles.subButtonText}>
                                                {isOnBreak ? 'End Break' : 'Start Break'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.subButton, { backgroundColor: STATIC_COLORS.lunch }]}
                                            onPress={toggleLunch}
                                        >
                                            <Text style={styles.subButtonText}>
                                                {isOnLunch ? 'End Lunch' : 'Start Lunch'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </>
                }
            </View>

            <HistoryRecords loading={loading} history={history} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: wp(1),
        height: hp(35)
    },
    statusText: {
        fontSize: wp(5),
        marginBottom: hp(1),
        fontWeight: '600',
    },
    timestamp: {
        fontSize: wp(4),
        marginBottom: hp(2),
        marginHorizontal: wp(2)
    },
    subButton: {
        marginTop: hp(1),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: wp(8),
        elevation: 3,
        width: wp(40),
        height: wp(12),
    },
    subButtonText: {
        color: '#fff',
        fontSize: wp(4),
        fontWeight: '600',
        textAlign: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(2),
        borderWidth: wp(1),
        borderColor: "#c5c5c5",
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(0.5) },
        shadowOpacity: 0.2,
        shadowRadius: wp(2),
    },
    buttonText: {
        color: STATIC_COLORS.buttonText,
        fontSize: wp(3.5),
        marginLeft: wp(1),
        fontWeight: 'bold',
        lineHeight: wp(6),
    },
});

export default PunchInOut;
