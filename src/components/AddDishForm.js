import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { MenuContext } from '../context/MenuContext';

export default function AddDishForm({ restaurantId, menuId, categoryName, dish, dishIndex, isNewDish }) {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(isNewDish);
  const [isLoading, setIsLoading] = useState(false);
  const { addDish, updateDish, removeDish } = useContext(MenuContext);

  useEffect(() => {
    if (!isNewDish && dish) {
      setDishName(dish.name);
      setPrice(dish.price);
      setIsEditing(false); // Only allow editing if the dish is already added
    } else {
      setIsEditing(true); // Always allow editing for a new dish
    }
  }, [dish, isNewDish]);

  const handleAddDish = async () => {
    if (dishName && price) {
      setIsLoading(true);
      try {
        await addDish(restaurantId, menuId, categoryName, { name: dishName, price });
        setDishName(''); 
        setPrice(''); 
        await refreshData();
      } catch (error) {
        Alert.alert("Error", "Failed to add dish.");
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Validation", "Please enter both dish name and price.");
    }
  };
  

  const handleSaveDish = async () => {
    if (dishName && price) {
      setIsLoading(true);
      try {
        await updateDish(restaurantId, menuId, categoryName, dishIndex, { name: dishName, price });
        setIsEditing(false); // Freeze the inputs after saving
      } catch (error) {
        Alert.alert("Error", "Failed to save dish.");
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Validation", "Please enter both dish name and price.");
    }
  };

  const handleDeleteDish = async () => {
    setIsLoading(true);
    try {
      await removeDish(restaurantId, menuId, categoryName, dishIndex);
    } catch (error) {
      Alert.alert("Error", "Failed to remove dish.");
    } finally {
      setIsLoading(false);
    }
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
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        isEditing ? (
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
        )
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
