import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, Surface, IconButton } from 'react-native-paper';
import { Bell, Calendar, MessageCircle, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type NotificationType = 'appointment' | 'message' | 'alert' | 'success';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Consulta em 1 hora',
    description: 'Sua consulta com a Dra. Andréa Soares começa logo mais. Prepare um ambiente tranquilo.',
    time: '55m atrás',
    read: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'Nova mensagem',
    description: 'Dr. Carlos Alberto enviou orientações sobre a próxima sessão.',
    time: '2h atrás',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Pagamento Confirmado',
    description: 'O pagamento da sessão de amanhã foi processado com sucesso.',
    time: 'Subida às 10:00',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Complete seu Perfil',
    description: 'Adicione mais informações para que os terapeutas conheçam você melhor.',
    time: '1 dia atrás',
    read: true,
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment': return <Calendar size={20} color={theme.primary} />;
      case 'message': return <MessageCircle size={20} color="#0EA5E9" />;
      case 'alert': return <AlertCircle size={20} color="#F59E0B" />;
      case 'success': return <CheckCircle2 size={20} color="#10B981" />;
      default: return <Bell size={20} color={theme.primary} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <IconButton icon="dots-vertical" size={24} onPress={() => {}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recentes</Text>
          <TouchableOpacity>
            <Text style={[styles.markRead, { color: theme.primary }]}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        </View>

        {NOTIFICATIONS.map((notif) => (
          <Surface 
            key={notif.id} 
            style={[
              styles.notifCard, 
              !notif.read && styles.unreadCard
            ]} 
            elevation={notif.read ? 0 : 1}
          >
            <View style={styles.notifRow}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}10` }]}>
                {getIcon(notif.type)}
              </View>
              <View style={styles.notifContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, !notif.read && styles.boldText]}>{notif.title}</Text>
                  {!notif.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
                </View>
                <Text style={styles.notifDescription} numberOfLines={2}>{notif.description}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
            </View>
          </Surface>
        ))}

        <View style={styles.emptyFooter}>
          <Text style={styles.footerText}>Não há mais notificações por aqui.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFF',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scrollContent: { padding: 20 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748B' },
  markRead: { fontSize: 14, fontWeight: '600' },
  notifCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  unreadCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16
  },
  notifContent: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 15, color: '#1E293B' },
  boldText: { fontWeight: 'bold' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifDescription: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 8 },
  notifTime: { fontSize: 12, color: '#94A3B8' },
  emptyFooter: { alignItems: 'center', marginTop: 30, marginBottom: 50 },
  footerText: { color: '#94A3B8', fontSize: 14 },
});
