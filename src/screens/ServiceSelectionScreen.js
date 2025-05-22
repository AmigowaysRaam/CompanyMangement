import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../resources/dimensions';
import { COLORS } from '../resources/Colors';
import { Louis_George_Cafe } from '../resources/fonts';

const options = [
  { label: 'Services', value: 'services' },
  { label: 'Products', value: 'products' },
  { label: 'Both (Services and Products)', value: 'both' },
];
const ServiceSelectionScreen = () => {
  const [selected, setSelected] = useState(null);
  const navigation = useNavigation();
  const handleSelect = (value) => {
    setSelected(value);
    setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 500)
  };
  return (
    <View style={styles.container}>
      <Text style={[Louis_George_Cafe.bold.h5, styles.title]}>
        What would you like to offer?
      </Text>
      <Text style={[Louis_George_Cafe.regular.h5, styles.title]}>
        Please select any one
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
              <View style={styles.outerCircle}>
                {selected === option.value && <View style={styles.innerCircle} />}
              </View>
              <Text style={[Louis_George_Cafe.regular.h5, styles.radioText]}>
                {option.label}
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    marginBottom: hp(3),
    textAlign: 'center',
  },
  optionBox: {
    borderWidth: 1,
    borderColor: COLORS.borderColor || '#ccc',
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
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.button_bg_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.button_bg_color,
  },
  radioText: {
    // fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    // marginLeft: 27, 
  },
});

export default ServiceSelectionScreen;
