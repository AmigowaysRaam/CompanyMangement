import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useRoute } from '@react-navigation/native';

const ActivityDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const profile = useSelector((state) => state.auth.profile);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Example list of grocery items
  const groceryItems = [
    { id: '1', name: 'Tomatoes', quantity: '2 kg', price: 50 },
    { id: '2', name: 'Potatoes', quantity: '3 kg', price: 30 },
    { id: '3', name: 'Onions', quantity: '1.5 kg', price: 40 },
    { id: '4', name: 'Carrots', quantity: '1 kg', price: 60 },
    { id: '5', name: 'Cucumber', quantity: '1.2 kg', price: 20 },
  ];

  const HeaderComponent = ({ profile }) => {
    return (
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={COLORS.button_bg_color} />
        </TouchableOpacity>

        {/* Logo at Center */}
        <TouchableOpacity>
          <Text numberOfLines={1} style={[styles.cardDate, Louis_George_Cafe.bold.h4, {
            justifyContent: "center",
            top: wp(2),
            color: COLORS.button_bg_color
          }]}>{"Activity Details"}</Text>

        </TouchableOpacity>
      </View>
    );
  };

  // Render grocery items
  const renderGroceryItem = ({ item, index }) => (
    <View style={styles.groceryCard}>
      <Text style={[styles.groceryIteName, {
        color: COLORS.white,

      }]}>{`${index + 1}.  `}</Text>
      <Text style={styles.groceryItemName}>{item.name}</Text>
      <Text style={styles.groceryItemQuantity}>{item.quantity}</Text>
      <Text style={styles.groceryItemPrice}>{`${item.price} Rs`}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.cardBackground }]}>
      <View>
        <HeaderComponent profile={profile} />
      </View>

      <View style={styles.card}>

        <Text numberOfLines={1} style={[styles.cardDate, Louis_George_Cafe.regular.h9]}>{item.date}</Text>
        <Text numberOfLines={2} style={[Louis_George_Cafe.medium.h8, styles.cardItem]}>{item.category}</Text>
        <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h8, styles.cardPrice]}>{`${item.price} Rs`}</Text>
      </View>

      {/* Grocery List FlatList */}
      <FlatList
        data={groceryItems}
        renderItem={renderGroceryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />

      <View>
        <TouchableOpacity style={{
          alignSelf: "center",
          backgroundColor: COLORS.background,
          padding: wp(2),
          borderRadius: wp(2),
          justifyContent: "center",
          marginVertical: wp(2),
          paddingHorizontal: wp(8)
        }}>
          <Text style={[Louis_George_Cafe.bold.h6, { color: COLORS.button_bg_color, }]}>
            Re-Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: wp(2),
    marginBottom: wp(5),
    height: wp(14),
    backgroundColor: COLORS.background
  },
  backButton: {
    position: 'absolute',
    left: wp(4),
    zIndex: 2,
    top: wp(3)
  },

  logo: {
    width: wp(40),
    height: wp(6),
  },

  flatListContainer: {
    padding: wp(3),
    marginTop: hp(2),
  },

  card: {
    flexDirection: 'row',
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    padding: wp(4),
    marginVertical: wp(1.5),
    borderRadius: wp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: wp(4),
    marginHorizontal: wp(1),
    width: wp(90),
    alignSelf: "center"
  },

  cardDate: {
    alignSelf: 'center',
  },

  cardItem: {
    marginVertical: wp(1),
    width: wp(45),
    alignSelf: 'center',
  },

  cardPrice: {
    color: "green",
    alignSelf: 'center',
    width: wp(20),
    justifyContent: "flex-end",
  },

  // Styles for grocery items
  groceryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },

  groceryItemName: {
    fontSize: wp(4),
    width: wp(40),
    color: COLORS.white,

  },

  groceryItemQuantity: {
    fontSize: wp(3.5),
    width: wp(30),
    textAlign: 'center',
    color: COLORS.white,

  },

  groceryItemPrice: {
    fontSize: wp(4),
    color: 'green',
    width: wp(20),
    textAlign: 'right',
    color: COLORS.white,

  },
});

export default ActivityDetails;
