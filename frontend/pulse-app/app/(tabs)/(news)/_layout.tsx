import { Stack } from "expo-router";


export default function NewsLayout() {
    return (
        <Stack>
            <Stack.Screen name="news" options={{ headerShown: false }} />
            <Stack.Screen name="news_details" options={{ headerShown: false }} />
        </Stack>
    )
}