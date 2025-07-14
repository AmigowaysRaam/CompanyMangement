// components/CompanyProjects.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { THEMECOLORS } from "../../resources/colors/colors";
import { useTheme } from "../../context/ThemeContext";

const CompanyProjects = ({ tdata }) => {
    const [data, setData] = useState([]);
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    const { themeMode } = useTheme();

    useEffect(() => {
        if (tdata) {
            setData(tdata);
        }
    }, [tdata]);

    const renderItem = ({ item }) => (
        <View style={[styles.card, {
            // backgroundColor: themeMode === 'light' ? '#F9F9F9' : '#666',
            // shadowColor: themeMode === 'light' ? '#000' : '#fff',
            borderColor: '#bab8cc',

        }]}>
            <Pressable
                onPress={() => navigation.navigate('CompanyProjectsList')}
                style={({ pressed }) => [
                    styles.row,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                ]}>
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={hp(3)}
                    color={THEMECOLORS[themeMode].black}
                    style={{ marginTop: hp(0.5) }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={[
                        styles.title,
                        isTamil ? Louis_George_Cafe.bold.h8 : Louis_George_Cafe.bold.h6,
                        { color: THEMECOLORS[themeMode].black }
                    ]}>
                        {item.projectName}
                    </Text>

                    <Text style={[
                        styles.subtitle,
                        isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.regular.h8,
                        { color: THEMECOLORS[themeMode].black }
                    ]}>
                        {t('Client')}: {item.client}
                    </Text>

                    <Text style={[
                        styles.subtitle,
                        isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.regular.h8,
                        { color: THEMECOLORS[themeMode].black }
                    ]}>
                        {t('Start')}: {item.startDate} - {t('End')}: {item.endDate}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        {
                            backgroundColor: item.projectStatus === "Pending" ? "#FFA50033" : "#00800033",
                        }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            {
                                color: item.projectStatus === "Pending" ? "#FFA500" : "#008000"
                            }
                        ]}>
                            {t(item.projectStatus)}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
    return (
        <>
            <View style={[
                styles.container,
                {
                    // backgroundColor: THEMECOLORS[themeMode].viewBackground 
                    backgroundColor: "#e9e6ff",
                }
            ]}>
                <Text style={[
                    Louis_George_Cafe.bold.h6,
                    {
                        marginBottom: wp(2),
                        color: THEMECOLORS[themeMode].black
                    }
                ]}>{t('Projects')}</Text>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text style={{
                            textAlign: 'center',
                            color: THEMECOLORS[themeMode].textPrimary,
                            marginTop: hp(2)
                        }}>{t('no_data')}</Text>
                    }
                />

                <Pressable
                    style={[
                        styles.viewAllBtn,
                        {
                            backgroundColor: THEMECOLORS[themeMode].buttonBg,
                            borderColor: THEMECOLORS[themeMode].buttonBorder
                        }
                    ]}
                    onPress={() => navigation.navigate('CompanyProjectsList')}
                >
                    <Text style={[
                        Louis_George_Cafe.regular.h9,
                        { color: THEMECOLORS[themeMode].buttonText }
                    ]}>{t('viewAll')}</Text>
                </Pressable>

            </View>
            <View style={{ width: wp(95), height: wp(0.2), backgroundColor: "#ccc", alignSelf: 'center', marginVertical: wp(2) }} />

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: wp(2),
        borderRadius: wp(2),
        padding: wp(3),
    },
    card: {
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: wp(3),
        borderWidth:wp(0.3)
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    title: {
        marginLeft: wp(3),
        marginBottom: hp(0.5),
    },
    subtitle: {
        marginLeft: wp(3),
        marginTop: hp(0.3),
    },
    statusBadge: {
        marginLeft: wp(3),
        marginTop: hp(1),
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
        borderRadius: wp(4),
        alignSelf: 'flex-start',
    },
    statusText: {
        fontWeight: '600',
        fontSize: hp(1.7),
    },
    viewAllBtn: {
        alignItems: 'center',
        paddingVertical: wp(1),
        paddingHorizontal: wp(1),
        borderWidth: 1,
        width: wp(20),
        alignSelf: "center",
        borderRadius: wp(6),
        marginTop: wp(3),
    }
});

export default CompanyProjects;
