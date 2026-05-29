import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

// Componente separado para a lógica de proteção de rotas
function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const isLogged = useUserStore((state) => state.isLogged);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLogged && !inAuthGroup) {
      // Não logado mas tentando acessar área protegida → redireciona para login
      router.replace('/(auth)/login');
    } else if (isLogged && inAuthGroup) {
      // Já logado mas ainda nas telas de auth → redireciona para home
      router.replace('/(tabs)');
    }
  }, [isLogged, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <RouteGuard />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="therapist/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="therapist/book" options={{ headerShown: false }} />
        <Stack.Screen name="therapist/review" options={{ headerShown: false }} />
        <Stack.Screen name="call/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}