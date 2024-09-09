import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function SmoothTransition({ children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true, // Ensures the animation runs on the native thread
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
      {children}
    </Animated.View>
  );
}
