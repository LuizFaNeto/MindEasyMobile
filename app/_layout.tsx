import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="therapist/[id]" />
        <Stack.Screen name="therapist/book" />
        <Stack.Screen name="therapist/review" />
        <Stack.Screen name="call/[id]" />
        <Stack.Screen name="notifications" />
      </Stack>
    </PaperProvider>
  );
}