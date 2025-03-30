import { useRoute } from "@react-navigation/native";
import { View, Text, Alert, StyleSheet, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.2:8000"


export default function AuthScreen() {
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                "username": username,
                "password": password
            }, {
                timeout: 5000
            });

            if (response.data && response.data.access_token) {
                AsyncStorage.setItem("token", response.data.access_token).then(() => router.replace("/(tabs)"));
            } else {
                Alert.alert("Login Failed", "Invalid username or password.");
            }
        } catch (error) {
            console.error("Login error: ", error);
            Alert.alert("Login Error", "There was an error logging in. Please try again.");
          }      
        };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
  
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
  
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
  
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }
  
const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0},
    title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
    input: {width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5},
})