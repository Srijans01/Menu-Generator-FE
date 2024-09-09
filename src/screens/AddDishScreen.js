import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MenuContext } from '../context/MenuContext';

export default function AddDishForm({ restaurantId, menuId, categoryName, dish, dishIndex, isNewDish }) {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(isNewDish);
  const { addDish, updateDish, removeDish } = useContext(MenuContext);

  useEffect(() => {
    if (!isNewDish && dish) {
      setDishName(dish.name);
      setPrice(dish.price);
    }
  }, [dish, isNewDish]);

  const handleAddDish = () => {
    if (dishName && price) {
      addDish(restaurantId, menuId, categoryName, { name: dishName, price });
      setDishName(''); // Clear the input fields after adding
      setPrice(''); // Clear the input fields after adding
      setIsEditing(false); // Freeze inputs after adding
    } else {
      alert("Please enter both a dish name and price.");
    }
  };

  const handleSaveDish = () => {
    if (dishName && price) {
      updateDish(restaurantId, menuId, categoryName, dishIndex, { name: dishName, price });
      setIsEditing(false); // Freeze the inputs after saving
    }
  };

  const handleDeleteDish = () => {
    removeDish(restaurantId, menuId, categoryName, dishIndex);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Dish Name"
        value={dishName}
        onChangeText={setDishName}
        editable={isEditing} // Control if the input is editable
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
        editable={isEditing} // Control if the input is editable
      />
      {isEditing ? (
        <TouchableOpacity onPress={isNewDish ? handleAddDish : handleSaveDish} style={styles.saveButton}>
          <Text style={styles.buttonText}>{isNewDish ? "Add Dish" : "Save Dish"}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteDish} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green color for Save/Add button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50', // Green color for Edit button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336', // Red color for Remove button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
