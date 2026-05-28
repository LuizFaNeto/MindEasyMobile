import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { Bell, Calendar, MessageCircle, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useUserStore } from '@/store/userStore';
import { NotificacaoDTO, NotificationType, notificacaoService } from '@/services/notificacaoService';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const pacienteId = useUserStore((state) => state.id);

  const [notifications, setNotifications] = useState<NotificacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const carregarNotificacoes = useCallback(async () => {
    if (!pacienteId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setError('');
      const data = await notificacaoService.listarPorPaciente(pacienteId);
      setNotifications(data);
    } catch (err) {
      setError('Não foi possível carregar suas notificações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarNotificacoes();
  };

  const handleMarkAllAsRead = async () => {
    if (!pacienteId) return;

    await notificacaoService.marcarTodasComoLidas(pacienteId);
    setNotifications((prev) => prev.map((item) => ({ ...item, lida: true })));
  };

  const handleMarkAsRead = async (id: number) => {
    await notificacaoService.marcarComoLida(id);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, lida: true } : item)));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'APPOINTMENT': return <Calendar size={20} color={theme.primary} />;
      case 'MESSAGE': return <MessageCircle size={20} color="#0EA5E9" />;
      case 'ALERT': return <AlertCircle size={20} color="#F59E0B" />;
      case 'SUCCESS': return <CheckCircle2 size={20} color="#10B981" />;
      default: return <Bell size={20} color={theme.primary} />;
    }
  };

  const formatTime = (value: string) => {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <IconButton icon="refresh" size={24} onPress={carregarNotificacoes} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recentes</Text>
          {notifications.some((item) => !item.lida) && (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text style={[styles.markRead, { color: theme.primary }]}>Marcar todas como lidas</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text style={styles.footerText}>Carregando notificações...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.centerContent}>
            <AlertCircle size={28} color="#F59E0B" />
            <Text style={styles.footerText}>{error}</Text>
          </View>
        )}

        {!loading && !error && notifications.map((notif) => (
          <TouchableOpacity key={notif.id} activeOpacity={0.8} onPress={() => !notif.lida && handleMarkAsRead(notif.id)}>
            <Surface
              style={[
                styles.notifCard,
                !notif.lida && styles.unreadCard,
              ]}
              elevation={notif.lida ? 0 : 1}
            >
              <View style={styles.notifRow}>
                <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}10` }]}>
                  {getIcon(notif.tipo)}
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notifTitle, !notif.lida && styles.boldText]}>{notif.titulo}</Text>
                    {!notif.lida && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
                  </View>
                  <Text style={styles.notifDescription} numberOfLines={2}>{notif.descricao}</Text>
                  <Text style={styles.notifTime}>{formatTime(notif.criadaEm)}</Text>
                </View>
              </View>
            </Surface>
          </TouchableOpacity>
        ))}

        {!loading && !error && notifications.length === 0 && (
          <View style={styles.emptyFooter}>
            <Bell size={28} color="#94A3B8" />
            <Text style={styles.footerText}>Você ainda não tem notificações.</Text>
          </View>
        )}
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
    marginBottom: 20,
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
    marginRight: 16,
  },
  notifContent: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 15, color: '#1E293B' },
  boldText: { fontWeight: 'bold' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifDescription: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 8 },
  notifTime: { fontSize: 12, color: '#94A3B8' },
  emptyFooter: { alignItems: 'center', marginTop: 30, marginBottom: 50, gap: 8 },
  footerText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginTop: 8 },
  centerContent: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
});
