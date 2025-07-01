import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { wp, hp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';
import { THEMECOLORS } from '../resources/colors/colors';
import { Louis_George_Cafe } from '../resources/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DropdownModal = ({ visible, items, onSelect, onCancel, title, selectedValue }) => {

    const { themeMode } = useTheme();
    const colors = THEMECOLORS[themeMode];
    const renderItem = ({ item }) => {
        const isSelected = item.value === selectedValue;
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    { borderBottomColor: '#ccc' },
                    isSelected && { backgroundColor: colors.primary + '20' }, // Light highlight
                ]}
                onPress={() => onSelect(item)}
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
            </TouchableOpacity>
        );
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { backgroundColor: colors.viewBackground, }]}>
                            {title ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginHorizontal: wp(4),
                                        // paddingVertical: hp(1),
                                    }}
                                >
                                    <Text
                                        style={[
                                            Louis_George_Cafe.bold.h5,
                                            { color: colors.textPrimary, flex: 1 }, // ensures title text doesn't push out "x"
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {title}
                                    </Text>

                                    <MaterialCommunityIcons onPress={() => onCancel()} name={'close'} size={wp(7)} color={colors.textPrimary} />
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

export default DropdownModal;

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
        backgroundColor: '#ccc',
        borderRadius: wp(4),
        paddingVertical: hp(2),
        marginBottom: wp(4),
        borderWidth: wp(0.1),
        borderColor: "#CCC",
        borderWidth: wp(1),
        // minHeight:wp(50)
    },
    title: {
        textAlign: 'center',
        marginBottom: hp(1.5),
    },
    item: {
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(5),
        borderBottomWidth: wp(0.2),
    },
    itemText: {
        fontSize: wp(4),
        textTransform: "capitalize"
    },

    listContent: {
        paddingBottom: hp(1),
    },
});
