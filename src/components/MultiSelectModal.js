import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MultiSelectModal = ({ visible, items, selectedValues, onSelect, onCancel, title }) => {
    const { themeMode } = useTheme();
    const colors = THEMECOLORS[themeMode];

    // Toggle selection for an item
    const toggleSelection = (item) => {
        const exists = selectedValues.some(val => val.id === item.id);
        if (exists) {
            // Remove
            onSelect(selectedValues.filter(val => val.id !== item.id));
        } else {
            // Add
            onSelect([...selectedValues, item]);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedValues.some(val => val.id === item.id);

        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    { borderBottomColor: '#ccc' },
                    isSelected && { backgroundColor: colors.primary + '20' },
                ]}
                onPress={() => toggleSelection(item)}
            >
                <Text
                    style={[
                        Louis_George_Cafe.regular.h5,
                        styles.itemText,
                        { color: colors.textPrimary },
                        isSelected && { fontWeight: 'bold' }
                    ]}
                >
                    {item.label}
                </Text>

                {isSelected && (
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={wp(6)}
                        color={colors.primary}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { backgroundColor: colors.viewBackground }]}>
                            {title ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginHorizontal: wp(4),
                                    }}
                                >
                                    <Text
                                        style={[
                                            Louis_George_Cafe.bold.h5,
                                            { color: colors.textPrimary, flex: 1 },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {title}
                                    </Text>
                                    <MaterialCommunityIcons
                                        onPress={onCancel}
                                        name={'close'}
                                        size={wp(7)}
                                        color={colors.textPrimary}
                                    />
                                </View>
                            ) : null}
                            <FlatList
                                data={items}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default MultiSelectModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    container: {
        width: wp(96),
        maxHeight: hp(80),
        borderRadius: wp(4),
        paddingVertical: hp(2),
        marginBottom: wp(4),
        borderWidth: wp(1),
        borderColor: "#CCC",
    },
    item: {
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(5),
        borderBottomWidth: wp(0.2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: wp(4),
        textTransform: "capitalize",
    },
    listContent: {
        paddingBottom: hp(1),
    },
});
