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
import { Louis_George_Cafe } from "../resources/fonts";
import { THEMECOLORS } from "../resources/colors/colors";
import { useTheme } from "../context/ThemeContext";
const CARD_WIDTH = wp(45);
const CARD_HEIGHT = hp(10);
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


const WorkforceCard = ({ data }) => {
    const { theme, themeMode, toggleTheme } = useTheme();

    // (console.log(data))

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
                        <Text style={[Louis_George_Cafe.bold.h7, styles.cardTitle]}>{item?.label}</Text>
                        {item?.image &&
                            <Image source={item?.image ? item?.image : null} style={styles.cardImage} resizeMode="contain"
                            // Works on iOS only
                            />
                        }
                    </View>
                    <Text style={[Louis_George_Cafe.bold.h3, styles.cardDescription]}>{item.count}</Text>
                </LinearGradient>
            </TouchableOpacity>

        );
    };


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <FlatList
                horizontal
                data={data}
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
        marginHorizontal: wp(1)
    },
    scrollContent: {
        paddingLeft: wp(1),
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
        borderRadius: wp(3), 
        // paddingVertical:wp(5)
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
