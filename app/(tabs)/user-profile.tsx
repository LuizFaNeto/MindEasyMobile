import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Bell, ChevronRight, LogOut, Settings, ShieldCheck, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Divider, Text } from 'react-native-paper';

export default function UserProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const MenuOption = ({ icon: Icon, label, color = theme.text }: any) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Icon size={22} color={color === theme.text ? theme.primary : color} />
        <Text style={[styles.menuText, { color }]}>{label}</Text>
      </View>
      <ChevronRight size={20} color={theme.muted} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <Avatar.Image 
          size={90} 
          source={{ uri: 'https://ui-avatars.com/api/?name=Usuario+MindEasy&background=3B82F6&color=fff' }} 
        />
        <Text variant="headlineSmall" style={[styles.name, { color: theme.text }]}>Davi Assunção</Text>
        <Text variant="bodyMedium" style={{ color: theme.muted }}>davi@mindeasy.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>CONTA</Text>
        <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <MenuOption icon={User} label="Dados Pessoais" />
          <Divider style={styles.divider} />
          <MenuOption icon={ShieldCheck} label="Segurança" />
          <Divider style={styles.divider} />
          <MenuOption icon={Bell} label="Notificações" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.muted }]}>PREFERÊNCIAS</Text>
        <Card style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <MenuOption icon={Settings} label="Configurações do App" />
          <Divider style={styles.divider} />
          <MenuOption icon={LogOut} label="Sair da Conta" color="#EF4444" />
        </Card>
      </View>
    </ScrollView>
   );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  name: { marginTop: 15, fontWeight: 'bold' },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  card: { borderRadius: 15, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
  divider: { height: 1, opacity: 0.5 }
});
