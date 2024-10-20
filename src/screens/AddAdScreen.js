import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MenuContext } from '../context/MenuContext';

export default function AddAdScreen({ route, navigation }) {
  const { API_URL } = useContext(MenuContext); // Get API_URL from context
  const { brandId } = route.params || {};  // Fallback if route.params is undefined
  const [adName, setAdName] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [ttl, setTtl] = useState(''); // TTL field
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(brandId); // Use the passed brandId if present
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering brands

  // Fetch list of all brands when there is no brandId provided
  useEffect(() => {
    if (!brandId) {
      const fetchBrands = async () => {
        try {
          const response = await axios.get(`${API_URL}/brands/getAllBrands`);
          setBrands(response.data);
        } catch (error) {
          console.error('Error fetching brands:', error);
        }
      };
      fetchBrands();
    }
  }, [brandId]);

  // Handle adding the ad
  const handleAddAd = async () => {
    const currentBrandId = selectedBrandId || brandId;  // Prioritize selectedBrandId or brandId
    if (adName.trim() && bidPrice.trim() && adImageUrl.trim() && currentBrandId) {
      try {
        const response = await axios.post(`${API_URL}/brands/${currentBrandId}/ads`, {
          ad_name: adName,
          bid_price: parseFloat(bidPrice),
          ad_image_url: adImageUrl,
          ttl: parseInt(ttl), // Add TTL value
        });
        console.log('Ad added:', response.data);
      } catch (error) {
        console.error('Error adding ad:', error);
      }
    } else {
      console.error('Please fill all fields or select a brand');
    }
  };

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand => 
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {brandId ? (
        <>
          {/* Adding an ad for a specific brand */}
          <Text style={styles.title}>Add a New Ad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ad Name"
            value={adName}
            onChangeText={setAdName}
          />
          <TextInput
            style={styles.input}
            placeholder="Bid Price"
            value={bidPrice}
            onChangeText={setBidPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Ad Image URL"
            value={adImageUrl}
            onChangeText={setAdImageUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry (in seconds)"
            value={ttl}
            onChangeText={setTtl}
            keyboardType="numeric"
          />
          <Button title="Add Ad" onPress={handleAddAd} />
        </>
      ) : (
        <>
          {/* If no brandId is passed, show list of brands and search */}
          <Text style={styles.title}>Select a Brand to Add Ad</Text>
          <TextInput
            style={styles.input}
            placeholder="Search Brands"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredBrands}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.brandItem}
                onPress={() => setSelectedBrandId(item._id)}
              >
                <Text>{item.brand_name}</Text>
              </TouchableOpacity>
            )}
          />
          {selectedBrandId && (
            <>
              <Text style={styles.title}>Add a New Ad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ad Name"
                value={adName}
                onChangeText={setAdName}
              />
              <TextInput
                style={styles.input}
                placeholder="Bid Price"
                value={bidPrice}
                onChangeText={setBidPrice}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Ad Image URL"
                value={adImageUrl}
                onChangeText={setAdImageUrl}
              />
              <TextInput
                style={styles.input}
                placeholder="Expiry (in seconds)"
                value={ttl}
                onChangeText={setTtl}
                keyboardType="numeric"
              />
              <Button title="Add Ad" onPress={handleAddAd} />
            </>
          )}
        </>
      )}
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
  brandItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
});

