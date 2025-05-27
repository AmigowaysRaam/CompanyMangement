import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { wp, hp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import { Louis_George_Cafe } from "../resources/fonts";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
const CARD_WIDTH = wp(60);
const CARD_HEIGHT = hp(12);

const cardsData = [
    {
        id: "1",
        title: "Total Employee",
        description: "100",
        image: require("../assets/animations/total_emp.png"),
    },
    {
        id: "2",
        title: "Today Attendance",
        description: "80",
        image: require("../assets/animations/attendance.png"),

    },
    {
        id: "3",
        title: "Interviews",
        description: "09",
        image: require("../assets/animations/interview.png"),

    },
];

// Different gradient colors for each card
const gradients = [
    {
        name: "Blue Blend",
        colors: ["#EAEFD8", "#ACC941"],
    },
    {
        name: "Aqua Wave",
        colors: ["#FBF8FF", "#C09FEB"],
    },
    {
        name: "Sunset Flame",
        colors: ["#F4F9FF", "#AECFFF"],
    },
];


const WorkforceCard = () => {
    const { theme, themeMode, toggleTheme } = useTheme();

    const renderItem = ({ item, index }) => {
        const gradient = gradients[index % gradients.length];
        return (
            <TouchableOpacity style={styles.cardWrapper}>
                <LinearGradient
                    colors={gradient.colors}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={[Louis_George_Cafe.bold.h6, styles.cardTitle]}>{item.title}</Text>
                        <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                    </View>
                    <Text style={[Louis_George_Cafe.bold.h3, styles.cardDescription]}>{item.description}</Text>
                </LinearGradient>
            </TouchableOpacity>

        );
    };


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background}]}>
            <FlatList
                horizontal
                data={cardsData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={CARD_WIDTH + wp(4)}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: hp(1),
    },
    scrollContent: {
        paddingLeft: wp(4),
    },
    cardImage: {
        width: wp(10),
        height: wp(10),
        marginBottom: hp(1),
        alignSelf: "center",
    },
    cardWrapper: {
        marginRight: wp(3),
        borderRadius: wp(3),
        overflow: "hidden", // Ensures child respects borderRadius
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: wp(4),
        justifyContent: "center",
        borderRadius: wp(3), // Ensure the LinearGradient respects radius
    },

    cardTitle: {
        color: "#000",
        marginBottom: hp(0.5),
    },
    cardDescription: {
        color: "#000", alignSelf: "flex-end"

    },
});

export default WorkforceCard;
