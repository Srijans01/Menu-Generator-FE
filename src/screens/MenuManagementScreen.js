import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios'; // Ensure axios is imported
import { MenuContext } from '../context/MenuContext';

export default function MenuManagementScreen({ route, navigation }) {
  const { restaurantId } = route.params; // Ensure restaurantId is being passed correctly from route.params
  const [restaurant, setRestaurant] = useState(null);
  const { API_URL } = useContext(MenuContext); // Ensure API_URL is set in MenuContext
  const [menuName, setMenuName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      console.log("id , " , restaurantId)
      console.log("ur , " , API_URL)
      if (!restaurantId || !API_URL) {
        console.error("Restaurant ID or API URL is missing:", restaurantId, API_URL);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        console.log("Fetched restaurant data:", response.data);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId, API_URL]);

  const handleAddMenu = () => {
    setIsModalVisible(true); // Show the modal to input the menu name
  };

  const handleCreateMenu = async () => {
    console.log("Create Menu button clicked");
    if (menuName.trim()) {
      console.log("Menu name is valid, calling addMenu with:", menuName);
      try {
        // Add the new menu with the entered name
        const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menus`, { name: menuName.trim() });
        console.log("Response after menu creation:", response.data);
  
        const newMenuId = response.data.menu_id; // Get the menu_id from the backend response
        setIsModalVisible(false); // Close the modal
        setMenuName(''); // Clear the input
  
        // Reload the restaurant data to reflect the new menu
        const restaurantResponse = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        console.log("Updated restaurant data:", restaurantResponse.data);
        setRestaurant(restaurantResponse.data);
  
        // Navigate to the Add/Edit Menu screen with the restaurantId and newMenuId
        navigation.navigate('AddEditMenu', { restaurantId, menuId: newMenuId });
  
      } catch (error) {
        console.error("Error creating menu:", error);
      }
    } else {
      console.log("Menu name is invalid");
      setIsModalVisible(false); // Close the modal
      setMenuName(''); // Clear the input
    }
  };
  
  


  const handleEditMenu = (menuId) => {
    console.log("Navigating to Edit Menu with:", { restaurantId, menuId });
    navigation.navigate('AddEditMenu', { restaurantId, menuId });
  };

  if (!restaurant) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <TouchableOpacity onPress={handleAddMenu} style={styles.addButton}>
        <Text style={styles.buttonText}>Add New Menu</Text>
      </TouchableOpacity>

      {/* Debugging to ensure the correct data is passed to FlatList */}
      {restaurant.menus.length > 0 ? (
        <FlatList
        data={restaurant?.menus}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.menuName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleEditMenu(item.id)} style={styles.editButton}>
              <Text style={styles.buttonText}>Edit Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      ) : (
        <Text>No menus available</Text> // Show this if no menus are found
      )}

      {/* Modal for Menu Name Input */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Menu Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Menu Name"
              value={menuName}
              onChangeText={setMenuName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleCreateMenu} style={styles.createButton}>
                <Text style={styles.buttonText}>Create Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
