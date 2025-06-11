import React, { useState } from 'react';
import {
    View, Text, Image, TouchableOpacity, Linking,
    StyleSheet, TextInput
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    FlatList,
} from 'react-native';
import { width } from '../resources/fonts';

const dummyData = [
    {
        id: '1',
        type: 'product',
        name: 'Apple',
        image: 'https://via.placeholder.com/60?text=Apple',
        link: 'https://en.wikipedia.org/wiki/Apple',
        price: '$1.20',
    },
    {
        id: '2',
        type: 'article',
        title: 'Banana Nutrition Facts',
        summary: 'Bananas are rich in potassium and fiber...',
        link: 'https://en.wikipedia.org/wiki/Banana',
    },
    {
        id: '3',
        type: 'category',
        name: 'Citrus Fruits',
        description: 'Includes oranges, lemons, limes, and more',
    },
    {
        id: '4',
        type: 'product',
        name: 'Orange',
        image: 'https://via.placeholder.com/60?text=Orange',
        link: 'https://en.wikipedia.org/wiki/Orange_(fruit)',
        price: '$0.80',
    },
];

const SearchScreen = () => {

    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
        }
        return false;
    });

    const filteredData = dummyData.filter(item =>
        item.name?.toLowerCase().includes(searchText?.toLowerCase())
    );

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'product':
                return (
                    <TouchableOpacity
                        style={[styles.itemContainer, {
                            backgroundColor: THEMECOLORS[themeMode].cardBackground
                        }]}
                        onPress={() => Linking.openURL(item.link)}
                    >
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View>
                            <Text style={[styles.categoryTitle,
                            {
                                color: THEMECOLORS[themeMode].textPrimary
                            }
                            ]}>{item.name}</Text>
                            <Text style={[styles.categoryTitle,
                            {
                                color: THEMECOLORS[themeMode].textPrimary
                            }
                            ]}>{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                );
            case 'article':
                return (
                    <TouchableOpacity
                        style={[styles.articleContainer, {
                            backgroundColor: THEMECOLORS[themeMode].cardBackground
                        }]}
                        onPress={() => Linking.openURL(item.link)}
                    >
                        <Text style={styles.articleTitle}>{item.title}</Text>
                        <Text style={styles.articleSummary}>{item.summary}</Text>
                    </TouchableOpacity>
                );
            case 'category':
                return (
                    <View style={[styles.categoryContainer, {
                        backgroundColor: THEMECOLORS[themeMode].cardBackground
                    }]}>
                        <Text style={[styles.categoryTitle,
                        {
                            color: THEMECOLORS[themeMode].background
                        }
                        ]}>{item.name}</Text>
                        <Text style={styles.categoryDescription}>{item.description}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons
                        name="chevron-left"
                        size={wp(10)}
                        color={THEMECOLORS[themeMode].textPrimary}
                    />
                </TouchableOpacity>
                <View style={[styles.searchBox, {
                    borderColor: THEMECOLORS[themeMode].textPrimary,
                    backgroundColor: THEMECOLORS[themeMode].viewBackground
                }]}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={wp(5)}
                        color={THEMECOLORS[themeMode].textPrimary}
                    />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder={t('search')}
                        placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                        style={[styles.textInput, {
                            color: THEMECOLORS[themeMode].textPrimary, padding: wp(2.5)
                        }]}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: THEMECOLORS[themeMode].textPrimary }}>
                            {t('noResultsFound') || 'No results found'}
                        </Text>
                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: "row",
        height: hp(9),
        alignItems: "center",
        marginVertical: wp(1),
        borderBottomWidth: wp(0.2),
        borderColor: "#CCC"
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(10),
        borderWidth: wp(0.4),
        paddingHorizontal: wp(3),
        height: hp(5.5),
        width: wp(85)
    },
    textInput: {
        fontSize: wp(4),
        padding: wp(3),
        flex: 1
    },
    itemContainer: {
        padding: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    itemText: {
        fontSize: wp(4)
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: hp(3)
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        margin: wp(2),
        borderRadius: wp(3)
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: wp(3),
    },
    itemText: {
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: wp(3.5),
        color: 'green',
    },
    articleContainer: {
        padding: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: wp(2),
        borderRadius: wp(3),
        margin: wp(2)

    },
    articleTitle: {
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    articleSummary: {
        fontSize: wp(3.5),
        color: '#555',
        marginTop: 4,
    },
    categoryContainer: {
        padding: wp(4),
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: wp(3),
        margin: wp(2)


    },
    categoryTitle: {
        fontSize: wp(4),
        fontWeight: 'bold',
    },
    categoryDescription: {
        fontSize: wp(3.5),
        // color: '#777',

    },
});


export default SearchScreen;
