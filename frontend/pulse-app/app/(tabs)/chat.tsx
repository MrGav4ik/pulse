import { View, ScrollView, Text, StyleSheet } from "react-native"
import { useEffect, useState } from "react";


export default function ChatScreen() {
    const [messages, setMessages] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<string | null>(null);

    useEffect(() => {
        setMessages("newMessage");
    }, [newMessage])

    return (
        <ScrollView style={styles.container}>
            <Text style= {styles.message}>{messages}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0, },
    message: { color: "black", fontSize: 20, padding: 5,  backgroundColor: "white", borderRadius: 10 },
});