import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';

const dummyData = [
    { id: '1', name: 'John Doe', position: 'Software Engineer' },
    { id: '2', name: 'Jane Smith', position: 'Product Manager' },
    { id: '3', name: 'Alice Johnson', position: 'UX Designer' },
    { id: '4', name: 'Bob Brown', position: 'QA Analyst' },
    { id: '5', name: 'Charlie Davis', position: 'DevOps Engineer' },
];

export default function EmployeeTable() {

    useEffect(() => {

    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.rowContainer}>
            <Text style={[Louis_George_Cafe.regular.h8, styles.rowText, styles.nameColumn]}>
                {item.name}
            </Text>
            <Text style={[Louis_George_Cafe.regular.h8, styles.rowText, styles.positionColumn]}>
                {item.position}
            </Text>
        </View>
    );

    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.tableContainer}>
                <Text style={[Louis_George_Cafe.bold.h4, { marginHorizontal: wp(3), marginTop: wp(3) }]}>{"Payroll Activities"}</Text>
                <View style={styles.line} />
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={[Louis_George_Cafe.bold.h6, styles.headerText, styles.nameColumn]}>
                        Employee Name
                    </Text>
                    <Text style={[Louis_George_Cafe.bold.h6, styles.headerText, styles.positionColumn]}>
                        Position
                    </Text>
                </View>
                <View style={styles.line} />

                {/* Data Rows */}
                <FlatList
                    data={dummyData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        margin: wp(3),
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
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#FFFBF0',
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
