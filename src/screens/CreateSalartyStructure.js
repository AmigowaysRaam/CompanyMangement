// CreateSalartyStructure.js
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Text,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getSalaryStructureList } from '../redux/authActions';
import { Louis_George_Cafe } from '../resources/fonts';
import SearchInput from './SearchInput';

const CreateSalartyStructure = () => {

    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const isTamil = i18n.language === 'ta';
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.auth.user?.data?.id);
    const [loading, setLoading] = useState(true);
    const [companyList, setCompanyList] = useState([]);

    const fetchHomeData = () => {
        setLoading(true);
        dispatch(
            getSalaryStructureList(userdata, (response) => {
                if (response.success) {
                    setCompanyList(response.data);
                }
                setLoading(false);
            })
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchHomeData();
        }, [userdata])
    );

    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Filter company list by designation or company name
    const filteredCompanies = companyList.filter((item) => {
        const designation = item.designation || '';
        const companyName = item.company?.company_name || '';
        return (
            designation.toLowerCase().includes(searchText.toLowerCase()) ||
            companyName.toLowerCase().includes(searchText.toLowerCase())
        );
    });
    const SalaryStructureCard = ({ item }) => {
        const company = item.company || {};
        const branch = item.branch || {};
        const additions = item.additions || {};

        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('CreateSalarySturctureTab', { data: item?._id })}
                style={[
                    styles.card,
                    { backgroundColor: THEMECOLORS[themeMode].cardBackground || '#fff' },
                ]}
            >
                <Text style={[Louis_George_Cafe.bold.h6, styles.designation]}>
                    {item.designation}
                </Text>

                <Text style={styles.label}>
                    {t('company_name')}: <Text style={styles.value}>{company.company_name || '-'}</Text>
                </Text>
                <Text style={styles.label}>
                    {t('branch_name')}: <Text style={styles.value}>{branch.branch_name || '-'}</Text>
                </Text>
                {/* <Text style={styles.label}>
          {t('company_id')}: <Text style={styles.value}>{company.company_id || '-'}</Text>
        </Text> */}
                <Text style={styles.label}>
                    {t('mobile')}: <Text style={styles.value}>{company.mobile || '-'}</Text>
                </Text>
                <Text style={styles.label}>
                    {t('address')}: <Text style={styles.value}>{company.address || '-'}</Text>
                </Text>

                <Text style={[styles.label, { marginTop: hp(1) }]}>
                    {t('salary_additions')}:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: hp(0.5) }}>
                    {Object.entries(additions).map(([key, val]) => (
                        <View
                            key={key}
                            style={{
                                flexDirection: 'row',
                                marginRight: wp(4),
                                marginBottom: hp(0.5),
                                backgroundColor: themeMode === 'dark' ? '#899' : '#f0f0f0',
                                paddingVertical: hp(0.5),
                                paddingHorizontal: wp(2),
                                borderRadius: wp(0.5),
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: '600',
                                    // color: THEMECOLORS[themeMode].primaryText,
                                    marginRight: wp(1),
                                    fontSize: wp(3.5),
                                }}
                            >
                                {t(key)}:
                            </Text>
                            <Text
                                style={{
                                    // color: THEMECOLORS[themeMode].secondaryText,
                                    fontSize: wp(3.5),
                                }}
                            >
                                {val.value}
                            </Text>
                        </View>
                    ))}
                </View>

            </TouchableOpacity>
        );
    };
    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('SalartyStructure')} />

            <View style={{ marginHorizontal: wp(4) }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('CreateSalarySturctureTab', { data: null });
                    }}
                    style={{
                        flexDirection: 'row',
                        width: wp(32),
                        height: wp(8),
                        alignSelf: 'flex-end',
                        backgroundColor: THEMECOLORS[themeMode].primaryApp,
                        borderRadius: wp(2),
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: wp(3),
                        margin: wp(2),
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={[
                            Louis_George_Cafe.bold.h6,
                            {
                                color: THEMECOLORS[themeMode].white,
                                lineHeight: wp(5),
                                fontSize: isTamil ? wp(3.2) : wp(4),
                            },
                        ]}
                    >
                        {t('add_new')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: wp(1), paddingHorizontal: hp(3) }}>
                <SearchInput searchText={searchText} setSearchText={setSearchText} themeMode={themeMode} />
            </View>

            <ScrollView style={styles.list}>
                {loading ? (
                    [1, 2, 3].map((item) => (
                        <View
                            key={item}
                            style={{
                                backgroundColor: themeMode === 'dark' ? '#5e5e5e' : '#e9e9e9',
                                width: wp(90),
                                height: hp(15),
                                marginVertical: wp(3),
                                borderRadius: wp(2),
                            }}
                        />
                    ))
                ) : filteredCompanies.length > 0 ? (
                    filteredCompanies.map((item) => (
                        <SalaryStructureCard key={item._id} item={item} />
                    ))
                ) : (
                    <Text style={[styles.noDataText, { color: THEMECOLORS[themeMode].text }]}>
                        {t('no_data_found')}
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        paddingHorizontal: wp(5),
        paddingVertical: wp(1),
    },
    card: {
        borderRadius: wp(3),
        padding: wp(4),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 3,
    },
    designation: {
        marginBottom: hp(1),
    },
    label: {
        fontWeight: '600',
        fontSize: wp(4),
        marginVertical: hp(0.2),
    },
    value: {
        fontWeight: '400',
    },
    additionItem: {
        fontSize: wp(3.8),
        marginLeft: wp(3),
        marginVertical: hp(0.2),
    },
    noDataText: {
        fontSize: wp(4),
        textAlign: 'center',
        marginTop: hp(5),
    },
});

export default CreateSalartyStructure;
