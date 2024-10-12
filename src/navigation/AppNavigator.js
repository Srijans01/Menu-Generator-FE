import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RestaurantSelectionScreen from '../screens/RestaurantSelectionScreen';
import MenuManagementScreen from '../screens/MenuManagementScreen';
import AddEditMenuScreen from '../screens/AddEditMenuScreen';
import SplitScreen from '../screens/SplitScreen'; 
import OnboardBrandScreen from '../screens/OnboardBrandScreen';  // New screen
import AddAdScreen from '../screens/AddAdScreen';  // New screen

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
        {/* Onboard Brand Screen */}
        <Stack.Screen 
          name="OnboardBrand" 
          component={OnboardBrandScreen} 
          options={{ title: 'Onboard a Brand' }} 
        />
        {/* Add Ad Screen */}
        <Stack.Screen 
          name="AddAdScreen" // Make sure the name matches what you're using in the navigation
          component={AddAdScreen} 
          options={{ title: 'Add New Ad' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
