import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { Calendar as CalendarIcon, Clock, Video, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { listarAgendamentos, AgendamentoResponse } from '@/services/agendamentoService';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + (i - 3));
      return date;
    });
  }, []);

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    setError('');
    listarAgendamentos()
      .then((data) => setAppointments(data))
      .catch(() => setError('Não foi possível carregar os agendamentos.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filtra agendamentos pelo dia selecionado
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      if (!app.data) return false;
      const appDate = new Date(app.data + 'T00:00:00');
      return (
        appDate.getDate() === selectedDate.getDate() &&
        appDate.getMonth() === selectedDate.getMonth() &&
        appDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [appointments, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO': return '#3B82F6';
      case 'CONFIRMADO': return '#10B981';
      case 'CONCLUIDO':
      case 'REALIZADO': return '#6B7280';
      case 'CANCELADO': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado';
      case 'CONFIRMADO': return 'Confirmado';
      case 'CONCLUIDO':
      case 'REALIZADO': return 'Concluído';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  const getInitials = (nome?: string) => {
    if (!nome) return 'T';
    return nome.replace(/^(Dr\.|Dra\.)\s?/i, '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  // nomeTerapeuta é o campo correto do AgendamentoResponseDTO

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Minhas Consultas</Text>
        <Text style={[styles.subtitle, { color: '#64748B' }]}>Gerencie seus agendamentos</Text>
      </View>

      {/* Seletor de dias */}
      <View style={styles.dateSelector}>
        {days.map((date, index) => {
          const isSelected =
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth();
          const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDate(date)}
              style={[styles.dateCard, { backgroundColor: isSelected ? theme.tint : 'transparent' }]}
            >
              <Text style={[styles.dateDay, { color: isSelected ? '#fff' : '#64748B' }]}>{dayName}</Text>
              <Text style={[styles.dateNumber, { color: isSelected ? '#fff' : theme.text }]}>{date.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={theme.tint} />
            <Text style={{ color: '#64748B', marginTop: 12 }}>Carregando...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text style={{ color: '#64748B', textAlign: 'center', marginBottom: 12 }}>{error}</Text>
            <TouchableOpacity onPress={fetchAppointments} style={styles.retryBtn}>
              <RefreshCw size={16} color={theme.tint} />
              <Text style={{ color: theme.tint, fontWeight: 'bold', marginLeft: 6 }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((item) => (
            <Card key={item.id} style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#fff' }]}>
              <Card.Content>
                <View style={styles.appointmentRow}>
                  <Avatar.Text
                    size={50}
                    label={getInitials(item.nomeTerapeuta)}
                    style={{ backgroundColor: theme.tint }}
                  />
                  <View style={styles.info}>
                    <Text style={[styles.doctorName, { color: colorScheme === 'dark' ? '#fff' : '#1E293B' }]}>
                      {item.nomeTerapeuta || 'Terapeuta'}
                    </Text>
                    {/* Badge de status */}
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9' }]} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <CalendarIcon size={16} color={theme.tint} />
                    <Text style={[styles.detailText, { color: colorScheme === 'dark' ? '#94A3B8' : '#475569' }]}>
                      {new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={16} color={theme.tint} />
                    <Text style={[styles.detailText, { color: colorScheme === 'dark' ? '#94A3B8' : '#475569' }]}>
                      {item.horaInicio?.slice(0, 5) || '--:--'}
                    </Text>
                  </View>
                </View>

                {/* Botão de entrar só aparece para agendamentos ativos */}
                {(item.status === 'AGENDADO' || item.status === 'CONFIRMADO') && (
                  <View style={styles.footer}>
                    <Button
                      mode="contained"
                      onPress={() => router.push({ pathname: '/call/[id]', params: { id: String(item.id), nome: item.nomeTerapeuta } })}
                      style={[styles.button, { backgroundColor: theme.tint }]}
                      icon={() => <Video size={18} color="#fff" />}
                    >
                      Entrar na Chamada
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ color: '#64748B', textAlign: 'center' }}>Nenhuma consulta para este dia.</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => router.push('/')}
            >
              <Text style={{ color: theme.tint, fontWeight: 'bold' }}>Agendar uma consulta</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginVertical: 20 },
  dateCard: { alignItems: 'center', padding: 10, borderRadius: 12, minWidth: 45 },
  dateDay: { fontSize: 12, textTransform: 'uppercase' },
  dateNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  content: { padding: 20 },
  centerState: { alignItems: 'center', marginTop: 40 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  card: { marginBottom: 20, borderRadius: 16, elevation: 3 },
  appointmentRow: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: 16, flex: 1 },
  doctorName: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, marginVertical: 16 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 8, fontSize: 14 },
  footer: { marginTop: 8 },
  button: { borderRadius: 12 },
  emptyState: { alignItems: 'center', marginTop: 40, gap: 12 },
});