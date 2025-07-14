import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { THEMECOLORS } from '../resources/colors/colors';  // Make sure mildBackground exists in your theme
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreenLoader from './HomeScreenLoader';
import { getProjectsStatsById } from '../redux/authActions';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { Louis_George_Cafe } from '../resources/fonts';
import HeaderComponent from '../components/HeaderComponent';
import { MaterialIcons } from '@expo/vector-icons'; // For collapsible icon
import { LinearGradient } from 'expo-linear-gradient';

export default function ProjectOverallDetails() {
    const { themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const userdata = useSelector(state => state.auth.user);
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const itemList = route.params?.item;

    // Back handler to navigate on Android
    useAndroidBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Fetch project details on focus or when userdata changes
    useEffect(() => {
        fetchProjectDetails();
    }, [userdata]);

    const fetchProjectDetails = () => {
        setLoading(true);
        dispatch(getProjectsStatsById({ userid: userdata?.data?.id, _id: itemList?.id }, res => {
            if (res.success) {
                setProjectData(res.project);
                // alert(JSON.stringify(res.project, null, 2))
            }
            setLoading(false);
        }));
    };

    const adjustFont = (style, offset) => ({
        ...style,
        fontSize: i18n.language === 'ta' ? style.fontSize - offset + 1 : style.fontSize,
    });

    if (loading) {
        return <HomeScreenLoader />;
    }

    return (
        <View style={[styles.container, { backgroundColor: THEMECOLORS[themeMode].background }]}>
            <HeaderComponent showBackArray={true} title={t('project_details')}
                rightSideArr={'plus-circle'} rIconFunction={() => navigation?.navigate('CreateTaskByCompany', { data: projectData })}
            />
            {/* <TouchableOpacity onPress={() => }>
                <Text>Create</Text>
            </TouchableOpacity> */}

            {/* Project Header */}
            <LinearGradient
                colors={[THEMECOLORS[themeMode].gradientStart, THEMECOLORS[themeMode].gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerContainer}
            >
                <Text style={[adjustFont(Louis_George_Cafe.bold.h3, 2), {
                    color: THEMECOLORS[themeMode].white
                }]}>{itemList?.title}</Text>

                <Text style={[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                    paddingVertical: wp(2),
                    color: THEMECOLORS[themeMode].white
                }]}>
                    {t('Project ID')}: {itemList?.id}
                </Text>
            </LinearGradient>
            {/*  */}
            <View style={{ backgroundColor: "#d3d3d3", flex: 1, borderRadius: wp(2) }}>
                <ScrollView style={{ flex: 1, paddingVertical: wp(4), marginTop: wp(1), marginBottom: hp(2),paddingHorizontal:wp(2) }}>
                    {/* Client Section */}
                    <View style={[styles.cardHeader, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f0f0f0'
                    }]}>
                        <MaterialIcons name="person" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                        <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}>{t('Client Info')}</Text>
                    </View>
                    <View style={[styles.cardContent, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f9f9f9'
                    }]}>
                        <Text style={[[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                            paddingVertical: wp(2)
                        }], {
                            paddingVertical: wp(1)
                        }]}>{t('Client Name')}: {projectData?.client?.name}</Text>
                        <Text style={[[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                            paddingVertical: wp(2)
                        }], {
                            paddingVertical: wp(1)
                        }]}>{t('Client Email')}: {projectData?.client?.email}</Text>
                    </View>

                    {/* Company Section */}
                    <View style={[styles.cardHeader, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f0f0f0'
                    }]}>
                        <MaterialIcons name="business" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                        <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}>{t('Company Info')}</Text>
                    </View>
                    <View style={[styles.cardContent, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f9f9f9'
                    }]}>
                        <Text style={[[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                            paddingVertical: wp(2)
                        }], {
                            paddingVertical: wp(1)
                        }]}>{t('Company Name')}: {projectData?.company?.company_name}</Text>
                    </View>

                    {/* Team Section */}
                    <View style={[styles.cardHeader, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f0f0f0'
                    }]}>
                        <MaterialIcons name="group" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                        <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}>{t('Team Members')}</Text>
                    </View>
                    <View style={[styles.cardContent, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f9f9f9'
                    }]}>
                        {projectData?.teamMembers?.map((member, index) => (
                            <Text key={index} style={[[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                                paddingVertical: wp(2)
                            }], {
                                paddingVertical: wp(1)
                            }]}>
                                {index+1}{'. '}{member.full_name} ({member.designation?.positionTitle || 'No Position'})
                            </Text>
                        ))}
                    </View>

                    {/* Technology Section */}
                    <View style={[styles.cardHeader, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f0f0f0'
                    }]}>
                        <MaterialIcons name="code" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                        <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}>{t('Technologies')}</Text>
                    </View>
                    <View style={[styles.cardContent, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f9f9f9'
                    }]}>
                        {projectData?.technology?.map((tech, index) => (
                            <Text key={index} style={[[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                                paddingVertical: wp(2)
                            }], {
                                paddingVertical: wp(1)
                            }]}>
                                {tech?.label}: {tech?.input}
                            </Text>
                        ))}
                    </View>

                    {/* Files Section */}
                    <View style={[styles.cardHeader, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f0f0f0'
                    }]}>
                        <MaterialIcons name="attach-file" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                        <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}>{t('Files')}</Text>
                    </View>
                    <View style={[styles.cardContent, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f9f9f9'
                    }]}>
                        {projectData?.file?.map((file, index) => (
                            // onPress={() => navigation.navigate('ProjectDocumentsList', { data: item })}
                            <TouchableOpacity
                                style={{ flexDirection: "row", justifyContent: "space-between" }}
                                onPress={() => navigation.navigate('ProjectDocumentsList', { data: projectData })}>
                                <Text numberOfLines={1} key={index} style={[[adjustFont(Louis_George_Cafe.regular.h7, 1), {
                                    paddingVertical: wp(2), textDecorationLine: "underline"
                                }], {
                                    paddingVertical: wp(1)
                                }]}>
                                    {file}
                                </Text>
                                <MaterialIcons name="download" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Milestones Section */}
                    <View style={[styles.cardHeader, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f0f0f0'
                    }]}>
                        <MaterialIcons name="check-circle" size={wp(7)} color={THEMECOLORS[themeMode].text} />
                        <Text style={adjustFont(Louis_George_Cafe.bold.h5, 2)}>{t('Milestones')}</Text>
                    </View>
                    <View style={[styles.cardContent, {
                        backgroundColor: THEMECOLORS[themeMode].lightMildBackground || '#f9f9f9'
                    }]}>
                        <Text style={[[adjustFont(Louis_George_Cafe.regular.h6, 1), {
                            paddingVertical: wp(2)
                        }], {
                            paddingVertical: wp(1)
                        }]}>{t('Milestone Count')}: {projectData?.milestone || 'N/A'}</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(2),
    },
    headerContainer: {
        marginVertical: wp(2),
        padding: wp(4),
        borderRadius: wp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        padding: wp(4),
        // borderRadius: wp(2),
        // marginBottom: wp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderTopStartRadius: wp(3),
        borderTopEndRadius: wp(3),
    },
    cardContent: {
        padding: wp(4),
        marginBottom: wp(2),
        // borderRadius: wp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderBottomStartRadius: wp(3),
        borderBottomEndRadius: wp(3),
        marginBottom:wp(5)

    },
});
