import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList, Platform, TouchableOpacity } from 'react-native';
import { wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const dummyData = [
    {
        id: '1',
        name: 'John Doe',
        position: 'Senior Developer',
        department: 'Engineering',
        status: 'Active',
        salary: '$120,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=1',
    },
    {
        id: '2',
        name: 'Jane Smith',
        position: 'Product Manager',
        department: 'Product',
        status: 'Active',
        salary: '$110,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=2',
    },
    {
        id: '3',
        name: 'Alice Johnson',
        position: 'UX Designer',
        department: 'Design',
        status: 'Active',
        salary: '$90,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=3',
    },
    {
        id: '4',
        name: 'Bob Brown',
        position: 'QA Analyst',
        department: 'Quality Assurance',
        status: 'Inactive',
        salary: '$80,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=4',
    },
    {
        id: '5',
        name: 'Charlie Davis',
        position: 'DevOps Engineer',
        department: 'Infrastructure',
        status: 'Active',
        salary: '$100,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: '6',
        name: 'Diana Prince',
        position: 'Scrum Master',
        department: 'Project Management',
        status: 'Active',
        salary: '$105,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=6',
    },
    {
        id: '7',
        name: 'Ethan Hunt',
        position: 'Security Specialist',
        department: 'IT Security',
        status: 'Active',
        salary: '$115,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=7',
    },
    {
        id: '8',
        name: 'Fiona Gallagher',
        position: 'Marketing Lead',
        department: 'Marketing',
        status: 'Active',
        salary: '$95,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=8',
    },
    {
        id: '9',
        name: 'George Martin',
        position: 'Technical Writer',
        department: 'Documentation',
        status: 'Active',
        salary: '$75,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=9',
    },
    {
        id: '10',
        name: 'Hannah Lee',
        position: 'Frontend Developer',
        department: 'Engineering',
        status: 'Active',
        salary: '$92,000/year',
        profilePic: 'https://i.pravatar.cc/150?img=10',
    },
];

export default function EmployeeTable() {
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();
    useEffect(() => {
    }, [])

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.navigate('EmplyeeDetails', { item })}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: item.profilePic }}
                    style={styles.profileImage}
                />
                <Text style={[Louis_George_Cafe.regular.h8, styles.rowText]}>
                    {item.name}
                </Text>
            </View>
            <Text style={[Louis_George_Cafe.regular.h8, styles.rowText, styles.positionColumn]}>
                {item.position}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.tableContainer}>
                <Text style={[isTamil ?
                    Louis_George_Cafe.bold.h7 :
                    Louis_George_Cafe.bold.h5, { marginHorizontal: wp(3), marginTop: wp(3) }]}>{t('payrollActivities')}</Text>
                <View style={styles.line} />
                <View style={styles.headerContainer}>
                    <Text style={[isTamil ?
                        Louis_George_Cafe.bold.h7 : 
                        Louis_George_Cafe.bold.h8, styles.headerText, styles.nameColumn]}>
                        {t('employee')}
                    </Text>
                    <Text style={[isTamil ?
                        Louis_George_Cafe.bold.h7 :
                        Louis_George_Cafe.bold.h8, , styles.headerText, styles.positionColumn]}>
                        {t('position')}
                    </Text>
                </View>
                <View style={styles.line} />
                <FlatList
                    data={dummyData.slice(0, 5)}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
                <TouchableOpacity onPress={() => navigation.navigate('PayrollList', { item: dummyData })} style={{ alignSelf: "center", margin: wp(3), paddingHorizontal: wp(2), borderWidth: wp(0.3), borderRadius: wp(5) }}>
                    <Text style={[Louis_George_Cafe.bold.h8, {
                        lineHeight: wp(5)
                    }]}>{t('viewAll')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        margin: wp(2), width: wp(95), alignSelf: "center",

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
        backgroundColor: '#FFFBF0',

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
        backgroundColor: '#FFFBF0',
    },
    headerText: {
        color: '#000',
    },
    rowContainer: {
        flexDirection: 'row',
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    nameColumn: {
        flex: 2,
    },
    positionColumn: {
        textAlign: 'right',
    },
    line: {
        width: wp(90),
        height: wp(0.3)
        , backgroundColor: "#ccc", alignSelf: "center",
        marginVertical: wp(1)
    }
});
