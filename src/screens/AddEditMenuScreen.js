import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Button, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import AddCategoryScreen from './AddCategoryScreen';
import MobilePreview from '../components/MobilePreview';
import { MenuContext } from '../context/MenuContext';

const windowHeight = Dimensions.get('window').height;

export default function AddEditMenuScreen({ route, navigation }) {
  const { restaurantId, menuId } = route.params;
  const { API_URL } = useContext(MenuContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log("Restaurant ID:", restaurantId);
  console.log("Menu ID:", menuId);
  console.log("API_URL:", API_URL);

  // Fetch restaurant and menu data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        console.log(`Fetching restaurant with ID: ${restaurantId}`);
        const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        console.log("API Response:", response.data);  // Log the entire API response
        const fetchedRestaurant = response.data;
        setRestaurant(fetchedRestaurant);  // Set restaurant
        const fetchedMenu = fetchedRestaurant?.menus.find((m) => m.id === menuId);
        console.log("Fetched Menu:", fetchedMenu);  // Log fetched menu
        setMenu(fetchedMenu);  // Set menu
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);  // Stop loading after fetch
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId, menuId]);

  // Show modal if no menu found after loading
  useEffect(() => {
    if (!loading && !menu) {
      console.log("Menu not found, showing modal...");
      setIsModalVisible(true);
    }
  }, [menu, loading]);

  console.log("Fetched Restaurant from API or Context:", restaurant);
  console.log("Fetched Menu from API or Context:", menu);

  // Handle back to Menu Management
  const handleBackToMenuManagement = () => {
    setIsModalVisible(false);
    navigation.navigate('MenuManagement', { restaurantId });
  };

  // Handle creating a new menu or other actions (optional)
  const handleCreateNewMenu = () => {
    setIsModalVisible(false);
  };

  // Render a loading state while fetching data
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Show modal if menu is not found
  if (!menu && !isModalVisible) {
    return (
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menu Not Found</Text>
            <Text style={styles.modalMessage}>
              It looks like the menu you're trying to access doesn't exist.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleBackToMenuManagement}>
              <Text style={styles.buttonText}>Back to Menu Management</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.createButton]} onPress={handleCreateNewMenu}>
              <Text style={styles.buttonText}>Create New Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Render the content once restaurant and menu are fetched
  return (
    <View style={styles.container}>
      {/* Left side: AddCategoryScreen (scrollable) */}
      <ScrollView style={styles.leftContainer}>
        <Button title="Back to Menu Management" onPress={handleBackToMenuManagement} />
        {menu ? <AddCategoryScreen restaurantId={restaurantId} menuId={menuId} /> : <Text>Loading menu data...</Text>}
      </ScrollView>

      {/* Right side: MobilePreview (fixed position) */}
      <View style={styles.rightContainer}>
        {menu ? <MobilePreview restaurantId={restaurantId} menuId={menuId} /> : <Text>Loading menu preview...</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: windowHeight, // Full height for the container
  },
  leftContainer: {
    flex: 1, // Take 50% of the screen width
    padding: 16,
  },
  rightContainer: {
    flex: 1, // Take 50% of the screen width
    padding: 16,
    borderLeftWidth: 1, // Add a divider between panels
    borderColor: '#ddd',
    height: '100%', // Ensure full height for the right container
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
