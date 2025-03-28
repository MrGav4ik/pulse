import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from "./index";
import ChatScreen from "./chat";
import NewsScreen from "./news";
import DetailsScreen from "./details";



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = "home-outline";
          else if (route.name === 'Chat') iconName = "chatbubble-outline";
          else if (route.name === 'News') iconName = "newspaper-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "white",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#49657b",
          opacity: 0.7,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Details" component={DetailsScreen} options={{
        tabBarItemStyle: {
          display: 'none',
        },
      }} />
    </Tab.Navigator>
  );
}




function RootNavigator() {
  return (
    <GestureHandlerRootView>
      <TabNavigator />
    </GestureHandlerRootView>
  )
}

export default RootNavigator;
