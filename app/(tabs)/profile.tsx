import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Text, Avatar, Card, Divider } from 'react-native-paper';
import {
  UserCircle,
  ShieldCheck,
  Database,
  BrainCircuit,
  Headset,
  MessageSquare,
  LogOut,
  Settings
} from 'lucide-react-native';

type MenuItemProps = {
  icon: any;
  label: string;
};

const theme = {
  colors: {
    background: '#F5F7FB',
    card: '#FFFFFF',
    text: '#1F2937',
    subtext: '#6B7280',
    primary: '#2563EB',
    border: '#E5E7EB'
  }
};

export default function ProfileScreen() {
  const user = {
    name: 'Paulo Silva',
    info: 'Paciente | 29 anos',
    stats: {
      humor: '25 dias',
      atividades: '15 concl.'
    }
  };

  const MenuItem = ({ icon: Icon, label }: MenuItemProps) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Icon size={20} color={theme.colors.text} />
        <Text style={styles.menuText}>{label}</Text>
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
          <Avatar.Image
            size={70}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }}
          />

          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.info}>{user.info}</Text>

            <Text style={styles.stats}>
              Humor: {user.stats.humor}
            </Text>
            <Text style={styles.stats}>
              Atividades: {user.stats.atividades}
            </Text>
          </View>

          <TouchableOpacity style={styles.settings}>
            <Settings size={20} color={theme.colors.text} />
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
      <TouchableOpacity style={styles.logout}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 20,
    paddingTop: 10
  },

  header: {
    marginBottom: 10
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937'
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  userInfo: {
    flex: 1,
    marginLeft: 12
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937'
  },

  info: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6
  },

  stats: {
    fontSize: 12,
    color: '#6B7280'
  },

  settings: {
    position: 'absolute',
    top: 0,
    right: 0
  },

  section: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 10
  },

  menuItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },

  menuText: {
    fontSize: 14,
    color: '#1F2937'
  },

  arrow: {
    fontSize: 16,
    color: '#6B7280'
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10
  },

  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold'
  }
});