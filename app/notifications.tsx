import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Surface, IconButton, Menu, Button } from 'react-native-paper';
import { Bell, Calendar, MessageCircle, AlertCircle, ArrowLeft, CheckCircle2, Video } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useUserStore } from '@/store/userStore';
import { listarAgendamentosPorPaciente, AgendamentoResponse } from '@/services/agendamentoService';

type NotificationType = 'appointment' | 'message' | 'alert' | 'success';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  callParams?: {
    pacienteId: string;
    nomeTerapeuta: string;
  };
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const pacienteId = useUserStore((state) => state.id);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!pacienteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const agendamentos = await listarAgendamentosPorPaciente(pacienteId);
      const now = new Date();
      
      const newNotifs: Notification[] = [];
      
      agendamentos.forEach(app => {
        if (app.status === 'AGENDADO' && app.data && app.horaInicio) {
          const appDateTime = new Date(`${app.data}T${app.horaInicio}`);
          const diffMs = appDateTime.getTime() - now.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);

          // Mostra apenas agendamentos futuros
          if (diffHours > 0) {
            let title = '';
            let timeString = '';
            let isUrgent = false;

            if (diffHours <= 24) {
              const hoursInt = Math.floor(diffHours);
              const minutesInt = Math.floor((diffHours - hoursInt) * 60);
              title = 'Consulta se aproximando';
              timeString = `Em ${hoursInt > 0 ? hoursInt + 'h ' : ''}${minutesInt}m`;
              isUrgent = diffHours <= 2; // Se for em menos de 2h fica como não lida (destaque)
            } else {
              const days = Math.floor(diffHours / 24);
              title = 'Próxima Consulta';
              timeString = `Daqui a ${days} dia${days > 1 ? 's' : ''}`;
            }

            newNotifs.push({
              id: String(app.id),
              type: 'appointment',
              title: title,
              description: `Você tem uma sessão marcada com ${app.nomeTerapeuta || 'seu terapeuta'} em ${new Date(app.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${app.horaInicio.slice(0, 5)}.`,
              time: timeString,
              read: !isUrgent,
              callParams: {
                pacienteId: String(pacienteId),
                nomeTerapeuta: app.nomeTerapeuta || 'Terapeuta'
              }
            });
          }
        }
      });

      // Ordenar pelas consultas mais próximas
      newNotifs.sort((a, b) => {
        if (a.read === b.read) return 0;
        return a.read ? 1 : -1; // Não lidas em cima
      });

      // Adiciona uma notificação de boas vindas para não ficar vazio
      if (newNotifs.length === 0) {
        newNotifs.push({
          id: 'welcome',
          type: 'success',
          title: 'Bem-vindo ao MindEasy',
          description: 'Acesse o calendário para marcar sua primeira consulta.',
          time: 'Agora',
          read: true
        });
      }

      setNotifications(newNotifs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment': return <Calendar size={20} color={theme.primary} />;
      case 'message': return <MessageCircle size={20} color={isDark ? "#38BDF8" : "#0EA5E9"} />;
      case 'alert': return <AlertCircle size={20} color={isDark ? "#FBBF24" : "#F59E0B"} />;
      case 'success': return <CheckCircle2 size={20} color={isDark ? "#34D399" : "#10B981"} />;
      default: return <Bell size={20} color={theme.primary} />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleJoinCall = (params: { pacienteId: string, nomeTerapeuta: string }) => {
    router.push({ 
      pathname: '/call/[id]', 
      params: { id: params.pacienteId, nome: params.nomeTerapeuta } 
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { 
        paddingTop: insets.top + 10, 
        backgroundColor: theme.background,
        borderBottomColor: isDark ? '#334155' : '#F1F5F9'
      }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notificações</Text>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton 
              icon="dots-vertical" 
              iconColor={theme.text} 
              size={24} 
              onPress={() => setMenuVisible(true)} 
            />
          }
        >
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              fetchNotifications();
            }} 
            title="Atualizar Notificações" 
            leadingIcon="refresh"
          />
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              setNotifications([]); // Limpa as notificações locais temporariamente
            }} 
            title="Limpar Tudo" 
            leadingIcon="delete"
          />
        </Menu>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>Recentes</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={[styles.markRead, { color: theme.tint }]}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.tint} />
            <Text style={{ marginTop: 10, color: isDark ? '#94A3B8' : '#64748B' }}>Buscando notificações...</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <Surface 
              key={notif.id} 
              style={[
                styles.notifCard, 
                { 
                  backgroundColor: isDark ? '#1E293B' : '#FFF',
                  borderColor: isDark ? '#334155' : '#F1F5F9'
                },
                !notif.read && [styles.unreadCard, { 
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? theme.tint + '50' : '#E2E8F0'
                }]
              ]} 
              elevation={notif.read ? 0 : 2}
            >
              <View style={styles.notifRow}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? `${theme.tint}20` : `${theme.tint}10` }]}>
                  {getIcon(notif.type)}
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notifTitle, { color: theme.text }, !notif.read && styles.boldText]}>{notif.title}</Text>
                    {!notif.read && <View style={[styles.unreadDot, { backgroundColor: theme.tint }]} />}
                  </View>
                  <Text style={[styles.notifDescription, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={3}>{notif.description}</Text>
                  <Text style={[styles.notifTime, { color: isDark ? '#64748B' : '#94A3B8' }]}>{notif.time}</Text>
                  
                  {notif.type === 'appointment' && notif.callParams && !notif.read && (
                    <Button 
                      mode="contained" 
                      onPress={() => handleJoinCall(notif.callParams!)}
                      style={{ marginTop: 12, borderRadius: 8, alignSelf: 'flex-start' }}
                      buttonColor={theme.tint}
                      icon={() => <Video size={16} color="#FFF" />}
                      contentStyle={{ paddingHorizontal: 4 }}
                      labelStyle={{ fontSize: 13 }}
                    >
                      Entrar na Chamada
                    </Button>
                  )}
                </View>
              </View>
            </Surface>
          ))
        )}

        <View style={styles.emptyFooter}>
          <Text style={[styles.footerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>Não há mais notificações por aqui.</Text>
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
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  markRead: { fontSize: 14, fontWeight: '600' },
  notifCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  unreadCard: {
    borderWidth: 1,
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
  notifTitle: { fontSize: 15 },
  boldText: { fontWeight: 'bold' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifDescription: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  notifTime: { fontSize: 12 },
  emptyFooter: { alignItems: 'center', marginTop: 30, marginBottom: 50 },
  footerText: { fontSize: 14 },
});
