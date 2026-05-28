import { Redirect } from 'expo-router';
import { useUserStore } from '../store/userStore';

export default function Index() {
  const isLogged = useUserStore((state) => state.isLogged);

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}