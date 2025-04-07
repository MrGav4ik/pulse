import { View, Text, ScrollView, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { Float } from "react-native/Libraries/Types/CodegenTypes";


const API_BASE_URL = process.env.EXPO_PUBLIC_AUTH_API_URL;


interface User {
  id: number;
  username: string;
  name: string,
  email: string;
  token_exp: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile: ", error);
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/login"); // Navigate to auth screen
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  // Get profile when the component mounts
  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7f8e9e" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <ScrollView>
        {user ? (
          <View style={styles.userData}>
            <Text style={styles.text}>ID: {user.id}</Text>
            <Text style={styles.text}>Name: {user.name}</Text>
            <Text style={styles.text}>Username: {user.username}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
          </View>
        ) : (
          <Text style={styles.text}>No user data available.</Text>
        )}
        <Button title="Logout" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0},
  userData: {flex: 1, justifyContent: "center", alignItems: "center"},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#49657b",
    paddingTop: 50,
    paddingBottom: 0,
  },
});
