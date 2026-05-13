import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Card, Divider } from 'react-native-paper';
import {
  UserCircle, ShieldCheck, Database,
  BrainCircuit, Headset, MessageSquare, LogOut, Settings
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/userStore';

type MenuItemProps = {
  icon: any;
  label: string;
  onPress?: () => void;
  danger?: boolean;
};

const THEME = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  text: '#1F2937',
  subtext: '#6B7280',
  primary: '#2563EB',
  border: '#E5E7EB',
  danger: '#EF4444',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { name, email, logout } = useUserStore();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const getInitials = (nome: string) => {
    if (!nome) return 'U';
    return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  const MenuItem = ({ icon: Icon, label, onPress, danger }: MenuItemProps) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Icon size={20} color={danger ? THEME.danger : THEME.text} />
        <Text style={[styles.menuText, danger && { color: THEME.danger }]}>{label}</Text>
      </View>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      {/* USER CARD */}
      <Card style={styles.card}>
        <View style={styles.userRow}>
          <Avatar.Text
            size={70}
            label={getInitials(name)}
            style={{ backgroundColor: THEME.primary }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{name || 'Usuário'}</Text>
            <Text style={styles.info}>{email || 'Email não disponível'}</Text>
            <Text style={styles.role}>Paciente</Text>
          </View>
          <TouchableOpacity style={styles.settings}>
            <Settings size={20} color={THEME.text} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* CONTA */}
      <Text style={styles.section}>Sua conta</Text>
      <Card style={styles.card}>
        <MenuItem icon={UserCircle} label="Informações Pessoais" />
        <Divider />
        <MenuItem icon={ShieldCheck} label="Segurança" />
        <Divider />
        <MenuItem icon={Database} label="Dados" />
      </Card>

      {/* AJUDA */}
      <Text style={styles.section}>Ajuda</Text>
      <Card style={styles.card}>
        <MenuItem icon={BrainCircuit} label="Apoio" />
        <Divider />
        <MenuItem icon={Headset} label="Suporte" />
        <Divider />
        <MenuItem icon={MessageSquare} label="Enviar Feedback" />
      </Card>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <LogOut size={20} color={THEME.danger} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB', paddingHorizontal: 20, paddingTop: 10 },
  header: { marginBottom: 10, marginTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, marginBottom: 15, elevation: 2 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  info: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  role: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  settings: { position: 'absolute', top: 0, right: 0 },
  section: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginTop: 10 },
  menuItem: { paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuText: { fontSize: 14, color: '#1F2937' },
  arrow: { fontSize: 16, color: '#6B7280' },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, padding: 16, backgroundColor: '#FEF2F2', borderRadius: 12 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
});