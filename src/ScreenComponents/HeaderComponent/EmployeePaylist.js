import React from 'react';
import { View, Image, Text, StyleSheet, FlatList, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { useNavigation } from '@react-navigation/native';

const dummyData = [
    { id: '1', name: 'John Doe', salary: '$120,000/year', status: 'Issued', profilePic: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Jane Smith', salary: '$110,000/year', status: 'Issued', profilePic: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Alice Johnson', salary: '$90,000/year', status: 'Issued', profilePic: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Bob Brown', salary: '$80,000/year', status: 'Not Issued', profilePic: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Charlie Davis', salary: '$100,000/year', status: 'Issued', profilePic: 'https://i.pravatar.cc/150?img=5' },
];

export default function EmployeePaylist() {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate('EmplyeeDetails', { item })}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
                <Text numberOfLines={1} style={[isTamil ? Louis_George_Cafe.regular.h9 :
                    Louis_George_Cafe.regular.h8, styles.rowText]}>
                    {item.name}
                </Text>
            </View>
            <Text numberOfLines={1} style={[isTamil ? Louis_George_Cafe.regular.h9 :
                Louis_George_Cafe.regular.h8, styles.rowText, styles.salaryColumn]}>
                {item.salary}
            </Text>
            <Text numberOfLines={1} style={[isTamil ? Louis_George_Cafe.regular.h9 :
                Louis_George_Cafe.regular.h8, styles.rowText, styles.statusColumn]}>
                {t(item.status.toLowerCase().replace(" ", "_")) || item.status}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.tableContainer}>
                <Text style={[isTamil ? Louis_George_Cafe.bold.h8 : Louis_George_Cafe.bold.h5, { marginHorizontal: wp(3), marginTop: wp(3) }]}>
                    {t('employeePayslipList')}
                </Text>
                <View style={styles.line} />
                <View style={styles.headerContainer}>
                    <Text numberOfLines={1} style={[isTamil ? Louis_George_Cafe.bold.h8 : Louis_George_Cafe.bold.h7, styles.headerText, styles.nameColumn]}>
                        {t('employee')}
                    </Text>
                    <Text numberOfLines={1} style={[isTamil ? Louis_George_Cafe.bold.h8 : Louis_George_Cafe.bold.h7, styles.headerText, styles.salaryColumn]}>
                        {t('salary')}
                    </Text>
                    <Text numberOfLines={1} style={[isTamil ? Louis_George_Cafe.bold.h8 : Louis_George_Cafe.bold.h7, styles.headerText, styles.statusColumn]}>
                        {t('status')}
                    </Text>
                </View>
                <View style={styles.line} />
                <FlatList data={dummyData} keyExtractor={(item) => item.id} renderItem={renderItem} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('PayrollList', { item: dummyData })}
                    style={{ alignSelf: "center", margin: wp(3), paddingHorizontal: wp(2), borderWidth: wp(0.3), borderRadius: wp(5) }}
                >
                    <Text style={[isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.bold.h8]}>{t('viewAll')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        margin: wp(2),
        width: wp(95),
        alignSelf: "center",
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    tableContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: wp(0.2),
        borderColor: '#ddd',
        backgroundColor: '#EDF2FF',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2,
    },
    profileImage: {
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        marginRight: wp(2),
    },
    headerContainer: {
        flexDirection: 'row',
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
        backgroundColor: '#EDF2FF',
        alignItems: 'center',
    },
    headerText: {
        color: '#000',
    },
    rowContainer: {
        flexDirection: 'row',
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameColumn: {
        flex: 2,
    },
    salaryColumn: {
        flex: 1.5,
        textAlign: 'center',
    },
    statusColumn: {
        flex: 1,
        textAlign: 'right',
    },
    rowText: {
        color: '#000',
        width: wp(25)
    },
    line: {
        width: wp(90),
        height: wp(0.3),
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginVertical: wp(1)
    }
});
