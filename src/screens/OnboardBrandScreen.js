import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { MenuContext } from '../context/MenuContext'; // Import MenuContext

export default function OnboardBrandScreen({ navigation }) {
  const [brandName, setBrandName] = useState('');
  const [metadata, setMetadata] = useState('');
  const { API_URL } = useContext(MenuContext); // Get API_URL from context

  const handleOnboardBrand = async () => {
    if (brandName.trim()) {
      try {
        const response = await axios.post(`${API_URL}/brands/onBoardBrand`, {
          brand_name: brandName,
          metadata: metadata.trim() ? JSON.parse(metadata) : {}, // Parse metadata or pass an empty object if empty
        });
        console.log('Brand onboarded:', response.data);
        navigation.navigate('AddAdScreen', { brandId: response.data._id });
      } catch (error) {
        console.error('Error onboarding brand:', error);
      }
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Onboard a New Brand</Text>
      <TextInput
        style={styles.input}
        placeholder="Brand Name"
        value={brandName}
        onChangeText={setBrandName}
      />
      <TextInput
        style={styles.input}
        placeholder="Metadata (optional)"
        value={metadata}
        onChangeText={setMetadata}
      />
      <Button title="Onboard Brand" onPress={handleOnboardBrand} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    borderColor: '#ddd',
  },
});
