// ThemeToggle.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { hp, wp } from '../../resources/dimensions';

const ThemeToggle = () => {
    
    const { theme, themeMode, toggleTheme } = useTheme();
    const isDarkMode = themeMode === 'dark';

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleTheme}>
                <Image
                    source={
                        isDarkMode
                            ? require('../../assets/animations/dark_theme.png')
                            : require('../../assets/animations/light_theme.png')
                    }
                    style={styles.image}
                />
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        position: "relative", top: hp(4), right: hp(2)
    },
    icon: {
        fontSize: wp(6),
    },
    image: {
        width: hp(6),
        height: hp(3.5),
    },
});

export default ThemeToggle;
