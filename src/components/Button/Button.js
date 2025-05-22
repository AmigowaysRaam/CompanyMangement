import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { hp, wp } from "../../resources/dimensions";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

function ButtonComponent({ title, isLoading, onPress }) {
  const buttonWidth = useSharedValue(wp(60));

  // Animate button width based on loading state
  React.useEffect(() => {
    if (isLoading) {
      buttonWidth.value = withTiming(wp(12), { duration: 300 }); 
    } else {
      buttonWidth.value = withTiming(wp(60), { duration: 300 }); 
    }
  }, [isLoading]);

  // Create animated style for button
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      width: buttonWidth.value,
    };
  });

  return (
    <Animated.View style={[animatedButtonStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: COLORS.button_bg_color, width: "100%" },
        ]}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" style={styles.loader} />
        ) : (
          <Text
            style={[
              Louis_George_Cafe.bold.h7,
              {
                color: "#FFF",
              },
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    height: hp(5),
    borderRadius: hp(2.5),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    marginVertical:wp(4),
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    alignSelf: "center",
  },
});

export default ButtonComponent;
