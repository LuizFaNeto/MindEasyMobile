import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];


  const [selectedDate, setSelectedDate] = useState(new Date());

 
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + (i - 3)); // 3 dias antes, hoje, 3 dias depois
      return date;
    });
  }, []);

  // MOck de Dados das consultas com datas reais para a lógica de filtro
  const appointments = useMemo(() => [
    {
      id: '1',
      doctor: 'Dra. Andréa Soares',
      specialty: 'Psicóloga',
      dateObj: new Date(), // Hoje
      time: '15:00',
      type: 'Online',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '2',
      doctor: 'Dr. Carlos Alberto',
      specialty: 'Terapia Infantil',
      dateObj: new Date(new Date().setDate(new Date().getDate() + 1)), // Amanhã
      time: '10:30',
      type: 'Presencial',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    }
  ], []);

  const filteredAppointments = appointments.filter(app => 
    app.dateObj.getDate() === selectedDate.getDate() &&
    app.dateObj.getMonth() === selectedDate.getMonth() &&
    app.dateObj.getFullYear() === selectedDate.getFullYear()
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Minhas Consultas</Text>
        <Text style={[styles.subtitle, { color: '#64748B' }]}>Gerencie seus agendamentos</Text>
      </View>

      <View style={styles.dateSelector}>
        {days.map((date, index) => {
          const isSelected = date.getDate() === selectedDate.getDate();
          const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
          
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => setSelectedDate(date)}
              style={[
                styles.dateCard, 
                { backgroundColor: isSelected ? theme.tint : 'transparent' }
              ]}
            >
              <Text style={[styles.dateDay, { color: isSelected ? '#fff' : '#64748B' }]}>{dayName}</Text>
              <Text style={[styles.dateNumber, { color: isSelected ? '#fff' : theme.text }]}>{date.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((item) => (
            <Card key={item.id} style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#fff' }]}>
              <Card.Content>
                <View style={styles.appointmentRow}>
                  <Avatar.Image size={50} source={{ uri: item.image }} />
                  <View style={styles.info}>
                    <Text style={[styles.doctorName, { color: colorScheme === 'dark' ? '#fff' : '#1E293B' }]}>{item.doctor}</Text>
                    <Text style={styles.specialty}>{item.specialty}</Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9' }]} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <CalendarIcon size={16} color={theme.tint} />
                    <Text style={[styles.detailText, { color: colorScheme === 'dark' ? '#94A3B8' : '#475569' }]}>
                      {item.dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={16} color={theme.tint} />
                    <Text style={[styles.detailText, { color: colorScheme === 'dark' ? '#94A3B8' : '#475569' }]}>{item.time}</Text>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Button 
                    mode="contained" 
                    onPress={() => alert('Iniciando chamada...')} 
                    style={[styles.button, { backgroundColor: theme.tint }]}
                    icon={() => <Video size={18} color="#fff" />}
                  >
                    Entrar na Chamada
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ color: '#64748B' }}>Nenhuma consulta para este dia.</Text>
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
  dateSelector: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginVertical: 20 
  },
  dateCard: { 
    alignItems: 'center', 
    padding: 10, 
    borderRadius: 12, 
    minWidth: 45 
  },
  dateDay: { fontSize: 12, textTransform: 'uppercase' },
  dateNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  content: { padding: 20 },
  card: { marginBottom: 20, borderRadius: 16, elevation: 3 },
  appointmentRow: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: 16 },
  doctorName: { fontSize: 18, fontWeight: 'bold' },
  specialty: { fontSize: 14, color: '#64748B' },
  divider: { height: 1, marginVertical: 16 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 8, fontSize: 14 },
  footer: { marginTop: 8 },
  button: { borderRadius: 12 },
  emptyState: { alignItems: 'center', marginTop: 40 }
});