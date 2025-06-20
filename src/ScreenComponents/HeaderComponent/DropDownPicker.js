// DropdownPicker.js
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, Text } from 'react-native';

const DropdownPicker = ({ label, value, items, onValueChange, error }) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
      <DropDownPicker
        open={Boolean(value)}
        value={value}
        items={items}
        setOpen={() => {}}
        setValue={onValueChange}
        setItems={() => {}}
        placeholder={`Select ${label}`}
        containerStyle={{ height: 40 }}
        style={{ backgroundColor: '#fafafa' }}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
      />
      {error && <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text>}
    </View>
  );
};

export default DropdownPicker;
