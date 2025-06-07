// components/HistoryRecords.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { THEMECOLORS } from '../resources/colors/colors';

const HistoryRecords = ({ loading, history }) => {
    const { themeMode } = useTheme();
    const { t } = useTranslation();

    useEffect(() => {
        // Add any initialization logic here
    }, []);

    const renderItem = ({ item, index }) => (
        <View
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
            <Text style={[Louis_George_Cafe.regular.h9, styles.cell]}>-</Text>
            <Text style={[Louis_George_Cafe.regular.h9, styles.cell]}>-</Text>
        </View>
    );

    const staticMapItems = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const renderStaticMapItem = () => {
        return staticMapItems.map((item, index) => (
            <View
                key={index}
                style={{
                    backgroundColor: themeMode === 'dark' ? "#efefef" : "#f1f1f1",
                    width: wp(90),
                    height: hp(4),
                    borderRadius: wp(3),
                    alignSelf: "center",
                    marginVertical: wp(2),
                }}
            />
        ));
    };

    return (
        <View style={[styles.container, {
        }]}>
            <View style={[styles.card, {
                backgroundColor: THEMECOLORS[themeMode].cardBackground
            }]}>
                {/* <View style={{
                    width: wp(20), height: wp(1.5), backgroundColor: "#D9D9D9",
                    borderRadius: wp(2), alignSelf: "center",marginBottom:wp(4)
                }} /> */}
                <Text
                    style={[
                        Louis_George_Cafe.bold.h6,
                        {
                            alignSelf: "center",
                            marginBottom: hp(2),
                        },
                    ]}
                >
                    {t('recent_report')}
                </Text>
                <View style={styles.headerRow}>
                    <Text
                        style={[
                            Louis_George_Cafe.bold.h9,
                            styles.cell,
                            styles.headerCell,
                        ]}
                    >
                        {t('date')}
                    </Text>
                    <Text
                        style={[
                            Louis_George_Cafe.bold.h9,
                            styles.cell,
                            styles.headerCell,
                        ]}
                    >
                        {t('in')}
                    </Text>
                    <Text
                        style={[
                            Louis_George_Cafe.bold.h9,
                            styles.cell,
                            styles.headerCell,
                        ]}
                    >
                        {t('out')}
                    </Text>
                    <Text
                        style={[
                            Louis_George_Cafe.bold.h9,
                            styles.cell,
                            styles.headerCell,
                        ]}
                    >
                        {t('break')}
                    </Text>
                    <Text
                        style={[
                            Louis_George_Cafe.bold.h9,
                            styles.cell,
                            styles.headerCell,
                        ]}
                    >
                        {t('lunch')}
                    </Text>
                </View>

                {loading ? (
                    renderStaticMapItem()
                ) : (
                    <FlatList
                        scrollEnabled={true}
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingBottom: hp(3),
                            flexGrow: 1,
                        }}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    alignSelf: "center",
                                    margin: hp(10),
                                }}
                            >
                                {t('no_data')}
                            </Text>
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp(3),
    },
    title: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        marginBottom: hp(1),
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
        marginBottom: hp(0.1),
        padding: hp(2),
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    headerCell: {
        fontWeight: 'bold',
    },

    card: {
        // backgroundColor: '#fff',
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
        flex: 1,
    },
});

export default HistoryRecords;
