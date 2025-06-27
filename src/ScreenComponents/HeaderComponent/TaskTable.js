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
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";


const TaskTable = (tdata) => {

    const [data, setData] = useState(null);
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const navigation = useNavigation();

    useEffect(() => {
        // alert(JSON.stringify(tdata.tdata))
        setData(tdata?.tdata?.Taskdata)
    }, [tdata])

    const toggleCheckbox = (id) => {
        const updated = data.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setData(updated);
    };
    
    const renderItem = ({ item }) => (
        <View >
            <TouchableOpacity onPress={() => toggleCheckbox(item.id)} style={styles.row}>
                <MaterialCommunityIcons
                    // name={item.checked ? "checkbox-marked" : "square-outline"}
                    name={"chevron-right"}
                    size={hp(3.5)}
                    color={"#555"}
                />
                <View>
                    <Text style={[isTamil ? Louis_George_Cafe.bold.h9 : Louis_George_Cafe.bold.h7, styles.title]}>{item.title}</Text>
                    <Text style={[isTamil ? Louis_George_Cafe.regular.h9 : Louis_George_Cafe.regular.h8, styles.title]}>{item.deadline}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <TouchableOpacity style={styles.container}
            onPress={() => navigation.navigate('TaskManagement')}
        >
            <Text style={[Louis_George_Cafe.bold.h6, { marginVertical: wp(1) }]}>{t('tasks')}</Text>
            <Text style={[Louis_George_Cafe.bold.h9]}>
                {tdata.tdata?.currentDate}
            </Text>
            {/* <Text>{}</Text> */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            // ListEmptyComponent={() => {
            //     <View style={{ alignItems: 'center', padding: 20 }}>
            //         <Text>View All</Text>
            //     </View>
            // }}
            />
            <TouchableOpacity
            // AssignedTask
            onPress={() => navigation.navigate('AssignedTask')}
            style={{ alignItems: 'center', padding: wp(0.5), borderWidth: wp(0.3), width: wp(20), alignSelf: "center", borderRadius: wp(4) }}>
                <Text style={[Louis_George_Cafe.regular.h9]}>{t('viewAll')}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
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
        // backgroundColor: COLORS.lightGray,
    },
});

export default TaskTable;
