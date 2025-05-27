import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';
import { COLORS } from '../../resources/Colors';

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

];


export default function AllEmployee() {
    const route = useRoute();
    const itemList = route.params?.item;
    const navigation = useNavigation();

    useEffect(() => {
        // alert(JSON.stringify(itemList))
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
            <View style={{ backgroundColor: '#1484CD', paddingHorizontal: wp(2), borderRadius: wp(5), paddingVertical: wp(0.1) }}>
                <Text style={[Louis_George_Cafe.regular.h8, styles.rowText, styles.positionColumn, { color: "#FFF" }]}>
                    {item.id + 9 + "%"}
                </Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1, paddingBottom: wp(3) }}>
            <View style={styles.tableContainer}>
                <View style={{
                    backgroundColor: '#FFFBF0', flex: 1, borderRadius: wp(2), borderWidth: wp(0.5), borderColor: "#F1F1F1"
                }}>
                    <View style={styles.headerContainer}>
                        <Text style={[Louis_George_Cafe.bold.h7, styles.headerText, styles.nameColumn]}>
                            Employee
                        </Text>
                        <Text style={[Louis_George_Cafe.bold.h6, styles.headerText, styles.positionColumn]}>
                            Perfomance
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <FlatList
                        data={dummyData.splice(0, 5)}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        ListFooterComponent={
                            <TouchableOpacity onPress={() => navigation.navigate('PayrollList', { item: dummyData })}
                                style={{ padding: wp(1), alignItems: 'center', marginBottom: wp(1), borderWidth: wp(0.3), width: wp(20), alignSelf: "center", borderRadius: wp(5) }}>
                                <Text style={[Louis_George_Cafe.regular.h8]}>View all</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    tableContainer: {
        flex: 1,
        borderRadius: wp(5),
        margin: wp(1)
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
        paddingHorizontal: wp(5),
        backgroundColor: '#FFFBF0',
        marginTop: wp(1), width: wp(95), alignSelf: "center"
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
