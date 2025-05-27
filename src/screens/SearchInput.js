import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { wp, hp } from '../resources/dimensions'; // your utility
import { THEMECOLORS } from '../resources/colors/colors'; // your theme
import { useTranslation } from 'react-i18next';
const SearchInput = ({ searchText, setSearchText, themeMode }) => {

    const { t } = useTranslation();


    return (
        <View style={styles(themeMode).searchContainer}>
            <MaterialCommunityIcons
                name="magnify"
                size={wp(5)}
                color={THEMECOLORS[themeMode].textPrimary}
                style={styles(themeMode).icon}
            />
            <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder={t('search')}
                placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                style={styles(themeMode).input}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
};

const styles = (themeMode) => StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(10),
        borderWidth: wp(0.4),
        borderColor: THEMECOLORS[themeMode].textPrimary,
        backgroundColor: THEMECOLORS[themeMode].viewBackground,
        paddingHorizontal: wp(3),
        height: hp(6),
        marginBottom: wp(2),
    },
    icon: {
        marginRight: wp(2),
    },
    input: {
        flex: 1,
        fontSize: wp(4),
        color: THEMECOLORS[themeMode].textPrimary,
    },
});

export default SearchInput;
