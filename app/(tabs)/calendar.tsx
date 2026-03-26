import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const appointments = [
    {
      id: '1',
      doctor: 'Dra. Andréa Soares',
      specialty: 'Psicóloga',
      date: 'Hoje, 26 de Março',
      time: '15:00',
      type: 'Online',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '2',
      doctor: 'Dr. Carlos Alberto',
      specialty: 'Terapia Infantil',
      date: 'Amanhã, 27 de Março',
      time: '10:30',
      type: 'Presencial',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>Minhas Consultas</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Gerencie seus agendamentos</Text>
      </View>

      <View style={styles.content}>
        {appointments.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Card.Content>
              <View style={styles.appointmentRow}>
                <Avatar.Image size={50} source={{ uri: item.image }} />
                <View style={styles.info}>
                  <Text style={styles.doctorName}>{item.doctor}</Text>
                  <Text style={styles.specialty}>{item.specialty}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <CalendarIcon size={16} color={theme.primary} />
                  <Text style={styles.detailText}>{item.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color={theme.primary} />
                  <Text style={styles.detailText}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.footer}>
                <Button 
                  mode="contained" 
                  onPress={() => {}} 
                  style={styles.button}
                  icon={() => <Video size={18} color="#fff" />}
                >
                  Entrar na Chamada
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  content: { padding: 20 },
  card: { marginBottom: 20, borderRadius: 16, backgroundColor: '#fff', elevation: 3 },
  appointmentRow: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: 16 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  specialty: { fontSize: 14, color: '#64748B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 8, fontSize: 14, color: '#475569' },
  footer: { marginTop: 8 },
  button: { borderRadius: 12, backgroundColor: '#3B82F6' },
});
