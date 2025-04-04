import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRoute, useNavigation, useNavigationState } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';


const API_BASE_URL = process.env.EXPO_PUBLIC_NEWS_API_URL;


interface NewsItem {
  id?: number;
  title: string;
  publishedAt: string;
  content: string;
  description: string;
  author: string;
  url: string;
  urlToImage: string;
}


export default function NewsDetailsScreen() {
  const route = useRoute();
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const index = useNavigationState(state => state.index);
  

  // Function to fetch news
  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/news/${id}`, { timeout: 5000 });
      const item = response.data;

      const formattedNews = {
        id: item.source?.id ?? item.id,
        author: item.author,
        title: item.title,
        description: item.description,
        url: item.url,
        urlToImage: item.urlToImage,
        publishedAt: item.publishedAt,
        content: item.content,
      };
      await Image.prefetch(news?.urlToImage || '');
      
      setNews(formattedNews);
    } catch (error) {
      console.error(error);
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArticle();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("news")} style={styles.backButton}>
        <Icon name="chevron-back-outline" size={30} color="#041D56" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? (
          <ActivityIndicator size="large" color="#7f8e9e" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : news ? (
          <View>
            <Text style={styles.newsTitle}>{news.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              { news.author && <Text style={styles.newsAuthor}>{news.author}</Text> }
              { news.publishedAt && <Text style={styles.newsTime}>
                {new Date(news.publishedAt).toLocaleString()}</Text> }
            </View>
            { news.description && <Text style={styles.newsDescription}>{news.description}</Text> }
            { news.urlToImage && (
              <View>
                <Image
                  source={{ uri: news.urlToImage }}
                  style={styles.newsImage}
                  cachePolicy="memory-disk"
                />
              </View>
              )}
            { news.content && <Text style={styles.newsContent}>{news.content}</Text> }
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    backgroundColor: '#49657b',
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
  newsTitle: { fontSize: 24, fontWeight: "bold", color: "black" },
  newsAuthor: { fontSize: 14, color: "black", marginTop: 10, fontWeight: "bold" },
  newsContent: { fontSize: 18, color: "black", marginTop: 10 },
  newsDescription: { fontSize: 12, color: "#aaa", marginTop: 10 },
  newsTime: { fontSize: 12, color: "black", marginTop: 10, fontWeight: "800" },
  errorText: { color: "red", fontSize: 18, textAlign: "center", marginTop: 20 },
  newsImage: { width: 370, height: 200, marginTop: 10, borderColor: "black", borderWidth: 1 },
});
