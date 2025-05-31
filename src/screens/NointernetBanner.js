import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Louis_George_Cafe } from '../resources/fonts';
import { wp } from '../resources/dimensions';

const NoInternetBanner = () => {
    return (
        <View style={{
            alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1,
        }}>
            <Image
                source={require("../../src/assets/animations/no_internet.png")}
            />
            <LinearGradient
                colors={['#c00', '#ed0000', '#ff0e0e']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.coverImage}
            >
                <View>
                    <Text style={[Louis_George_Cafe.bold.h7, styles.offlineText]}>
                        {`${'No Internet Connection'} ..!`}
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    coverImage: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center', width: wp(70),
        borderBottomRightRadius: wp(8),
        borderTopLeftRadius: wp(8),

    },
    offlineText: {
        color: '#fff',
    },
});

export default NoInternetBanner;
