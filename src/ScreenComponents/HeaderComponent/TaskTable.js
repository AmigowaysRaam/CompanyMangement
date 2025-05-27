// components/TaskTable.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";

const initialData = [
    { id: "1", title: "Meeting with Developers", checked: false, deadline: "1 hour" },
    { id: "2", title: "Interview for Digital Marketing", checked: false, deadline: "1 hour" },
    { id: "3", title: "Conducting Events", checked: false, deadline: "1 hour" },
];

const TaskTable = () => {

    const [data, setData] = useState(initialData);

    useEffect(() => {
        setData(initialData)
    }, [])

    const toggleCheckbox = (id) => {
        const updated = data.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setData(updated);
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <TouchableOpacity onPress={() => toggleCheckbox(item.id)}>
                <MaterialCommunityIcons
                    name={item.checked ? "checkbox-marked" : "square-outline"}
                    size={hp(3.5)}
                    color={"#555"}
                />
            </TouchableOpacity>
            <View>
                <Text style={[Louis_George_Cafe.bold.h7, styles.title]}>{item.title}</Text>
                <Text style={[Louis_George_Cafe.regular.h8, styles.title]}>{item.deadline}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={[Louis_George_Cafe.bold.h6, { marginVertical: wp(1) }]}>{"Tasks"}</Text>
            <Text style={[Louis_George_Cafe.regular.h9]}>{"Today: 19-05-25"}</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: wp(1),
        backgroundColor: '#E6EDFF',
        borderRadius: wp(2),
        padding: wp(4),
        elevation: 2
        , marginHorizontal: wp(3)
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(1.5),
    },
    title: {
        marginLeft: wp(3),
        color: COLORS.black,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.lightGray,
    },
});

export default TaskTable;
