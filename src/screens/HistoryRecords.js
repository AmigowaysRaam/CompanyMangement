// components/HistoryRecords.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { THEMECOLORS } from '../resources/colors/colors';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const HistoryRecords = ({ loading, history }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        console.log(JSON.stringify(history, null, 2));
    }, [history]);

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';
        const format = 'hh:mm A';
        const startDate = moment(start, format);
        const endDate = moment(end, format);
        const duration = moment.duration(endDate.diff(startDate));
        const minutes = duration.asMinutes();
        return `(${Math.round(minutes)} min)`;
    };

    const renderItem = ({ item, index }) => {
        const isExpanded = expandedIndex === index;

        return (
            <View>
                <TouchableOpacity
                    onPress={() => setExpandedIndex(isExpanded ? null : index)}
                    style={[
                        styles.recordRow,
                        {
                            backgroundColor: index % 2 === 0 ? "#efefef" : "#F5F8FF",
                        },
                    ]}
                >
                    <Text style={[Louis_George_Cafe.regular.h9, styles.cell]}>
                        {item?.date}
                    </Text>
                    <Text style={[Louis_George_Cafe.regular.h9, styles.cell]}>
                        {item?.punchInTime || '-'}
                    </Text>
                    <Text style={[Louis_George_Cafe.regular.h9, styles.cell]}>
                        {item?.punchOutTime || '-'}
                    </Text>
                    <Text style={[Louis_George_Cafe.regular.h9, styles.cell]}>
                        {`${item?.totalWorkedHours} h` || '-'}
                    </Text>
                    <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={wp(4)}
                        color="#333"
                    // style={{ marginRight: wp(1) }}
                    />
                </TouchableOpacity>
                {isExpanded ? (
                    (item?.lunch?.start && item?.lunch?.end) || (item?.breaks?.length > 0) ? (
                        <View style={styles.expandContainer}>
                            {item?.lunch?.start && item?.lunch?.end && (
                                <View style={styles.detailRow}>
                                    <MaterialCommunityIcons name="food" size={wp(5)} color="#333" />
                                    <Text style={[Louis_George_Cafe.regular.h9, styles.detailText]}>
                                        {t('lunch')} : {item.lunch.start} - {item.lunch.end} {calculateDuration(item.lunch.start, item.lunch.end)}
                                    </Text>
                                </View>
                            )}
                            {item?.breaks?.length > 0 && item.breaks.map((brk, i) => (
                                <View key={i} style={styles.detailRow}>
                                    <AntDesign name="pausecircle" size={wp(5)} color="#666" />
                                    <Text style={[Louis_George_Cafe.regular.h9, styles.detailText]}>
                                        {t('break')} {i + 1}: {brk.start} - {brk.end} {calculateDuration(brk.start, brk.end)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>{t('no_data')}</Text>
                        </View>
                    )
                ) : null}


            </View>
        );
    };

    const staticMapItems = Array.from({ length: 7 }, (_, i) => i);

    const renderStaticMapItem = () => (
        staticMapItems.map((_, index) => (
            <View
                key={index}
                style={{
                    backgroundColor: themeMode === 'dark' ? "#ddd" : "#ccc",
                    width: wp(90),
                    height: hp(4),
                    borderRadius: wp(3),
                    alignSelf: "center",
                    marginVertical: wp(2),
                }}
            />
        ))
    );

    return (
        <View style={styles.container}>
            <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].cardBackground }]}>
                <Text style={[Louis_George_Cafe.bold.h6, { alignSelf: "center", marginBottom: hp(2) }]}>
                    {t('recent_report')}
                </Text>

                <View style={styles.headerRow}>
                    <Text style={[Louis_George_Cafe.bold.h9, styles.cell, styles.headerCell]}>
                        {t('date')}
                    </Text>
                    <Text style={[Louis_George_Cafe.bold.h9, styles.cell, styles.headerCell]}>
                        {t('in')}
                    </Text>
                    <Text style={[Louis_George_Cafe.bold.h9, styles.cell, styles.headerCell]}>
                        {t('out')}
                    </Text>
                    <Text style={[Louis_George_Cafe.bold.h9, styles.cell, styles.headerCell]}>
                        {t('total_working')}
                    </Text>
                </View>

                {loading ? (
                    renderStaticMapItem()
                ) : (
                    <FlatList
                        scrollEnabled={true}
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item._id || index.toString()}
                        contentContainerStyle={{
                            paddingBottom: hp(3),
                            flexGrow: 1,
                        }}
                        ListEmptyComponent={
                            <Text style={{ alignSelf: "center", margin: hp(10) }}>
                                {t('no_data')}
                            </Text>
                        }
                    />
                )}

                {history.length !== 0 && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginHistory')}
                        style={{
                            alignSelf: "center",
                            margin: wp(2),
                            paddingHorizontal: wp(3),
                            borderWidth: wp(0.3),
                            borderRadius: wp(5)
                        }}
                    >
                        <Text style={[Louis_George_Cafe.regular.h8, { lineHeight: wp(5) }]}>
                            {t('viewAll')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        maxHeight: wp(40),
        position: "relative",
        top: hp(5),
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: hp(1),
        marginBottom: hp(1),
    },
    recordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.1),
        padding: hp(2),
        borderRadius: wp(1),
        borderBottomWidth: wp(0.1),
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    headerCell: {
        fontWeight: 'bold',
    },
    noDataContainer: {
        backgroundColor: '#f0f0f0', // or any color you prefer
        padding: wp(1),
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 10,
        borderBottomEndRadius: wp(2),
        borderBottomStartRadius: wp(2),
        minHeight: hp(4), // optional for better vertical centering
    },

    noDataText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },

    card: {
        padding: wp(2),
        marginBottom: hp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: wp(100),
        borderTopLeftRadius: wp(10),
        borderTopRightRadius: wp(10),
        paddingVertical: wp(4),
        minHeight: wp(90),
        paddingBottom: wp(10),
        borderColor: "#CCC",
        borderWidth: wp(0.3),
    },
    expandContainer: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: wp(5),
        paddingVertical: wp(2),
        marginBottom: hp(1),
        borderBottomLeftRadius: wp(2),
        borderBottomRightRadius: wp(2),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(0.3),
    },
    detailText: {
        marginLeft: wp(2),
        fontSize: wp(3),
        color: '#444',
    },
});

export default HistoryRecords;
