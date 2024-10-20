import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios'; 
import { MenuContext } from '../context/MenuContext';

export default function MenuManagementScreen({ route, navigation }) {
  const { restaurantId } = route.params; 
  const [restaurant, setRestaurant] = useState(null);
  const { API_URL } = useContext(MenuContext); 
  const [menuName, setMenuName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null); 
  const [welcomeText, setWelcomeText] = useState('');
  const [editingRestaurantName, setEditingRestaurantName] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [isAddingMenu, setIsAddingMenu] = useState(false); // New state for adding menu

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!restaurantId || !API_URL) {
        console.error("Restaurant ID or API URL is missing:", restaurantId, API_URL);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        setRestaurant(response.data);
        setRestaurantName(response.data.name);  // Pre-fill the restaurant name
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId, API_URL]);

  const handleAddMenu = () => {
    setIsAddingMenu(true); // Show add menu form
    setMenuName('');
    setWelcomeText('');
  };

  const handleCreateMenu = async () => {
    if (menuName.trim()) {
      try {
        const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menus`, { name: menuName.trim(), welcome_text: welcomeText.trim() });
        setIsAddingMenu(false); // Hide add menu form
        setMenuName('');
        setWelcomeText('');
        const restaurantResponse = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        setRestaurant(restaurantResponse.data);
      } catch (error) {
        console.error("Error creating menu:", error);
      }
    }
  };

  const handleEditMenu = async (menuId) => {
    if (menuName.trim()) {
      try {
        await axios.put(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}`, {
          new_name: menuName.trim(),
          welcome_text: welcomeText.trim()
        });
        const updatedResponse = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        setRestaurant(updatedResponse.data);
        setEditingMenuId(null);
        setMenuName(''); 
        setWelcomeText(''); 
      } catch (error) {
        console.error("Error updating menu:", error);
      }
    }
  };

  const startEditingMenu = (menuId, menuName, welcomeText) => {
    setEditingMenuId(menuId);
    setMenuName(menuName); 
    setWelcomeText(welcomeText); 
  };

  const cancelEditing = () => {
    setEditingMenuId(null);
    setMenuName('');
  };

  const cancelAddingMenu = () => {
    setIsAddingMenu(false);
    setMenuName('');
  };

  const handleSaveRestaurantName = async () => {
    if (restaurantName.trim()) {
      try {
        await axios.put(`${API_URL}/restaurants/${restaurantId}`, {
          new_name: restaurantName.trim()
        });
        const updatedResponse = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        setRestaurant(updatedResponse.data);
        setEditingRestaurantName(false); 
      } catch (error) {
        console.error("Error updating restaurant name:", error);
      }
    }
  };

  const handleNavigateToAddEditMenu = (menuId) => {
    navigation.navigate('AddEditMenu', { restaurantId, menuId });
  };

  if (!restaurant) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Restaurant Name Editing Section */}
      {editingRestaurantName ? (
        <>
          <TextInput
            style={styles.input}
            value={restaurantName}
            onChangeText={setRestaurantName}
            placeholder="Enter Cafe Name"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSaveRestaurantName} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingRestaurantName(false)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.row}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <TouchableOpacity onPress={() => setEditingRestaurantName(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit Cafe Name</Text>
          </TouchableOpacity>
        </View>
      )}
  
      <View style={styles.separator} />
  
      <FlatList
        data={restaurant?.menus}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {editingMenuId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={menuName}
                  onChangeText={setMenuName}
                  placeholder="Enter Menu Name"
                />
                <TextInput
                  style={styles.input}
                  value={welcomeText}
                  onChangeText={setWelcomeText}
                  placeholder="Enter Welcome Text"
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => handleEditMenu(item.id)} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cancelEditing} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.row}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.welcomeText}>{item.welcome_text || "Welcome to our restaurant. Enjoy the best dishes!"}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => startEditingMenu(item.id, item.name, item.welcome_text)} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit Name</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleNavigateToAddEditMenu(item.id)} style={styles.navigateButton}>
                    <Text style={styles.buttonText}>Go to Add/Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
  
      {/* Add New Menu Button at the Bottom */}
      <TouchableOpacity onPress={handleAddMenu} style={styles.addButton}>
        <Text style={styles.buttonText}>Add New Menu</Text>
      </TouchableOpacity>
  
      {/* Adding New Menu Form */}
      {isAddingMenu && (
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.input}
            value={menuName}
            onChangeText={setMenuName}
            placeholder="Enter Menu Name"
          />
          <TextInput
            style={styles.input}
            value={welcomeText}
            onChangeText={setWelcomeText}
            placeholder="Enter Welcome Text"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleCreateMenu} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelAddingMenu} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light background color for better contrast
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20, // Add spacing above the button
    marginBottom: 20, // Additional space at the bottom
  },
  editButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  navigateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});
