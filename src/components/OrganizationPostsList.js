import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { wp, hp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import PostListTable from './PostListTable';
const PAGE_SIZE = 10;

const OrganizationUGCPosts = ({ accessToken, orgId, profile,handleEditMode }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { themeMode } = useTheme();
  const orgLogo =
    profile?.logoV2?.['original~']?.elements?.[0]?.identifiers?.[0]?.identifier || null;
  const fetchOrgUGCPosts = async (startOffset = 0) => {
    try {
      const authorsParam = encodeURIComponent(`List(urn:li:organization:${orgId})`);
      const url = `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=${authorsParam}&sortBy=LAST_MODIFIED&start=${startOffset}&count=${PAGE_SIZE}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      const items = response.data.elements || [];
      // alert(JSON.stringify(items));
      return items;
    } catch (error) {
      console.error('Error fetching UGC posts:', error.response?.data || error.message);
      return [];
    }
  };

  const loadInitialPosts = async () => {
    setLoading(true);
    setStart(0);
    const data = await fetchOrgUGCPosts(0);
    setPosts(data);
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
  };

  const loadMorePosts = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    const nextStart = start + PAGE_SIZE;
    const morePosts = await fetchOrgUGCPosts(nextStart);
    setPosts((prev) => [...prev, ...morePosts]);
    setStart(nextStart);
    setHasMore(morePosts.length === PAGE_SIZE);
    setIsFetchingMore(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialPosts();
    setRefreshing(false);
  }, [accessToken, orgId]);
  useEffect(() => {
    if (accessToken && orgId) {
      loadInitialPosts();
    }
  }, [orgId, accessToken]);
  const renderItem = ({ item }) => {
    const isExpanded = expandedPosts[item.id];
    const toggleExpand = () => {
      setExpandedPosts((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    };
    // console.log(JSON.stringify(item, null, 2))
    const hanleFhandleEditMode = (postUrn) =>{
      handleEditMode(postUrn)
    }
    return (
      <PostListTable
        onRefresh={onRefresh}
        accessToken={accessToken}
        item={item}
        orgLogo={orgLogo}
        organization={profile}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        handleEditMode={hanleFhandleEditMode}
      />
    );
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={i}
            style={{
              backgroundColor: themeMode === 'dark' ? '#333' : '#ddd',
              height: hp(7),
              marginVertical: wp(1.5),
              borderRadius: wp(2),
              alignItems: 'center',
            }}
          >
          </View>
        ))}
      </View>
    );
  }

  if (posts?.length === 0) {
    return <Text style={styles.emptyText}>No UGC posts found.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator
              style={{ marginVertical: wp(4) }}
              size="small"
              color="#0073b1"
            />
          ) : null
        }
      />
    </View>
  );
};

export default OrganizationUGCPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: wp(1), flexGrow: 1,
  },
  orgLogo: {
    width: wp(7), height: wp(7), borderRadius: wp(4), marginRight: wp(2),
    borderWidth: wp(0.3), borderColor: '#000',
  },
  loadingContainer: { padding: wp(2), flex: 1, },
  postContainer: {
    padding: wp(2), borderRadius: wp(2), marginBottom: wp(4), borderWidth: wp(0.3),
    borderColor: '#CCC', paddingVertical: wp(4),
  },
  showMoreText: {
    color: '#0073b1', fontSize: wp(3.5), fontWeight: '600', marginBottom: wp(2),
  },
  postText: {
    marginBottom: wp(2),
  },
  postImage: {
    borderRadius: wp(2), marginBottom: wp(2), alignSelf: 'center',
  },
  dateText: {
    paddingHorizontal: wp(2), textTransform: 'capitalize',
  },
  emptyText: {
    marginTop: hp(10), textAlign: 'center', color: '#999',
  },
});
