import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Louis_George_Cafe } from '../resources/fonts';
import { wp, hp } from '../resources/dimensions';
import { useTheme } from '../context/ThemeContext';

const UpgradeModal = ({ visible, onUpdatePress, onLaterPress }) => {
  const { themeMode } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => { }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[Louis_George_Cafe.bold.h5, styles.title]}>
            New Version Available!
          </Text>
          <Text style={[Louis_George_Cafe.regular.h8, styles.description]}>
            A new version of the app is available. Please update to enjoy the latest features and improvements.
          </Text>
          <TouchableOpacity onPress={onUpdatePress} style={styles.updateButton}>
            <Text style={[Louis_George_Cafe.bold.h6, styles.buttonText]}>
              Update Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpgradeModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: wp(80),
    borderRadius: wp(2),
    padding: wp(5),
    alignItems: 'center',
  },
  title: {
    color: '#333',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  description: {
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  updateButton: {
    backgroundColor: '#013CA3',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(6),
    borderRadius: wp(1),
    width:wp(68),alignItems:"center"
  },
  buttonText: {
    color: '#fff',
  },
});
