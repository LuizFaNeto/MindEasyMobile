import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Surface, Chip, Avatar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ArrowLeft, Calendar, Clock, MapPin, Award, MessageCircle, Video } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { buscarTerapeutaPorId, TerapeutaResponse } from '@/services/terapeutaService';

export default function TherapistProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [therapist, setTherapist] = useState<TerapeutaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    buscarTerapeutaPorId(Number(id))
      .then(setTherapist)
      .catch(() => setError('Não foi possível carregar o perfil do terapeuta.'))
      .finally(() => setLoading(false));
  }, [id]);

  const getInitials = (nome: string) => {
    return nome.replace(/^(Dr\.|Dra\.)\s?/i, '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerState]}>
        <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: '#64748B', marginTop: 12 }}>Carregando perfil...</Text>
      </View>
    );
  }

  if (error || !therapist) {
    return (
      <View style={[styles.container, styles.centerState]}>
        <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={{ color: '#64748B', textAlign: 'center', paddingHorizontal: 40 }}>{error || 'Terapeuta não encontrado.'}</Text>
        <Button onPress={() => router.back()} textColor={theme.primary} style={{ marginTop: 16 }}>Voltar</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com Avatar */}
        <View style={[styles.profileHeader, { backgroundColor: theme.primary + '15' }]}>
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.primary} />
          </TouchableOpacity>

          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
              <Avatar.Text
                size={118}
                label={getInitials(therapist.nome)}
                style={{ backgroundColor: theme.primary, borderRadius: 59 }}
                labelStyle={{ fontSize: 40, fontWeight: 'bold' }}
              />
            </View>
            <View style={styles.onlineBadge} />
          </View>
        </View>

        {/* Content Section */}
        <Surface style={styles.contentSurface} elevation={0}>
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <View style={styles.mainInfo}>
                <Text style={styles.name}>{therapist.nome}</Text>
                <Text style={styles.specialty}>{therapist.especialidade}</Text>
              </View>
            </View>

            <View style={styles.quickDetails}>
              <View style={styles.detailItem}>
                <Award size={18} color={theme.primary} />
                <Text style={styles.detailText}>{therapist.crm}</Text>
              </View>
              {therapist.telefone ? (
                <View style={styles.detailItem}>
                  <MapPin size={18} color={theme.primary} />
                  <Text style={styles.detailText}>{therapist.telefone}</Text>
                </View>
              ) : null}
              <View style={styles.detailItem}>
                <Clock size={18} color={theme.primary} />
                <Text style={styles.detailText}>Sessão de 50 minutos</Text>
              </View>
            </View>

            {/* Tags geradas a partir da especialidade */}
            <View style={styles.tagsContainer}>
              <Chip style={styles.tag} textStyle={styles.tagText}>{therapist.especialidade}</Chip>
              <Chip style={styles.tag} textStyle={styles.tagText}>{therapist.sexo === 'MASCULINO' ? 'Dr.' : 'Dra.'}</Chip>
              <Chip style={styles.tag} textStyle={styles.tagText}>Online</Chip>
            </View>

            <View style={styles.divider} />

            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>Sobre o profissional</Text>
              <Text style={styles.aboutText}>
                Especialista em {therapist.especialidade}, com registro profissional {therapist.crm}.
                Comprometido(a) em oferecer um atendimento humanizado e de qualidade.
              </Text>
            </View>

            {/* Avaliações */}
            <View style={styles.reviewTeaser}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Avaliações</Text>
                <TouchableOpacity onPress={() => router.push({ pathname: '/therapist/review', params: { id } })}>
                  <Text style={[styles.seeAll, { color: theme.primary }]}>Avaliar agora</Text>
                </TouchableOpacity>
              </View>
              <Surface style={styles.reviewCard} elevation={1}>
                <View style={styles.reviewerRow}>
                  <Avatar.Text size={32} label="JP" style={{ backgroundColor: theme.primary }} />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>João Paulo</Text>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} color="#FFB84D" fill="#FFB84D" />)}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>"Excelente profissional, me senti muito acolhido desde a primeira sessão."</Text>
              </Surface>
            </View>
          </View>
          <View style={{ height: 120 }} />
        </Surface>
      </ScrollView>

      {/* Floating Action Bar */}
      <Surface style={styles.actionFooter} elevation={4}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => router.push({ pathname: '/call/[id]', params: { id, nome: therapist.nome } })}
        >
          <Video size={24} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageBtn}>
          <MessageCircle size={24} color={theme.primary} />
        </TouchableOpacity>
        <Button
          mode="contained"
          onPress={() => router.push({ pathname: '/therapist/book', params: { id, nome: therapist.nome } })}
          style={styles.bookBtn}
          contentStyle={styles.bookBtnContent}
          labelStyle={styles.bookBtnLabel}
          icon={() => <Calendar size={20} color="#FFF" />}
        >
          Agendar
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centerState: { justifyContent: 'center', alignItems: 'center' },
  profileHeader: { height: 220, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  avatarWrapper: { position: 'relative', marginTop: 20 },
  avatarBorder: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, padding: 4, backgroundColor: '#FFF', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  onlineBadge: { position: 'absolute', bottom: 5, right: 5, width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', borderWidth: 4, borderColor: '#FFF' },
  backButton: { position: 'absolute', left: 20, backgroundColor: '#FFF', borderRadius: 12, padding: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  contentSurface: { marginTop: -20, backgroundColor: '#FFF', paddingTop: 20 },
  infoSection: { paddingHorizontal: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  mainInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  specialty: { fontSize: 16, color: '#64748B', marginTop: 4 },
  quickDetails: { marginBottom: 20, gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 12, color: '#475569', fontSize: 14 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tag: { backgroundColor: '#F1F5F9', borderRadius: 8 },
  tagText: { color: '#475569', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  aboutText: { fontSize: 15, color: '#64748B', lineHeight: 24 },
  aboutSection: { marginBottom: 10 },
  reviewTeaser: { marginTop: 30 },
  reviewCard: { padding: 16, borderRadius: 16, backgroundColor: '#F8FAFC', marginBottom: 10 },
  reviewerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewerInfo: { marginLeft: 12 },
  reviewerName: { fontSize: 14, fontWeight: 'bold', color: '#334155' },
  stars: { flexDirection: 'row', marginTop: 2 },
  reviewText: { fontSize: 14, color: '#475569', fontStyle: 'italic' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: 'bold' },
  actionFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 35 : 20, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  callBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DCFCE7' },
  messageBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DBEAFE' },
  bookBtn: { flex: 1, borderRadius: 16, backgroundColor: '#3B82F6' },
  bookBtnContent: { height: 56 },
  bookBtnLabel: { fontSize: 16, fontWeight: 'bold' },
});
