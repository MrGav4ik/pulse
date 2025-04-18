import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { jwtDecode } from 'jwt-decode';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
      if (token) {
        const decoded_token = jwtDecode(token)
        const exp = decoded_token.exp
        const now = Math.floor(Date.now() / 1000)

        if (exp && now > exp) {
          await AsyncStorage.removeItem("token")
          return null;
        }
      }

    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [segments]);


  useEffect(() => {
    if (isAuthenticated === null) return;

    const currentSegment = segments[0];

    if (isAuthenticated && currentSegment !== "(tabs)") {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && currentSegment !== "login") {
      router.replace("/login");
    }
  }, [isAuthenticated]);


  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: "slide_from_left" }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
