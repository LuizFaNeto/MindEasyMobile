import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Surface, Avatar, Portal, Dialog } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Mock available times for the therapist
const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

const getAvailableDates = () => {
  const dates = [];
  const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    // Skip weekends if you want, but for therapy mock let's show 7 days
    dates.push({
      day: daysMap[d.getDay()],
      date: d.getDate().toString(),
      full: d.toISOString().split('T')[0]
    });
  }
  return dates;
};

export default function BookAppointmentScreen() {
  const AVAILABLE_DATES = useMemo(() => getAvailableDates(), []);
  const { id, nome } = useLocalSearchParams<{ id: string, nome: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // Simulating API call to Java Backend (POST /api/agendamentos)
    console.log('Enviando agendamento para API:', {
      terapeutaId: id,
      data: selectedDate,
      horaInicio: selectedTime,
      pacienteId: 1 // Mock local user ID
    });

    setTimeout(() => {
      setLoading(false);
      setVisible(true);
    }, 1500);
  };

  const handleClose = () => {
    setVisible(false);
    router.replace('/(tabs)/calendar');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Therapist Summary */}
        <Surface style={styles.therapistCard} elevation={1}>
          <Avatar.Text size={48} label={nome?.substring(0, 2).toUpperCase() || 'TH'} style={{ backgroundColor: theme.primary }} />
          <View style={styles.therapistInfo}>
            <Text style={styles.therapistName}>{nome}</Text>
            <Text style={styles.therapistSpec}>Sessão de 50 minutos</Text>
          </View>
        </Surface>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Dia</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {AVAILABLE_DATES.map((item) => (
              <TouchableOpacity 
                key={item.full}
                onPress={() => setSelectedDate(item.full)}
                style={[
                  styles.dateItem, 
                  selectedDate === item.full && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
              >
                <Text style={[styles.dateDay, selectedDate === item.full && styles.selectedText]}>{item.day}</Text>
                <Text style={[styles.dateNumber, selectedDate === item.full && styles.selectedText]}>{item.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Horário</Text>
          <View style={styles.timeGrid}>
            {AVAILABLE_TIMES.map((time) => (
              <TouchableOpacity 
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeItem, 
                  selectedTime === time && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
              >
                <Clock size={16} color={selectedTime === time ? '#FFF' : '#64748B'} style={{ marginRight: 8 }} />
                <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Button 
          mode="contained" 
          onPress={handleConfirm}
          disabled={!selectedDate || !selectedTime || loading}
          loading={loading}
          style={[styles.bookBtn, { backgroundColor: (!selectedDate || !selectedTime) ? '#CBD5E1' : theme.primary }]}
          contentStyle={styles.bookBtnContent}
        >
          Confirmar Agendamento
        </Button>
      </View>

      {/* Success Modal */}
      <Portal>
        <Dialog visible={visible} onDismiss={handleClose} style={styles.dialog}>
          <View style={styles.successIconContainer}>
            <CheckCircle2 size={64} color="#10B981" />
          </View>
          <Dialog.Title style={styles.dialogTitle}>Sucesso!</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Sua consulta com {nome} foi agendada para o dia {selectedDate.split('-').reverse().join('/')} às {selectedTime}.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleClose} textColor={theme.primary} labelStyle={{ fontWeight: 'bold' }}>
              Ver meus agendamentos
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 64 },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scrollContent: { padding: 20 },
  therapistCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', marginBottom: 24 },
  therapistInfo: { marginLeft: 16 },
  therapistName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  therapistSpec: { fontSize: 14, color: '#64748B', marginTop: 2 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  dateList: { gap: 12 },
  dateItem: { width: 64, height: 80, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  dateDay: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  dateNumber: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', width: '30%', justifyContent: 'center' },
  timeText: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  selectedText: { color: '#FFF' },
  footer: { paddingHorizontal: 20, backgroundColor: '#FFF', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  bookBtn: { borderRadius: 16 },
  bookBtnContent: { height: 56 },
  dialog: { backgroundColor: '#FFF', borderRadius: 24, padding: 8 },
  successIconContainer: { alignItems: 'center', marginTop: 20 },
  dialogTitle: { textAlign: 'center', fontWeight: 'bold', marginTop: 10 },
  dialogText: { textAlign: 'center', color: '#64748B', fontSize: 16, lineHeight: 24 },
});
