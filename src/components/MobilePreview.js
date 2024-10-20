import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { MenuContext } from '../context/MenuContext';

const PAGE_DISH_LIMIT = 5; // Limit the number of dishes per page

export default function MobilePreview({ restaurantId, menuId }) {
  const { restaurants, loading, API_URL } = useContext(MenuContext);
  // const [restaurant, setRestaurant] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  const restaurant = restaurants.find(rest => rest._id === restaurantId);

  // Fetch the latest restaurant data from the API
  const fetchRestaurantData = async () => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  // Generate QR code by calling the backend
  const generateQRCode = async () => {
    setQrLoading(true); // Start loading
    try {
      const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/generate_qr`);
      setQrCodeUrl(response.data.qr_code_url);
      setPdfUrl(response.data.pdf_url); // Store the PDF URL for reference if needed
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setQrLoading(false); // Stop loading
    }
  };

  // Fetch restaurant data when the component mounts
  useEffect(() => {
    fetchRestaurantData();  // Fetch restaurant data on component mount
  }, [restaurantId]);  // Re-fetch when restaurantId changes

  if (loading || !restaurant) {
    return <Text>Loading...</Text>;  // Show loading message while fetching data
  }

  const menu = restaurant.menus.find((m) => m.id === menuId);

  if (!menu) {
    return <Text style={styles.errorText}>Menu not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Render Restaurant/Cafe Info on the First Page */}
        <View style={styles.restaurantContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>  {/* Updated to use fetched restaurant data */}
          <Text style={styles.restaurantLocation}>{restaurant.location || "Location not available"}</Text>
          <Text style={styles.menuName}>{menu.name} Menu</Text>
        </View>

        {menu.categories.map((category, categoryIndex) => {
          return (
            <View key={categoryIndex} style={styles.page}>
              <Text style={styles.categoryTitle}>{category.name}</Text>

              {category.dishes.map((dish, dishIndex) => {
                return (
                  <View key={dishIndex} style={styles.dishContainer}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>₹{dish.price?.toString()}</Text>
                  </View>
                );
              })}
              <View style={styles.pageBreak} />
            </View>
          );
        })}

        {/* Button to generate QR Code */}
        <View style={styles.qrContainer}>
          <Button title="Generate QR Code" onPress={generateQRCode} />
          {qrLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Generating...</Text>
            </View>
          ) : qrCodeUrl ? (
            <>
              <Text style={styles.qrText}>Scan to View the PDF:</Text>
              <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} />

              {/* Link to open the PDF */}
              {pdfUrl && (
                <Text
                  style={styles.pdfLink}
                  onPress={() => Linking.openURL(pdfUrl)}
                >
                  View PDF of the Menu
                </Text>
              )}
            </>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },  
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  restaurantContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantLocation: {
    fontSize: 18,
    marginBottom: 4,
  },
  menuName: {
    fontSize: 16,
    color: '#888',
  },
  page: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    textAlign: 'center',
  },
  dishContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
  },
  pageBreak: {
    marginTop: 32,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    marginLeft: 8,
  },
  qrText: {
    fontSize: 16,
    marginTop: 16,
  },
  qrImage: {
    width: 150,
    height: 150,
    marginTop: 16,
  },
  pdfLink: {
    marginTop: 16,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
