import { View, ScrollView, Text, StyleSheet } from "react-native"
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import axios from "axios";


const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_API_URL;
const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;



interface Chat {
    id?: number;
    name: string;
    message: string;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat[] | null>(null);

    const fetchChats = async () => {
        try {
            const { data } = await axios.get(`${CHAT_BASE_URL}/chat`, { timeout: 5000 });
            
            const formattedChat = data.map((item, index) => ({
                id: item?.id || `${item?.name}-${index}`,
                name: item?.name || "Unknown",
                message: item?.message || "No Message",
            }))
            .filter((item) => item.id);
    
            setChat(formattedChat);
        } catch (error) {
            console.error("Error fetching chat:", error);
        }
    }

    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <FlatList
                scrollEnabled={false}
                data={chat}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.chat}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                    </View>
                )}
            >
            </FlatList>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0, },
    chat: {backgroundColor: "white", padding: 10, borderRadius: 10, marginBottom: 10,},
    message: { color: "black", fontSize: 20 },
    name: {color: "black", fontSize: 25 },
});