import React from 'react';
import { MenuProvider } from './src/context/MenuContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <MenuProvider>
      <AppNavigator />
    </MenuProvider>
  );
}
