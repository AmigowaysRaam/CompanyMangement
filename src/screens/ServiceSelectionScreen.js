import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { THEMECOLORS } from '../resources/colors/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useCurrentLocation } from '../hooks/location';

const options = [
  { label: 'services', value: 'services' },
  { label: 'products', value: 'products' },
  { label: 'both_service_and_product', value: 'both' },
];

const ServiceSelectionScreen = () => {
  const [selected, setSelected] = useState(null);
  const navigation = useNavigation();
  const { currency, langCode } = useCurrentLocation();
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation();

  const isTamil = i18n.language === 'ta'; // Check if the current language is Tamil

  const handleSelect = (value) => {
    setSelected(value);
    setTimeout(() => {
      navigation.replace('CategoryListScreen', {
        value
      });
    }, 500);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: THEMECOLORS[themeMode].background }
    ]}>
      <Text style={[
        Louis_George_Cafe.bold.h4,
        styles.title,
        {
          color: THEMECOLORS[themeMode].primary,
          lineHeight: wp(7),
          fontSize: isTamil ? wp(4.2) : wp(5),
        }
      ]}>
        {t('wht_would_u_like_to_offer') + '?'}
      </Text>

      <Text style={[
        Louis_George_Cafe.regular.h5,
        styles.title,
        {
          color: THEMECOLORS[themeMode].primary,
          lineHeight: wp(7),
          fontSize: isTamil ? wp(3.6) : wp(4.5),
        }
      ]}>
        {t('pls_select_any_one')}
      </Text>

      {/* Box wrapping all radio options */}
      <View style={styles.optionBox}>
        {options.map((option, index) => (
          <View key={option.value}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.outerCircle,
                { borderColor: THEMECOLORS[themeMode].primaryApp }
              ]}>
                {selected === option.value && <View style={[styles.innerCircle, { backgroundColor: THEMECOLORS[themeMode].primaryApp }]} />}
              </View>
              <Text style={[
                Louis_George_Cafe.regular.h5,
                styles.radioText,
                {
                  color: THEMECOLORS[themeMode].primaryApp,
                  lineHeight: wp(7),
                  fontSize: isTamil ? wp(3.6) : wp(4.5),
                }
              ]}>
                {t(option.label)}
              </Text>
            </TouchableOpacity>

            {/* Separator between options, except after last one */}
            {index !== options.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    justifyContent: 'center',
  },
  title: {
    marginBottom: hp(3),
    textAlign: 'center',
  },
  optionBox: {
    borderWidth: 1,
    borderRadius: wp(3),
    backgroundColor: '#fff',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
  },
  outerCircle: {
    height: wp(4),
    width: wp(4),
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  innerCircle: {
    height: wp(2),
    width: wp(2),
    borderRadius: 6,
    // backgroundColor: '#000',
  },
  radioText: {
    // fontSize is handled inline
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default ServiceSelectionScreen;
