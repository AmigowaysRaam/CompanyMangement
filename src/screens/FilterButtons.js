import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTranslation } from 'react-i18next';

const FilterButtons = ({ themeMode, onPressHandlers = [], titles = [] }) => {
    const { t } = useTranslation();

    return (
        <View style={styles(themeMode).container}>
            <TouchableOpacity
                style={styles(themeMode).buttonLeft}
                onPress={onPressHandlers[0]}
            >
                <Text style={styles(themeMode).buttonText}>{t(titles[0])}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles(themeMode).buttonMiddle}
                onPress={onPressHandlers[1]}
            >
                <Text style={styles(themeMode).buttonText}>{t(titles[1])}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles(themeMode).buttonRight}
                onPress={onPressHandlers[2]}
            >
                <Text style={styles(themeMode).buttonText}>{t(titles[2])}</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = (themeMode) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: hp(6),
        marginBottom: wp(2),
        alignSelf: 'center',
        marginHorizontal: wp(4)
    },
    buttonLeft: {
        backgroundColor: THEMECOLORS[themeMode].buttonBg,
        paddingVertical: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center',
        width: '32%',
        marginHorizontal: wp(1),
        borderTopStartRadius: wp(5),
        borderBottomStartRadius: wp(5),
    },
    buttonMiddle: {
        backgroundColor: THEMECOLORS[themeMode].buttonBg,
        paddingVertical: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center',
        width: '32%',
        marginHorizontal: wp(1),
    },
    buttonRight: {
        backgroundColor: THEMECOLORS[themeMode].buttonBg,
        paddingVertical: hp(1.5),
        justifyContent: 'center',
        alignItems: 'center',
        width: '32%',
        marginHorizontal: wp(1),
        borderTopEndRadius: wp(5),
        borderBottomEndRadius: wp(5),
    },
    buttonText: {
        color: THEMECOLORS[themeMode].buttonText,
        fontSize: wp(3.5),
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default FilterButtons;
