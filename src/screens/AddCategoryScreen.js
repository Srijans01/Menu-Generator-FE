import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MenuContext } from '../context/MenuContext';
import AddDishForm from '../components/AddDishForm';

export default function AddCategoryScreen({ restaurantId, menuId }) {
  const [categoryName, setCategoryName] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(null); // Track which category is being edited
  const { restaurants, addCategory, updateCategory, removeCategory, loading, fetchRestaurant } = useContext(MenuContext);

  useEffect(() => {
    const fetchData = async () => {
      const updatedRestaurant = await fetchRestaurant(restaurantId);
      const updatedMenu = updatedRestaurant.menus.find((m) => m.id === menuId);
      setMenu(updatedMenu);
    };
    fetchData();
  }, [restaurants, restaurantId, menuId]); 
  

  const refreshData = async () => {
    const updatedRestaurant = await fetchRestaurant(restaurantId); // Fetch the restaurant again from the API
    const updatedMenu = updatedRestaurant.menus.find((m) => m.id === menuId);
    setMenu(updatedMenu); // Trigger re-render by updating the menu
  };
  

  if (loading) {
    return <Text>Loading...</Text>;  // Show loading message while fetching data
  }

  // Wait for restaurants to be populated before trying to find the restaurant and menu
  if (!restaurants || restaurants.length === 0) {
    return <Text style={styles.errorText}>Loading restaurants...</Text>;
  }

  console.log("rest id in add cat screen is " , restaurantId)

  const restaurant = restaurants.find((rest) => rest._id === restaurantId);
  const menu = restaurant ? restaurant?.menus.find((m) => m.id === menuId) : null;
  
  console.log("rests in add cat screen is " , restaurants)

  console.log("rest in add cat screen is " , restaurant)

  if (!menu) {
    return <Text style={styles.errorText}>Menu not found</Text>;
  }

  const handleAddCategory = async () => {
    if (categoryName) {
      // Call addCategory to make the API request
      await addCategory(restaurantId, menuId, { name: categoryName, dishes: [] });
      
      // Fetch updated restaurant data (optional, to ensure sync with backend)
      const updatedRestaurant = await fetchRestaurant(restaurantId);
      const updatedMenu = updatedRestaurant.menus.find((m) => m.id === menuId);
      
      // Update the menu state
      setMenu(updatedMenu); // Trigger re-render by updating the menu with the newly added category
      
      // Clear the input field
      setCategoryName('');
    }
  };
  
  

  const handleEditCategory = async (index) => {
    if (categoryName) {
      await updateCategory(restaurantId, menuId, index, { name: categoryName });
      setIsEditingCategory(null); // Exit edit mode
      setCategoryName(''); // Clear the input
    }
  };

  const handleDeleteCategory = (index) => {
    removeCategory(restaurantId, menuId, index); // Remove the category and its dishes
    refreshData();
  };

  const startEditingCategory = (index) => {
    setIsEditingCategory(index);
    setCategoryName(menu.categories[index].name); // Prefill with the current category name
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add a New Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Category Name"
          value={categoryName}
          onChangeText={setCategoryName}
        />
        <Button
          title={isEditingCategory !== null ? "Save Category" : "Add Category"}
          onPress={isEditingCategory !== null ? () => handleEditCategory(isEditingCategory) : handleAddCategory}
        />

{menu && menu.categories && menu.categories.length > 0 ? (
  menu.categories.map((category, index) => (
    <View key={index} style={styles.categoryBlock}>
      <View style={styles.categoryRow}>
        <TextInput
          style={styles.categoryInput}
          placeholder="Category Name"
          value={isEditingCategory === index ? categoryName : category.name}
          onChangeText={setCategoryName}
          editable={isEditingCategory === index} // Editable if in edit mode
        />
        <View style={styles.buttonRow}>
          {isEditingCategory === index ? (
            <TouchableOpacity onPress={() => handleEditCategory(index)} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => startEditingCategory(index)} style={styles.editButton}>
              <Text style={styles.buttonText}>Edit Section Name</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleDeleteCategory(index)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render existing dishes */}
      {category.dishes && category.dishes.length > 0 ? (
        category.dishes.map((dish, dishIndex) => (
          <AddDishForm
            key={dishIndex}
            restaurantId={restaurantId}  // Pass restaurantId
            menuId={menuId}  // Pass menuId
            categoryName={category.name}  // Pass categoryName
            dish={dish}  // Pass existing dish
            dishIndex={dishIndex}
            isNewDish={false}  // Existing dish
            refreshData={refreshData}
          />
        ))
      ) : (
        <Text></Text>  // Fallback if no dishes are found
      )}


      {/* Always render the form to add a new dish */}
      <AddDishForm
        key={`new-${index}`} // Unique key for new dish form
        restaurantId={restaurantId}  // Pass restaurantId
        menuId={menuId}  // Pass menuId
        categoryName={category.name}  // Pass categoryName
        isNewDish={true}  // New dish form
        refreshData={refreshData}
      />
    </View>
  ))
) : (
  <Text>No categories available</Text>
)}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },  
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  categoryBlock: {
    marginTop: 32,
    paddingTop: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryInput: {
    flex: 1,
    fontSize: 18,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
