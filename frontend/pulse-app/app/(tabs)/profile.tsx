import { View, Text, ScrollView, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "@env";

const API_BASE_URL = "http://172.20.10.5:8000";

interface User {
  id: number;
  username: string;
  email: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      console.debug(response);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {user ? (
        <>
          <Text style={styles.text}>Username: {user.username}</Text>
        </>
      ) : (
        <Text style={styles.text}>No user data available.</Text>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0},
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
