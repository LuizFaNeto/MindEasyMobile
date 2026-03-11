import { Tabs } from 'expo-router';
import { Calendar, Home, User } from 'lucide-react-native';

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
          tabBarIcon: ({ color }) => <Home stroke={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color }) => <Calendar stroke={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <User stroke={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
