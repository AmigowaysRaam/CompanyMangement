import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { Louis_George_Cafe } from '../resources/fonts';
import { useNavigation } from '@react-navigation/native';

const CompanyCard = ({ company }) => {
    const { themeMode } = useTheme();
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() =>
            navigation.navigate('CreateCompany', { data: company?._id })
}>
    <View style={[styles.card, { backgroundColor: THEMECOLORS[themeMode].cardBackground || '#fff' }]}>
        <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, styles.title]}>{company.company_name}</Text>
        <Text style={styles.item}><Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Mobile:</Text> {company.mobile}</Text>
        <Text style={styles.item}><Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Tax:</Text> {company.tax}</Text>
        <Text style={styles.item}><Text style={[Louis_George_Cafe.regular.h7, styles.label]}>Company ID:</Text> {company.company_id}</Text>
    </View>
        </TouchableOpacity >

    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: wp(3),
        padding: wp(3),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 3,
    },
    title: {
        marginBottom: hp(1),
    },
    item: {
        fontSize: wp(4),
        marginVertical: hp(0.3),
    },
    label: {
        fontWeight: '600',
    },
});

export default CompanyCard;
