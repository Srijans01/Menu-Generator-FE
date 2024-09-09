import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Menu Creation App</Text>
      <Button title="Add Category" onPress={() => navigation.navigate('AddCategory')} />
    </View>
  );
}
