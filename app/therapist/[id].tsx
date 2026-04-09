import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Surface, Chip, Avatar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ArrowLeft, Calendar, Clock, MapPin, Award, MessageCircle, Video } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width, height } = Dimensions.get('window');

// Mock data (in a real app, this would come from an API based on the ID)
const THERAPISTS = {
  '1': {
    nome: 'Dra. Andréa Soares',
    especialidade: 'Psicóloga Clínica',
    nota: 4.7,
    imagem: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800',
    descricao: 'Especialista em Terapia Cognitivo-Comportamental com mais de 10 anos de experiência ajudando pacientes a superar ansiedade e depressão. Focada em criar um ambiente seguro e acolhedor.',
    crp: 'CRP 06/123456',
    valor: 'R$ 150,00',
    tags: ['Ansiedade', 'Depressão', 'TCC', 'Adultos'],
    localizacao: 'São Paulo, SP (Online)',
  },
  '2': {
    nome: 'Dr. Carlos Alberto',
    especialidade: 'Terapia Infantil',
    nota: 4.3,
    imagem: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
    descricao: 'Especialista em desenvolvimento infantil e psicopedagogia. Trabalha com ludoterapia para ajudar crianças a expressarem suas emoções e superarem desafios escolares.',
    crp: 'CRP 06/789012',
    valor: 'R$ 130,00',
    tags: ['Autismo', 'TDAH', 'Escolar', 'Crianças'],
    localizacao: 'Rio de Janeiro, RJ',
  },
  'default': {
    nome: 'Profissional MindEasy',
    especialidade: 'Psicólogo(a)',
    nota: 4.5,
    imagem: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
    descricao: 'Especialista em saúde mental dedicado a proporcionar o melhor acompanhamento para o seu bem-estar emocional.',
    crp: 'CRP Ativo',
    valor: 'R$ 140,00',
    tags: ['Acolhimento', 'Saúde Mental'],
    localizacao: 'Disponível Online',
  }
};

export default function TherapistProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const therapist = THERAPISTS[id as keyof typeof THERAPISTS] || THERAPISTS['default'];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Modern Header with Avatar */}
        <View style={[styles.profileHeader, { backgroundColor: theme.primary + '15' }]}>
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.primary} />
          </TouchableOpacity>
          
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
              <Image 
                source={{ uri: therapist.imagem }} 
                style={styles.profileImage} 
                resizeMode="cover"
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
              <View style={styles.ratingBadge}>
                <Star size={16} color="#FFB84D" fill="#FFB84D" />
                <Text style={styles.ratingText}>{therapist.nota}</Text>
              </View>
            </View>

            <View style={styles.quickDetails}>
              <View style={styles.detailItem}>
                <Award size={18} color={theme.primary} />
                <Text style={styles.detailText}>{therapist.crp}</Text>
              </View>
              <View style={styles.detailItem}>
                <MapPin size={18} color={theme.primary} />
                <Text style={styles.detailText}>{therapist.localizacao}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={18} color={theme.primary} />
                <Text style={styles.detailText}>{therapist.valor} / sessão</Text>
              </View>
            </View>

            <View style={styles.tagsContainer}>
              {therapist.tags.map(tag => (
                <Chip key={tag} style={styles.tag} textStyle={styles.tagText}>{tag}</Chip>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>Sobre o profissional</Text>
              <Text style={styles.aboutText}>{therapist.descricao}</Text>
            </View>

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
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} color="#FFB84D" fill="#FFB84D" />)}
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
          onPress={() => {}} 
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
  profileHeader: { 
    height: 220, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: 20
  },
  avatarBorder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    padding: 4,
    backgroundColor: '#FFF'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    borderWidth: 4,
    borderColor: '#FFF'
  },
  backButton: { 
    position: 'absolute', 
    left: 20, 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  contentSurface: { 
    marginTop: -20, 
    backgroundColor: '#FFF', 
    paddingTop: 20 
  },
  infoSection: { paddingHorizontal: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  mainInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  specialty: { fontSize: 16, color: '#64748B', marginTop: 4 },
  ratingBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFBEB', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7'
  },
  ratingText: { marginLeft: 6, fontWeight: 'bold', color: '#92400E', fontSize: 16 },
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
  actionFooter: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 20, 
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  messageBtn: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    backgroundColor: '#EFF6FF', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE'
  },
  bookBtn: { flex: 1, borderRadius: 16, backgroundColor: '#3B82F6' },
  bookBtnContent: { height: 56 },
  bookBtnLabel: { fontSize: 16, fontWeight: 'bold' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: 'bold' },
  callBtn: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    backgroundColor: '#F0FDF4', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7'
  },
});
