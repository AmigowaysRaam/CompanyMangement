import { Dimensions } from "react-native";
import { wp } from "./dimensions";
import { DefaultTheme } from "react-native-paper";

export const { width, height } = Dimensions.get("window");

export const fonts = {
  Louis_George_Cafe: "Louis_George_Cafe",
  Louis_George_Cafe_Light: "Louis_George_Cafe_Light",
  Louis_George_Cafe_Bold: "Louis_George_Cafe_Bold",
  Louis_George_Cafe_Regular: "Louis_George_Cafe_Regular",
  CooperBlack: "CooperBlack"
};

export const fontSizes = {
  boldLarge: { fontSize: width <= 320 ? wp(16.66) : wp(16.66) }, // 60px
  larger: { fontSize: width <= 320 ? wp(8.3) : wp(8.3) }, // larger
  large: { fontSize: width <= 320 ? wp(7.9) : wp(7.9) }, // larger
  medium: { fontSize: width <= 320 ? wp(7.3) : wp(7.3) }, // medium
  h1: { fontSize: width <= 320 ? wp(6.95) : wp(6.95) }, // 26 large
  h2: { fontSize: width <= 320 ? wp(6.4) : wp(6.4) }, // 24
  h3: { fontSize: width <= 320 ? wp(5.87) : wp(5.87) }, // 22
  h4: { fontSize: width <= 320 ? wp(5.35) : wp(5.35) }, // 20
  h5: { fontSize: width <= 320 ? wp(4.8) : wp(4.8) }, // 18
  h6: { fontSize: width <= 320 ? wp(4.3) : wp(4.3) }, // 16 medium
  h7: { fontSize: width <= 320 ? wp(3.75) : wp(3.75) }, // 14 regular
  h8: { fontSize: width <= 320 ? wp(3.2) : wp(3.2) }, // 13 or 12 small
  h9: { fontSize: width <= 320 ? wp(2.8) : wp(2.8) }, // 11 or 10 xsmall
};

export const colors = { commonText: "#000000" };

export const Louis_George_Cafe = {
  regular: {
    large: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.large,
      color: colors.commonText,
    },
    h1: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h1,
      color: colors.commonText,
    },
    h2: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h2,
      color: colors.commonText,
    },
    h3: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h3,
      color: colors.commonText,
    },
    h4: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h4,
      color: colors.commonText,
    },
    h5: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h5,
      color: colors.commonText,
    },
    h6: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h6,
      color: colors.commonText,
    },
    h7: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h7,
      color: colors.commonText,
    },
    h8: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h8,
      color: colors.commonText,
    },
    h9: {
      fontFamily: fonts.Louis_George_Cafe_Regular,
      ...fontSizes.h9,
      color: colors.commonText,
    },
  },
  medium: {
    h1: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h1,
      color: colors.commonText,
    },
    h2: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h2,
      color: colors.commonText,
    },
    h3: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h3,
      color: colors.commonText,
    },
    h4: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h4,
      color: colors.commonText,
    },
    h5: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h5,
      color: colors.commonText,
    },
    h6: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h6,
      color: colors.commonText,
    },
    h7: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h7,
      color: colors.commonText,
    },
    h8: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h8,
      color: colors.commonText,
    },
    h9: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.h9,
      color: colors.commonText,
    },
    medium: {
      fontFamily: fonts.Louis_George_Cafe,
      ...fontSizes.medium,
      color: colors.commonText,
    },
  },
  // semi_bold: {
  //   h1: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h1,
  //     color: colors.commonText,
  //   },
  //   h2: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h2,
  //     color: colors.commonText,
  //   },
  //   h3: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h3,
  //     color: colors.commonText,
  //   },
  //   h4: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h4,
  //     color: colors.commonText,
  //   },
  //   h5: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h5,
  //     color: colors.commonText,
  //   },
  //   h6: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h6,
  //     color: colors.commonText,
  //   },
  //   h7: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h7,
  //     color: colors.commonText,
  //   },
  //   h8: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h8,
  //     color: colors.commonText,
  //   },
  //   h9: {
  //     fontFamily: fonts.poppins_semi_bold,
  //     ...fontSizes.h9,
  //     color: colors.commonText,
  //   },
  // },
  bold: {
    boldLarge: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.boldLarge,
      color: colors.commonText,
    },
    large: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.large,
      color: colors.commonText,
    },
    medium: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.medium,
      color: colors.commonText,
    },
    h1: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h1,
      color: colors.commonText,
    },
    h2: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h2,
      color: colors.commonText,
    },
    h3: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h3,
      color: colors.commonText,
    },
    h4: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h4,
      color: colors.commonText,
    },
    h5: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h5,
      color: colors.commonText,
    },
    h6: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h6,
      color: colors.commonText,
    },
    h7: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h7,
      color: colors.commonText,
    },
    h8: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h8,
      color: colors.commonText,
    },
    h9: {
      fontFamily: fonts.Louis_George_Cafe_Bold,
      ...fontSizes.h9,
      color: colors.commonText,
    },
  },
};
