import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { hp, wp } from '../../resources/dimensions';
import { COLORS } from '../../resources/Colors';
import { Louis_George_Cafe } from '../../resources/fonts';
import LinearGradient from 'react-native-linear-gradient';

const PieSlice = ({ rotation, colors }) => (

    <View style={[styles.sliceContainer, { transform: [{ rotate: `${rotation}deg` }] }]}>
        <LinearGradient
            colors={colors}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.slice}
        />
    </View>
);

const PieChart = () => {
    return (
        <View style={styles.card}>
            <Text style={[Louis_George_Cafe.bold.h6, {
                alignSelf: "flex-start", marginBottom: wp(5)
            }]}>Project Overview</Text>
            <View style={styles.chartContainer}>
                <View style={styles.chart}>
                    <PieSlice rotation={20} colors={['#004284', '#6BB0F6']} />
                    <PieSlice rotation={200} colors={['#9747FF', '#D5B5FF']} />
                    <PieSlice rotation={220} colors={['#FF4A36', '#CC4537']} />
                    <View style={styles.centerCircle} />
                </View>

                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#004284' }]} />
                        <Text style={[Louis_George_Cafe.regular.h8, styles.legendText]}>Completed Projects</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#9747FF' }]} />
                        <Text style={[Louis_George_Cafe.regular.h8, styles.legendText]}>Pending Projects</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FF4A36' }]} />
                        <Text style={[Louis_George_Cafe.regular.h8, styles.legendText]}>Upcoming Projects</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: wp(3),
        padding: wp(4),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        height: hp(28), alignItems: "center",
        justifyContent: "center", marginHorizontal: wp(2), marginVertical: wp(3)
    },

    chartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chart: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: COLORS.background,
    },
    sliceContainer: {
        position: 'absolute',
        width: wp(40),
        height: wp(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    slice: {
        width: wp(20),
        height: wp(42),
        borderTopLeftRadius: wp(50),
        borderBottomLeftRadius: wp(50),
    },
    centerCircle: {
        width: wp(24),
        height: wp(24),
        backgroundColor: COLORS.white,
        borderRadius: wp(12),
        position: 'absolute',
        top: wp(8),
        left: wp(8),
    },
    legend: {
        marginLeft: wp(5),
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: wp(2),
    },
    legendColor: {
        width: wp(3),
        height: wp(3),
        borderRadius: wp(2),
        marginRight: wp(2),
    },
    legendText: {
        // fontSize: wp(3.5),
        color: COLORS.black,
    },
});

export default PieChart;
