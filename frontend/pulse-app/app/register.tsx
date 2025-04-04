import { TextInput } from "react-native-gesture-handler";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@env";


export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [verifyPassword, setVerifyPassword] = useState<string | null>(null);

    const handleRegister = async () => {
        try {
            const response = await axios
                .post(`API_BASE_URL/auth/register`, {
                    "username": username,
                    "name": name,
                    "email": email,
                    "password": password,
                }, {
                    timeout: 5000
                });
            } catch (error) {
                console.error("Registration error: ", error);
            }
        };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput placeholder="Username" style={styles.input} />
            <TextInput placeholder="Name" style={styles.input} />
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Password" style={styles.input} />
            <TextInput placeholder="Verify Password" style={styles.input} />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0},
    title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
    input: {width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5},

})