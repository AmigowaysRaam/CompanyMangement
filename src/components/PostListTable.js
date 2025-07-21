import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity,
    ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { wp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import ImageGalleryModal from './ImageGalleryModal';
import DropdownModal from './DropDownModal';
import ConfirmationModal from './ConfirmationModal';

async function fetchOrgAnalytics(orgId, accessToken, postUrn) {
    const encodedOrg = encodeURIComponent(`urn:li:organization:${orgId}`);
    const paramKey = postUrn.startsWith('urn:li:ugcPost:') ? 'ugcPosts' : 'shares';
    const url = `https://api.linkedin.com/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodedOrg}&${paramKey}=List(${encodeURIComponent(postUrn)})`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202407',
            Accept: 'application/json',
        },
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.elements?.[0]?.totalShareStatistics || {};
}

async function deleteUGCPost(postUrn, accessToken) {
    console.log(postUrn);
}

const PostListTable = ({ item, isExpanded, toggleExpand, accessToken, organization }) => {
    const { themeMode } = useTheme();
    const theme = THEMECOLORS[themeMode];
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStartIndex, setModalStartIndex] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const content = item?.specificContent?.['com.linkedin.ugc.ShareContent'];
    const text = content?.shareCommentary?.text || '';
    const media = content?.media || [];
    const postUrn = item.id;
    const orgId = organization?.id;

    const dropdownItems = [
        { label: 'Edit Post', value: 'edit' },
        { label: 'Delete Post', value: 'delete' },
        { label: 'View on LinkedIn', value: 'view' },
    ];

    const handleDropdownSelect = async (option) => {
        setDropdownVisible(false);
        switch (option.value) {
            case 'edit':
                alert('Edit functionality not implemented.');
                break;
            case 'delete':

                setShowConfirmModal(true);

                break;
            case 'view':
                alert('Open in browser (not yet implemented).');
                break;
            default:
                break;
        }
    };

    const handleConfirmDelete = async () => {
        setShowConfirmModal(false);
        try {
            await deleteUGCPost(postUrn, accessToken);
            // alert('Post deleted successfully.');
            // TODO: Optional - call a parent refresh function if needed
        } catch (err) {
            alert(`Failed to delete post: ${err.message}`);
        }
    };


    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const s = await fetchOrgAnalytics(orgId, accessToken, postUrn);
                const impressionCount = Number(s.impressionCount) || 0;
                const likeCount = Number(s.likeCount) || 0;
                const commentCount = Number(s.commentCount) || 0;
                const shareCount = Number(s.shareCount) || 0;
                const clickCount = Number(s.clickCount) || 0;

                const engagements = likeCount + commentCount + shareCount;
                const engagementRate = impressionCount > 0 ? (engagements / impressionCount) * 100 : 0;
                const ctr = impressionCount > 0 ? (clickCount / impressionCount) * 100 : 0;

                setStats({
                    impressions: impressionCount,
                    engagements,
                    engagementRate: engagementRate.toFixed(2),
                    reactions: likeCount,
                    comments: commentCount,
                    reposts: shareCount,
                    clicks: clickCount,
                    ctr: ctr.toFixed(2),
                });
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        if (isExpanded && !stats && !loading) load();
    }, [isExpanded]);

    const infoRow = (icon, label, value) => (
        <View style={styles.metricRow} key={label}>
            <View style={styles.metricLeft}>
                <Feather name={icon} size={wp(4)} color={theme.textPrimary} />
                <Text style={[styles.metricLabel, { color: theme.textPrimary }]}>{label}</Text>
            </View>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{value || '0'}</Text>
        </View>
    );

    const openModalAtIndex = (index) => {
        setModalStartIndex(index);
        setModalVisible(true);
    };
    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#CCC" }]}>
            {/* <Text>{item?.id}</Text> */}
            <TouchableOpacity onPress={toggleExpand} style={styles.header}>
                <View style={{ flexDirection: "row", width: wp(78) }}>
                    {!isExpanded && (
                        media.length > 0 ? (
                            <TouchableOpacity onPress={() => openModalAtIndex(0)}>
                                <Image source={{ uri: media[0].originalUrl }} style={styles.thumb} />
                            </TouchableOpacity>
                        ) : <View style={[styles.thumb, { backgroundColor: '#ccc' }]} />
                    )}
                    <View style={styles.headContent}>
                        <Text style={[styles.text, { color: theme.textPrimary }]}>
                            {text.length > 50 && !isExpanded ? text.slice(0, 30) + '…' : text}
                        </Text>
                        <Text style={[styles.toggleText, { color: theme.textPrimary }]}>
                            {isExpanded ? 'Show less ▲' : 'Show more ▼'}
                        </Text>
                    </View>
                </View>

                <MaterialCommunityIcons
                    onPress={() => setDropdownVisible(true)}
                    name="dots-horizontal-circle"
                    size={wp(6)}
                    color={theme.textPrimary}
                />
            </TouchableOpacity>

            {isExpanded && media.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                    {media.map((m, index) => (
                        <TouchableOpacity key={index} onPress={() => openModalAtIndex(index)}>
                            <Image source={{ uri: m.originalUrl }} style={styles.expandedImage} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <ImageGalleryModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                media={media}
                startIndex={modalStartIndex}
            />

            {isExpanded && (
                <View style={styles.analytics}>
                    {loading ? (
                        <ActivityIndicator color={theme.textPrimary} />
                    ) : error ? (
                        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
                    ) : stats && (
                        <>
                            {infoRow('eye', 'Impressions', stats.impressions)}
                            {infoRow('activity', 'Engagements', stats.engagements)}
                            {infoRow('percent', 'Engagement Rate', `${stats.engagementRate}%`)}
                            {infoRow('external-link', 'Clicks', stats.clicks)}
                            {infoRow('bar-chart-2', 'Click-through Rate', `${stats.ctr}%`)}
                            {infoRow('thumbs-up', 'Reactions', stats.reactions)}
                            {infoRow('message-square', 'Comments', stats.comments)}
                            {infoRow('repeat', 'Reposts', stats.reposts)}
                        </>
                    )}
                </View>
            )}
            <DropdownModal
                visible={dropdownVisible}
                items={dropdownItems}
                onSelect={handleDropdownSelect}
                onCancel={() => setDropdownVisible(false)}
                title=""
            />
            <ConfirmationModal
                visible={showConfirmModal}
                message={'"Are you sure you want to delete this post?"'}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmModal(false)}
            />

        </View>
    );
};

export default React.memo(PostListTable);

const styles = StyleSheet.create({
    card: {
        marginVertical: wp(2), borderRadius: wp(2), borderWidth: wp(0.3), padding: wp(1),
    },
    header: {
        flexDirection: 'row', padding: wp(3), justifyContent: 'space-between', alignItems: 'center',
    },
    thumb: {
        width: wp(12), height: wp(12), borderRadius: wp(1.5), marginRight: wp(3),
    },
    headContent: {
        flex: 1,
    },
    text: {
        ...Louis_George_Cafe.regular.h9, fontSize: wp(3.4), marginBottom: wp(1),
    },
    toggleText: {
        fontSize: wp(3), fontWeight: 'bold',
    },
    imageScroll: { marginVertical: wp(2), paddingLeft: wp(3) },
    expandedImage: {
        width: wp(20), height: wp(20), borderRadius: wp(1.5), marginRight: wp(2),
    },
    analytics: {
        borderTopWidth: wp(0.2), paddingHorizontal: wp(4), paddingBottom: wp(3),
    },
    metricRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: wp(1.2), borderBottomWidth: 0.5, borderBottomColor: '#eee',
    },
    metricLeft: {
        flexDirection: 'row', alignItems: 'center',
    },
    metricLabel: {
        marginLeft: wp(2), fontSize: wp(3.2),
    },
    metricValue: {
        fontSize: wp(3.2), fontWeight: '600',
    },
    errorText: {
        textAlign: 'center', fontSize: wp(3.2), marginVertical: wp(2),
    },
});
