import { Stack } from "expo-router"

export default function ChatLayout() {
    return (
        <Stack>
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            <Stack.Screen name="chat_details" options={{ headerShown: false }} />
        </Stack>
    )
}