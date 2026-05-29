import { Redirect } from 'expo-router';

export default function Index() {
  // Por enquanto, vamos forçar o app a sempre abrir no Login
  // Futuramente, aqui você verificará no Zustand se o usuário já está logado
  return <Redirect href="/(auth)/register" />;
}