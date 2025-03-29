import { Text, View } from "react-native";
import { Link } from "@react-navigation/native";
import { StyleSheet } from "react-native";



export default function Index() {
  return (
    <View style={styles.container}>
      <Link screen="news" style={styles.text}>Go to News</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#49657b"
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#3385c6"
  },
})


