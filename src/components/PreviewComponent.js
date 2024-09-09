import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MenuContext } from '../context/MenuContext';

export default function PreviewComponent() {
  const { categories } = useContext(MenuContext);

  return (
    <View style={styles.previewContainer}>
      <Text style={styles.previewTitle}>Mobile Preview</Text>
      <ScrollView style={styles.scrollView}>
        {categories.length === 0 ? (
          <Text style={styles.placeholder}>No categories added yet.</Text>
        ) : (
          categories.map((category) => (
            <View key={category.name} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {category?.dishes?.map((dish, index) => (
                <Text key={index} style={styles.dishItem}>
                  {dish.name} - ${dish.price}
                </Text>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dishItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});
