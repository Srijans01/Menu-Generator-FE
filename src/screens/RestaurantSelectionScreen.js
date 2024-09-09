import React, { useContext, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { MenuContext } from '../context/MenuContext';

export default function RestaurantSelectionScreen({ navigation }) {
  const { restaurants, addRestaurant } = useContext(MenuContext);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantLocation, setNewRestaurantLocation] = useState('');

  const handleAddRestaurant = () => {
    if (newRestaurantName && newRestaurantLocation) {
      const newRestaurant = {
        name: newRestaurantName,
        location: newRestaurantLocation,
      };
      addRestaurant(newRestaurant);
      setNewRestaurantName('');
      setNewRestaurantLocation('');
    }
  };

  const handleSelectRestaurant = (restaurantId) => {
    navigation.navigate('MenuManagement', { restaurantId });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Restaurant/Cafe Name"
        value={newRestaurantName}
        onChangeText={setNewRestaurantName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Location"
        value={newRestaurantLocation}
        onChangeText={setNewRestaurantLocation}
        style={styles.input}
      />
      <Button title="Add New Restaurant/Cafe" onPress={handleAddRestaurant} />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id} // Assuming MongoDB stores ID in _id
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Button 
              title="Manage Menus" 
              onPress={() => handleSelectRestaurant(item._id)} // Pass _id as restaurantId
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  itemContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
