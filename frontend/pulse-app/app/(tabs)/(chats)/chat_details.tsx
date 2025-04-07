import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_API_URL;


interface Message {
  chat_id: number;
  message_sender_id: number;
  message_receiver_id: number;
  message_id: number;
  message_content: string;
  message_timestamp: string;
}

export default function ChatDetailsScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const route = useRoute();
  const { chat_id } = route.params as { chat_id: number };

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
      <FlatList
        data={messages}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item.message_content}</Text>
            <Text style={styles.timestamp}>{item.message_timestamp}</Text>
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
});
