import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        {/* O (tabs) é o grupo principal após o login */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* O (auth) não tem header próprio aqui pois as telas terão os seus */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* A tela de detalhes do terapeuta */}
        <Stack.Screen name="therapist/[id]" options={{ title: 'Perfil do Profissional' }} />
      </Stack>
    </PaperProvider>
  );
}