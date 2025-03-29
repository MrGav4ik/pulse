import { View, Text, ScrollView } from "react-native";
import { StyleSheet } from "react-native";


export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text>Profile Screen</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#49657b", paddingTop: 50, paddingBottom: 0},
})