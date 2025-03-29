import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "deepskyblue",
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#49658b',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            opacity: 0.98,
        },
      }}
    >
      <Tabs.Screen name="index"
      options={{
        title: "Home",
        tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />
      }} />
      <Tabs.Screen name="chat"
      options={{
        lazy: true,
        title: "Chat",
        tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={28} color={color} />
      }} />
      <Tabs.Screen name="news"
      options={{
        lazy: true,
        title: "News",
        tabBarIcon: ({ color }) => <Ionicons name="newspaper-outline" size={28} color={color} />
      }} />
      <Tabs.Screen name="profile"
      options={{
        lazy: true,
        title: "Profile",
        tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />
      }} />
      <Tabs.Screen name="details"
      options={{
        lazy: true,
        tabBarItemStyle: { display: "none" },
      }} />
    </Tabs>
  );
}
