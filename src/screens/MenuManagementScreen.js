import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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
    setIsModalVisible(true);
  };

  const handleCreateMenu = async () => {
    if (menuName.trim()) {
      try {
        const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menus`, { name: menuName.trim() });
        const newMenuId = response.data.menu_id;
        setIsModalVisible(false);
        setMenuName('');
        const restaurantResponse = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
        setRestaurant(restaurantResponse.data);
        navigation.navigate('AddEditMenu', { restaurantId, menuId: newMenuId });
      } catch (error) {
        console.error("Error creating menu:", error);
      }
    } else {
      setIsModalVisible(false);
      setMenuName('');
    }
  };

  const handleEditMenu = async (menuId) => {
    if (menuName.trim()) {
      try {
        const response = await axios.put(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}`, {
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

      {/* Add some margin between the cafe name and the menu list */}
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
                  <TouchableOpacity onPress={() => setEditingMenuId(null)} style={styles.cancelButton}>
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
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 24,  // Space between the cafe name and the menu list
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
  navigateButton: {
    marginLeft: 8,
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cancelButton: {
    marginLeft: 8,
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
});
