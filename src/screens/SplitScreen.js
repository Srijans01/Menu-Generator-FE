import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AddCategoryScreen from './AddCategoryScreen';
import MobilePreview from '../components/MobilePreview';
import RestaurantForm from '../components/RestaurantForm'; 

export default function SplitScreen() {
  return (
    <View style={styles.container}>
      {/* Left pane: AddCategoryScreen and RestaurantForm */}
      <View style={styles.leftPanel}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <RestaurantForm />
          <AddCategoryScreen />
        </ScrollView>
      </View>

      {/* Right pane: MobilePreview */}
      <View style={styles.rightPanel}>
        <MobilePreview />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',  // Ensure side-by-side layout
  },
  leftPanel: {
    flex: 1,                // 50% width for left panel
    padding: 16,
    borderRightWidth: 1,
    borderColor: '#ddd',    // Vertical divider between panels
  },
  rightPanel: {
    flex: 1,                // 50% width for right panel
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,            // Ensures scrollable content grows vertically
  },
});
