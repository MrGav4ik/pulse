import { StyleSheet, Text, View, FlatList, ActivityIndicator} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Link, NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { GestureHandlerRootView, NativeViewGestureHandler, RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SearchBar } from '@rneui/themed';
import { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Image } from 'expo-image';
import { useNavigation } from "@react-navigation/native";



type SearchBarComponentProps = {};

// Define the structure of a News item
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

const BASE_API_URL = "http://172.20.10.2:8000/news";

export default function NewsScreen() {
  const navigation = useNavigation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string | null>(null);
  

  const fetchNews = useCallback(async (query = "default") => {
    setLoading(true);
    setError(null);

    try {
        const timestart = new Date().getTime();
        const { data } = await axios.get(`${BASE_API_URL}?query=${query}`, { timeout: 3000 });
        console.debug("Data fetched in: ", new Date().getTime() - timestart)

        if (!Array.isArray(data)) {
            throw new Error("Unexpected API response format.");
        }

        if ( data.length <= 5) {
          throw new Error("No data")
        }

        const formattedNews = data
            .map((item, index) => ({
                id: item?.id || `${item?.title}-${index}`,
                author: item?.author || "Unknown",
                title: item?.title || "No Title",
                description: item?.description || "No Description",
                url: item?.url || "#",
                urlToImage: item?.urlToImage,
                publishedAt: item?.publishedAt || "Unknown Date",
                content: item?.content || "No Content Available",
            }))
            .filter((item) => item.id);

              setNews(formattedNews);

            } catch (error) {
                console.error("Error fetching news:", error);
                if (error.message == "No data") {
                  setError("No data found. \n Please try again later.");
                } else {
                  setError("Failed to load news. \n Please try again later.");
                }
            } finally {
                setLoading(false);
            }
         }, []);
      
  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(search || "default");
    setRefreshing(false);
  }

  const handleSearch = () => {
    fetchNews(search || "default");
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {
          <SearchBar
            platform="ios"
            placeholder="Search"
            onChangeText={(text) => setSearch(text)}
            value={search}
            containerStyle={styles.newsShowSearchBar}
            searchIcon={{ name: "search", size: 20, color: "#aaa" }}
            clearIcon={{ name: "close", size: 20, color: "#aaa" }}
            onSubmitEditing={handleSearch}
            onClear={() => fetchNews("default")}
          />
          }
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#7f8e9e" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
          >
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={news.filter((item) => item.id)}
                keyExtractor={(item) => item.id!.toString()}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderItem={({ item }) => (
                  <Link key={item.id} screen="details" params={{ id: item.id, imageUrl: item.urlToImage }} style={styles.newsItem}>
                    <View>
                      {item.title && <Text style={styles.newsTitle}>{item.title}</Text>}
                      {item.urlToImage && <Image source={{ uri: item.urlToImage }} cachePolicy="memory-disk" style={styles.newsImage} />}
                      {item.description && <Text style={styles.newsText}>{item.description}</Text>}
                      {item.publishedAt && (
                        <Text style={styles.newsTime}>🕒 {new Date(item.publishedAt).toLocaleString()}</Text>
                      )}
                    </View>
                  </Link>
                )}
              />
            )}
          </ScrollView>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0, },
  newsItem: { marginBottom: 20, padding: 10, backgroundColor: "#4279a3", borderRadius: 20, zIndex: -2},
  newsTitle: { fontSize: 18, fontWeight: "bold", color: "black" },
  newsText: { fontSize: 12, color: "black"},
  newsTime: { fontSize: 14, color: "#ccc", marginTop: 5 },
  errorText: { color: "red", fontSize: 24, textAlign: "center", marginTop: 20, fontWeight: "bold", backgroundColor: "pink", borderRadius: 10, padding: 10 },
  newsImage: { width: 350, height: 200, borderRadius: 0, alignSelf: "center", marginTop: 10, marginBottom: 10 },
  successText: { color: "green", fontSize: 18, textAlign: "center", marginTop: 20 },
  newsHideSearchBar: { backgroundColor: "transparent", position: "absolute", top: 50, left: 10, right: 10, zIndex: 0},
  newsShowSearchBar: { backgroundColor: "transparent"},
});
