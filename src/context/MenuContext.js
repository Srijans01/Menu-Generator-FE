import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const API_URL = "http://0.0.0.0:8000";

  // Fetch all restaurants/cafes
  const fetchRestaurants = async () => {
    try {
      console.log("API URL IS" , API_URL)
      setLoading(true);  // Set loading to true before fetching
      const response = await axios.get(`${API_URL}/restaurants`);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);  // Set loading to false after fetching
    }
  };

  // Fetch a specific restaurant by ID
  const fetchRestaurant = async (restaurantId) => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
      return response.data; // Return the fetched restaurant data
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Add a restaurant and persist it
  const addRestaurant = async (restaurant) => {
    try {
      const response = await axios.post(`${API_URL}/restaurants`, restaurant);
      const newRestaurant = response.data;
      setRestaurants([...restaurants, newRestaurant]);
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  };

  // Update restaurant details and persist
  const updateRestaurant = async (restaurantId, updatedInfo) => {
    try {
      await axios.put(`${API_URL}/restaurants/${restaurantId}`, updatedInfo);
      fetchRestaurants(); // Sync with backend
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  // Add a menu and persist it
  const addMenu = async (restaurantId, menuName) => {
    console.log("Adding menu for restaurantId:", restaurantId, "with menuName:", menuName);
    const newMenu = {
      id: Date.now().toString(), // Temporary unique ID
      name: menuName,
      categories: [],
    };
    setRestaurants(restaurants.map(rest =>
      rest.id === restaurantId
        ? { ...rest, menus: [...rest.menus, newMenu] }
        : rest
    ));
  
    try {
      const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menus`, { name: menuName });
      fetchRestaurants(); // Sync with backend
      console.log("Menu created successfully:", response.data.id);
      return response.data.id;
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };
  
  

  // Update a menu and persist it
  const updateMenu = async (restaurantId, menuId, updatedMenu) => {
    try {
      await axios.put(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}`, updatedMenu);
      fetchRestaurants(); // Sync with backend
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  };

  // Remove a menu and persist it
  const removeMenu = async (restaurantId, menuId) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}`);
      fetchRestaurants(); // Sync with backend
    } catch (error) {
      console.error("Error removing menu:", error);
    }
  };

  // Add a category to a menu and persist it
const addCategory = async (restaurantId, menuId, category) => {
  try {
    const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/categories`, category);
    const newCategory = { ...category, ...response.data };  // Ensure newCategory has the correct name

    // Update state directly
    setRestaurants(prevRestaurants => 
      prevRestaurants.map(rest =>
        rest._id === restaurantId
          ? {
              ...rest,
              menus: rest.menus.map(menu =>
                menu.id === menuId
                  ? { ...menu, categories: [...menu.categories, newCategory] } // Append the new category
                  : menu
              ),
            }
          : rest
      )
    );
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

  

  // Update a category and persist it
  const updateCategory = async (restaurantId, menuId, categoryIndex, updatedCategory) => {
    try {
      const response = await axios.put(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/categories/${categoryIndex}`, updatedCategory);
  
      // Update state directly
      setRestaurants(prevRestaurants =>
        prevRestaurants.map(rest =>
          rest._id === restaurantId
            ? {
                ...rest,
                menus: rest.menus.map(menu =>
                  menu.id === menuId
                    ? {
                        ...menu,
                        categories: menu.categories.map((category, index) =>
                          index === categoryIndex
                            ? { ...category, name: updatedCategory.name } // Update the category name
                            : category
                        ),
                      }
                    : menu
                ),
              }
            : rest
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  
  

  // Remove a category and persist it
  const removeCategory = async (restaurantId, menuId, categoryIndex) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/categories/${categoryIndex}`);
      
      // Update the state directly
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(rest =>
          rest._id === restaurantId
            ? {
                ...rest,
                menus: rest.menus.map(menu =>
                  menu.id === menuId
                    ? {
                        ...menu,
                        categories: menu.categories.filter((_, index) => index !== categoryIndex) // Remove the category
                      }
                    : menu
                ),
              }
            : rest
        )
      );
    } catch (error) {
      console.error("Error removing category:", error);
    }
  };
  

  // Add a dish to a category and persist it
  const addDish = async (restaurantId, menuId, categoryName, dish) => {
    try {
      const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/categories/${categoryName}/dishes`, dish);
      const newDish = response.data;
  
      // Now update the state with the new dish added to the correct category
      setRestaurants((prevRestaurants) => {
        return prevRestaurants.map((restaurant) => {
          if (restaurant._id === restaurantId) {
            return {
              ...restaurant,
              menus: restaurant.menus.map((menu) => {
                if (menu.id === menuId) {
                  return {
                    ...menu,
                    categories: menu.categories.map((category) => {
                      if (category.name === categoryName) {
                        return {
                          ...category,
                          dishes: [...category.dishes, newDish], // Append the new dish
                        };
                      }
                      return category;
                    }),
                  };
                }
                return menu;
              }),
            };
          }
          return restaurant;
        });
      });
      
      return newDish;
    } catch (error) {
      console.error("Error adding dish:", error);
      throw error;
    }
  };
  
  

  // Update a dish and persist it
  const updateDish = async (restaurantId, menuId, categoryName, dishIndex, updatedDish) => {
    try {
      await axios.put(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/categories/${categoryName}/dishes/${dishIndex}`, updatedDish);
      
      // Update the frontend state
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(rest =>
          rest._id === restaurantId
            ? {
                ...rest,
                menus: rest.menus.map(menu =>
                  menu.id === menuId
                    ? {
                        ...menu,
                        categories: menu.categories.map(cat =>
                          cat.name === categoryName
                            ? {
                                ...cat,
                                dishes: cat.dishes.map((dish, index) =>
                                  index === dishIndex
                                    ? updatedDish // Update the dish
                                    : dish
                                )
                              }
                            : cat
                        )
                      }
                    : menu
                ),
              }
            : rest
        )
      );
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  };
  

  // Remove a dish and persist it
  const removeDish = async (restaurantId, menuId, categoryName, dishIndex) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${restaurantId}/menus/${menuId}/categories/${categoryName}/dishes/${dishIndex}`);
      
      // Sync the UI by updating the state
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(rest =>
          rest._id === restaurantId
            ? {
                ...rest,
                menus: rest.menus.map(menu =>
                  menu.id === menuId
                    ? {
                        ...menu,
                        categories: menu.categories.map(cat =>
                          cat.name === categoryName
                            ? {
                                ...cat,
                                dishes: cat.dishes.filter((_, index) => index !== dishIndex) // Remove the dish
                              }
                            : cat
                        )
                      }
                    : menu
                ),
              }
            : rest
        )
      );
    } catch (error) {
      console.error("Error removing dish:", error);
    }
  };
  

  return (
    <MenuContext.Provider value={{
      restaurants,
      fetchRestaurant,
      addRestaurant,
      updateRestaurant,
      addMenu,
      updateMenu,
      removeMenu,
      addCategory,
      updateCategory,
      removeCategory,
      addDish,
      updateDish,
      removeDish,
      API_URL,
      selectedRestaurantId,
      setSelectedRestaurantId,
      loading
    }}>
      {children}
    </MenuContext.Provider>
  );
};
