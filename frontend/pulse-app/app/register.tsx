import { View, Text, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';


const API_BASE_URL = process.env.EXPO_PUBLIC_AUTH_API_URL;


export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [verifyPassword, setVerifyPassword] = useState<string | null>(null);

    const handleRegister = async () => {
        try {
            if (password !== verifyPassword) {
                Alert.alert("Passwords do not match", "Please enter the same password in both fields.");
                return;
            }
            else {
                const response = await axios
                .post(`${API_BASE_URL}/auth/register`, {
                    "username": username,
                    "name": name,
                    "email": email,
                    "password": password,
                }, {
                    timeout: 5000
                });
                Alert.alert("Registration Successful", "You have successfully registered.")
                router.push("/login");
            }
            } catch (error) {
                console.error("Registration error: ", error);
                Alert.alert("Registration Error", "There was an error registering. Please try again.");
            }
        };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="chevron-back-outline" size={30} color="#041D56" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Register</Text>
                <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} required />
                <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} required />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} required />
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry required />
                <TextInput placeholder="Verify Password" value={verifyPassword} onChangeText={setVerifyPassword} secureTextEntry style={styles.input} required />
                <Button title="Register" onPress={handleRegister} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0},
    title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
    input: {width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5},
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: -10,
        borderRadius: 10,
        marginBottom: 10,
        width: 80,
      },
      backText: {
        fontSize: 18,
        marginLeft: -5,
        color: '#041D56',
      },

})