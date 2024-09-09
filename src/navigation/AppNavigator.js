import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RestaurantSelectionScreen from '../screens/RestaurantSelectionScreen';
import MenuManagementScreen from '../screens/MenuManagementScreen';
import AddEditMenuScreen from '../screens/AddEditMenuScreen';
import SplitScreen from '../screens/SplitScreen'; // If you're using SplitScreen for menu editing

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RestaurantSelection">
        {/* Restaurant Selection Screen */}
        <Stack.Screen 
          name="RestaurantSelection" 
          component={RestaurantSelectionScreen} 
          options={{ title: 'Select Restaurant/Cafe' }} 
        />
        {/* Menu Management Screen */}
        <Stack.Screen 
          name="MenuManagement" 
          component={MenuManagementScreen} 
          options={{ title: 'Manage Menus' }} 
        />
        {/* Add/Edit Menu Screen */}
        <Stack.Screen 
          name="AddEditMenu" 
          component={AddEditMenuScreen} 
          options={{ title: 'Add/Edit Menu' }} 
        />
        {/* Split Screen for Category and Dish Management */}
        <Stack.Screen 
          name="SplitScreen" 
          component={SplitScreen} 
          options={{ title: 'Category and Dish Management' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
