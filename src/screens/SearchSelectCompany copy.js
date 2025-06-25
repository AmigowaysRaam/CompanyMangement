import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getCLinetData, getCompaniesList } from '../redux/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchSelectCompany = ({ onClose, selectedEIds }) => {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const isTamil = i18n.language === 'ta';
    const dispatch = useDispatch();

    const userdata = useSelector((state) => state.auth.user?.data);

    const [allClients, setAllClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchClients = () => {
        setLoading(true);
        dispatch(getCompaniesList(userdata?.id, (res) => {
            setLoading(false);
            // alert(JSON.stringify(res.data))
            if (res.success) {
                const clients = res.data.map(client => ({
                    name: client.company_name,
                    id: client._id
                }));
                setAllClients(clients);
                setFilteredClients(clients);
            }
        }));
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (searchText.trim().length === 0) {
            setFilteredClients(allClients);
        } else {
            const lowercased = searchText.toLowerCase();
            const filtered = allClients.filter(client =>
                client.name.toLowerCase().includes(lowercased)
            );
            setFilteredClients(filtered);
        }
    }, [searchText, allClients]);

    useEffect(() => {
        if (Array.isArray(selectedEIds) && selectedEIds.length > 0 && allClients.length > 0) {
            const idOrObj = selectedEIds[0];
            let enriched = null;
            if (typeof idOrObj === 'object') {
                enriched = idOrObj;
            } else {
                const match = allClients.find(emp => emp.id === idOrObj);
                if (match) enriched = { id: match.id, name: match.name };
            }
            setSelectedEmployee(enriched);
        }
    }, [selectedEIds, allClients]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getCompaniesList(userdata?.id, (res) => {
            setRefreshing(false);
            if (res.success) {
                const clients = res.data.map(client => ({
                    name: client._id,
                    id: client._id
                }));
                setAllClients(clients);
                setFilteredClients(clients);
            }
        }));
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedEmployee?.id === item.id;

        const handleSelect = () => {
            if (isSelected) {
                setSelectedEmployee(null);
            } else {
                setSelectedEmployee(item);
            }
        };

        return (
            <TouchableOpacity
                onPress={handleSelect}
                style={[
                    styles.itemBox,
                    {
                        backgroundColor: isSelected
                            ? THEMECOLORS[themeMode].primaryApp + '20'
                            : THEMECOLORS[themeMode].viewBackground,
                    }
                ]}
            >
                <MaterialCommunityIcons
                    name={isSelected ? "checkbox-marked-circle" : "circle-outline"}
                    size={hp(2.5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
                <Text style={[
                    Louis_George_Cafe.regular.h4,
                    styles.categoryTitle,
                    {
                        color: THEMECOLORS[themeMode].textPrimary,
                        fontSize: isTamil ? wp(4) : wp(4.5),
                        marginHorizontal: wp(4)
                    }
                ]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const ListEmptyComponent = () => {
        if (loading || refreshing) return null;
        return (
            <View style={{ paddingTop: hp(10), alignItems: 'center' }}>
                <Text style={{ color: THEMECOLORS[themeMode].textPrimary, fontSize: wp(4) }}>
                    {t('no_data')}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <View style={sstyles(themeMode).searchContainer}>
                <MaterialCommunityIcons
                    name="magnify"
                    size={wp(5)}
                    color={THEMECOLORS[themeMode].textPrimary}
                    style={sstyles(themeMode).icon}
                />
                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder={t('search')}
                    placeholderTextColor={THEMECOLORS[themeMode].textPrimary}
                    style={sstyles(themeMode).input}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <MaterialCommunityIcons
                    onPress={() => onClose()}
                    name="close"
                    size={hp(3)}
                    color={THEMECOLORS[themeMode].textPrimary}
                />
            </View>

            <FlatList
                data={filteredClients}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={{ paddingBottom: hp(10), flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={THEMECOLORS[themeMode].primaryApp}
                    />
                }
                ListFooterComponent={
                    loading && !refreshing ? (
                        <ActivityIndicator size="small" color={THEMECOLORS[themeMode].primaryApp} />
                    ) : null
                }
                ListEmptyComponent={ListEmptyComponent}
            />

            <TouchableOpacity
                style={[styles.doneButton, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]}
                onPress={() => onClose(selectedEmployee)}
            >
                <Text style={[styles.doneText, { color: THEMECOLORS[themeMode].buttonText, textTransform: "capitalize" }]}>
                    {t('done')}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(3),
    },
    itemBox: {
        borderRadius: wp(2),
        padding: wp(3),
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: wp(2),
    },
    categoryTitle: {
        flex: 1,
    },
    doneButton: {
        position: 'absolute',
        bottom: hp(2),
        left: wp(5),
        right: wp(5),
        height: hp(6),
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    doneText: {
        fontSize: wp(4.2),
        fontWeight: '600',
    },
});

const sstyles = (themeMode) => StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(10),
        borderWidth: wp(0.4),
        borderColor: THEMECOLORS[themeMode].textPrimary,
        backgroundColor: THEMECOLORS[themeMode].viewBackground,
        paddingHorizontal: wp(3),
        height: hp(5),
        marginBottom: wp(2),
    },

    icon: {
        marginRight: wp(2),
    },
    input: {
        flex: 1,
        fontSize: wp(3.5),
        color: THEMECOLORS[themeMode].textPrimary,
        padding: wp(2.5),
    },
});

export default SearchSelectCompany;
