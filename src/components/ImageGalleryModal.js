import React, { useRef, useState, useEffect } from 'react';
import {
    Modal, View, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList,
    RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { wp } from '../resources/dimensions';
const { width, height } = Dimensions.get('window');
const ImageGalleryModal = ({ visible, onClose, media, startIndex = 0 }) => {
    const flatListRef = useRef(null);
    useEffect(() => {
        if (visible && flatListRef.current && media && media.length > 0) {
            flatListRef.current.scrollToIndex({ index: startIndex, animated: false });
        }
    }, [visible, startIndex, media]);

    const onRefresh = () => {
        onClose();
    };

    const renderItem = ({ item, index }) => (
        <Image
            key={item.media || index}
            source={{ uri: item.originalUrl }}
            style={styles.fullImage}
            resizeMode="contain"
        />
    );

    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View style={styles.modalBackground}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Feather name="x" size={wp(6)} color="#fff" />
                </TouchableOpacity>
                <FlatList
                    ref={flatListRef}
                    data={media}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.media || index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.scrollContainer}
                    getItemLayout={(_, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                    initialScrollIndex={startIndex}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}  // always false to hide spinner
                            onRefresh={onRefresh}
                            colors={['transparent']}
                            progressBackgroundColor="transparent"
                        />
                    }
                />
            </View>
        </Modal>
    );
};

export default ImageGalleryModal;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullImage: {
        width: width,
        height: height * 0.85,
    },
    closeButton: {
        position: 'absolute',
        top: wp(10),
        right: wp(5),
        zIndex: 10,
    },
});
