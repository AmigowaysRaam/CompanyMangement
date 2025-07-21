import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';

const LinkedinOrganizationList = ({ organizations, onCreatePost }) => {
    const { themeMode } = useTheme();
    const renderItem = ({ item }) => {
        const org = item['organization~'];
        const orgName = org?.localizedName || 'Unnamed Org';
        const logoUrl = org?.logoV2?.['original~']?.elements?.[0]?.identifiers?.[0]?.identifier;
        return (
            <>
                <TouchableOpacity onPress={() => onCreatePost(org)} style={styles.orgItem}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        {logoUrl && <Image source={{ uri: logoUrl }} style={styles.logo} />}
                        <Text style={[Louis_George_Cafe.bold.h8, styles.orgName]}>{orgName}</Text>
                    </View>
                    <MaterialCommunityIcons onPress={() => onCreatePost(org)} name="database-arrow-right" color={THEMECOLORS[themeMode].primaryApp} size={hp(4)} style={[{ marginHorizontal: wp(2) }]} />
                </TouchableOpacity>
            </>
        );
    };
    return (
        <View style={styles.container}>
            <Text style={[Louis_George_Cafe.bold.h4, styles.title, {
                color: THEMECOLORS[themeMode].textPrimary
            }]}>Manage Organizations</Text>
            <FlatList
                data={organizations}
                keyExtractor={(item, index) => item.organization || index.toString()}
                renderItem={renderItem}
                // horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4), marginTop: wp(4),
    },
    title: {
        fontSize: wp(4), fontWeight: '600', marginBottom: wp(2),
    },
    orgItem: {
        flexDirection: "row", alignItems: 'center', marginRight: wp(4), backgroundColor: "#f9f9f9", marginBottom: wp(1), padding: wp(2), borderRadius: wp(2), width: wp(90), borderBottomWidth: wp(0.5), borderColor: "#CCC", justifyContent: "space-between"
    },
    orgName: {
        marginTop: wp(1), textAlign: 'center',
    },
    logo: {
        width: wp(11), height: wp(11), borderRadius: wp(6), resizeMode: 'contain', marginRight: wp(5)
    },
});

export default LinkedinOrganizationList;
