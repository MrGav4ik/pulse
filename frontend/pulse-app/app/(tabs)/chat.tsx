import { View, ScrollView, Text, StyleSheet } from "react-native"
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_API_URL;
const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;


interface User {
    id?: number;
    name: string;
    username: string;
    email: string;
}

interface Chat {
    chat_id?: number;
    user_name: string;
    message: string;
}

export default function ChatScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [chat, setChat] = useState<Chat[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const getProfile = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.log("No token found.");
            return;
          }
    
          const response = await axios.get(`${AUTH_BASE_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setUser(response.data);
          //console.debug("✅ Profile fetched successfully")
          setLoading(false);
        } catch (error) {
          console.error("Error fetching profile: ", error);
          setLoading(false);
        }
      };

    const fetchChats = async () => {
        try {
            if (user) {
                const { data } = await axios.get(`${CHAT_BASE_URL}/chat/chats?sender_id=${user.id}`, { timeout: 3000 });

                if (!Array.isArray(data)) {
                    throw new Error("Unexpected API response format.");
                }
                const formattedChat = data
                    .map((item, index) => ({
                        chat_id: item?.chat_id || `${item?.user_name}-${index}`,
                        user_name: item?.user_name || "Unknown",
                        message: item?.message || "No Message",
                    }))
                    .filter((item) => item.chat_id);

                        setChat(formattedChat);
                        //console.debug("✅ Chat fetched successfully")
                }
        } catch (error) {
            console.error("Error fetching chat:", error);
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        fetchChats();
    }, [user]);

    return (
        <ScrollView style={styles.container}>
            {chat &&
            <FlatList
                scrollEnabled={false}
                data={chat}
                keyExtractor={(item) => item.chat_id!.toString()}
                renderItem={({ item }) => (
                    <View style={styles.chat}>
                        <Text style={styles.name}>{item.user_name}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                    </View>
                )}
            >
            </FlatList>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0, },
    chat: {backgroundColor: "white", padding: 10, borderRadius: 10, marginBottom: 10,},
    message: { color: "black", fontSize: 20 },
    name: {color: "black", fontSize: 25 },
});