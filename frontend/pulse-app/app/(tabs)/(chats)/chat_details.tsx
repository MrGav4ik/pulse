import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Touchable, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/Ionicons';

const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  sent_at: string;
}

export default function ChatDetailsScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const route = useRoute();
  const router = useRouter();
  const { chat_id } = route.params as { chat_id: number }

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${CHAT_BASE_URL}/chat/messages?chat_id=${chat_id}`, {
        timeout: 3000,
      });

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format.');
      }

      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="chevron-back-outline" size={30} color="#041D56" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestamp}>{item.sent_at}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#49657b',
    paddingTop: 50,
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  messageText: {
    fontSize: 16,
    color: '#222',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
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
});
