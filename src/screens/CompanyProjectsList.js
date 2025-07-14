import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import HeaderComponent from '../components/HeaderComponent';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation, useRoute, } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreenLoader from './HomeScreenLoader';
import SearchInput from './SearchInput';
import { getProjectsStats } from '../redux/authActions';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { Louis_George_Cafe } from '../resources/fonts';

export default function CompanyProjectsList() {

    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const userdata = useSelector(state => state.auth.user);
    const [projectList, setProjectList] = React.useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const isTamil = i18n.language === 'ta';
    const [searchText, setSearchText] = useState('');

  
    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            functionGetProjects()
            // alert(JSON.stringify(itemList))

        }, [userdata])
    );
    const functionGetProjects = () => {
        setLoading(true);
        dispatch(getProjectsStats(userdata?.data?.id, res => {
            if (res.success) {
                const projectsMapped = res.data.map(project => ({
                    id: project._id,
                    title: project.projectName || 'No Title',
                    client: project.client?.name || 'No Client',
                    dueDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No Due Date',
                    startDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No Start Date',
                    status: project.projectStatus || 'Pending',
                    completion: project.completion || 0,
                    dCounts: project.documentsCount || 0,
                }));

                setProjectList(projectsMapped);
                // alert(JSON.stringify(res.data))

            }
            setLoading(false);
        }));
    }

    const adjustFont = (style, offset) => ({
        ...style,
        fontSize: isTamil ? style.fontSize - offset + 1 : style.fontSize,
    });

    const renderProjectItem = ({ item }) => (
        <TouchableOpacity
            style={{ marginTop: wp(2) }}
            onPress={() => navigation.navigate('ProjectOverallDetails', { item })}
        >
            <View style={[styles.projectCard, {
                marginVertical: wp(2),
                backgroundColor: THEMECOLORS[themeMode].cardBackground
            }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(1) }}>
                    <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}> {item.title}</Text>
                    {item?.dCounts > 0 &&
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ProjectDocumentsList', { data: item })}
                        >
                            <Text style={[adjustFont(Louis_George_Cafe.regular.h8, 2), {
                                textDecorationLine: "underline"
                            }]}> {`${item?.dCounts} ${t('documents')}`}</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(2) }}>
                    <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{t('Client') || 'Client'}: {item.client}</Text>

                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", margin: wp(2) }}>
                    <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>{t('Start') || 'Start'}: {item.startDate}</Text>
                    <Text style={adjustFont(Louis_George_Cafe.regular.h8, 2)}>{t('Due') || 'Due'}: {item.dueDate}</Text>
                </View>
                <View style={{ margin: wp(2), }}>
                    {/* <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{`${item.completion}% ${t('Completed') || 'Completed'}`}</Text> */}
                    <View style={{ flexDirection: "row", marginVertical: wp(1), alignItems: "center", marginTop: wp(4) }}>
                        <Text style={adjustFont(Louis_George_Cafe.bold.h8, 2)}>{t('Status') || 'Status'}: </Text>
                        <Text style={[
                            adjustFont(Louis_George_Cafe.regular.h8, 2),
                            {
                                backgroundColor: item.status === 'Completed' ? 'lightgreen' : 'yellow',
                                paddingHorizontal: wp(2),
                                borderRadius: wp(4),
                                lineHeight: wp(6)
                            }
                        ]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent title={t('Projects')} showBackArray={true} />
            {loading ? (
                <HomeScreenLoader />
            ) : (
                <>
                    <View style={{ padding: wp(1), paddingHorizontal: hp(2), marginTop: wp(2) }}>
                        <SearchInput
                            searchText={searchText}
                            setSearchText={setSearchText}
                            themeMode={themeMode}
                        />
                    </View>
                    <FlatList
                        data={projectList.filter(project =>
                            // Filter across all relevant fields
                            project.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                            project.client?.toLowerCase().includes(searchText.toLowerCase()) ||
                            project.dueDate?.toLowerCase().includes(searchText.toLowerCase()) ||
                            project.startDate?.toLowerCase().includes(searchText.toLowerCase()) ||
                            project.status?.toLowerCase().includes(searchText.toLowerCase())
                        )}
                        keyExtractor={item => item.id}
                        renderItem={renderProjectItem}
                        contentContainerStyle={{
                            padding: wp(2),
                            borderRadius: wp(1),
                        }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <Text style={[Louis_George_Cafe.regular.h6, {
                                alignSelf: "center",
                                marginTop: hp(20),
                            }]}>
                                {t('no_data')}
                            </Text>
                        )}
                        refreshing={loading}
                        onRefresh={functionGetProjects}
                    />

                </>
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(2),
    },
    projectCard: {
        borderRadius: wp(2),
        padding: wp(3),
        marginVertical: wp(2),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

});
