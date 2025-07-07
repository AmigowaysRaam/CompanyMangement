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
import { getCompaniesList } from '../redux/authActions';
import CompanyCard from './CompanyCard';
import { Louis_George_Cafe } from '../resources/fonts';
import SearchInput from './SearchInput';

const CompanyManagement = () => {
    
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
            getCompaniesList(userdata, (response) => {
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

    const filteredCompanies = companyList.filter((company) => {
        const name = company.name || '';
        const email = company.email || '';
        return (
            name.toLowerCase().includes(searchText.toLowerCase()) ||
            email.toLowerCase().includes(searchText.toLowerCase())
        );
    });


    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('companyManagement')} />

            <View style={{ marginHorizontal: wp(4) }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('CreateCompany', { data: null });
                    }}
                    style={{
                        flexDirection: 'row',
                        width: wp(30),
                        height: wp(8),
                        alignSelf: 'flex-end',
                        backgroundColor: THEMECOLORS[themeMode].buttonBg,
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
                                color: THEMECOLORS[themeMode].buttonText,
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
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                    themeMode={themeMode}
                />
            </View>
            <ScrollView style={styles.list}>
                {loading ? (
                    [1, 2, 3].map((company) => (
                        <View
                            key={company}
                            style={{
                                backgroundColor:
                                    themeMode === 'dark' ? '#5e5e5e' : '#e9e9e9',
                                width: wp(90),
                                height: hp(15),
                                marginVertical: wp(3),
                                borderRadius: wp(2),
                            }}
                        />
                    ))
                ) : (
                    companyList
                        .filter((company) =>
                            company.company_name
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase())
                        )
                        .map((company) => (
                            <CompanyCard
                                key={company._id}
                                company={company}
                                isTamil={isTamil}
                            />
                        ))
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
});

export default CompanyManagement;
