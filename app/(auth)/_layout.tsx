import { Tabs } from 'expo-router';
import { Home, Calendar, User } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#6200ee', // Cor do ícone selecionado (estilo RN Paper)
      headerShown: false               // Mostra o título da página no topo
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
