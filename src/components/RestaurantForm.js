import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { MenuContext } from '../context/MenuContext';

export default function RestaurantForm() {
  const { setRestaurantInfo } = useContext(MenuContext);
  const [restaurantName, setRestaurantName] = useState('');
  const [location, setLocation] = useState('');
  const [menuName, setMenuName] = useState('');

  const handleSave = () => {
    if (restaurantName && location && menuName) {
      setRestaurantInfo({
        restaurantName,
        location,
        menuName,
      });
      // Clear the input fields after saving
      setRestaurantName('');
      setLocation('');
      setMenuName('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Restaurant/Cafe Name"
        value={restaurantName}
        onChangeText={setRestaurantName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Menu Name (e.g., Food, Drinks)"
        value={menuName}
        onChangeText={setMenuName}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});
