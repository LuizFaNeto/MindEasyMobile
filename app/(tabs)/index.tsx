import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'expo-router';
import { Bell, Star, SlidersHorizontal, Search, X } from 'lucide-react-native';
import Colors from '../../constants/Colors';

// Mock data to match the design style
const PROXIMA_CONSULTA = {
  id: '1',
  nome: 'Dra. Andréa Soares',
  especialidade: 'Psicóloga',
  nota: 4.7,
  horario: 'Hoje, 15:00 - Online',
  imagem: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
};

const TODOS_TERAPEUTAS = [
  {
    id: '2',
    nome: 'Dr. Carlos Alberto',
    especialidade: 'Terapia Infantil',
    nota: 4.3,
    imagem: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    nome: 'Dra. Juliana Mendes',
    especialidade: 'Terapia de Casal',
    nota: 4.8,
    imagem: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    nome: 'Dr. Roberto Santos',
    especialidade: 'Psicólogo Cognitivo',
    nota: 4.5,
    imagem: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '5',
    nome: 'Dra. Fernanda Lima',
    especialidade: 'Psicanalista',
    nota: 4.9,
    imagem: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const name = useUserStore((state) => state.name);
  const router = useRouter();

  const filteredTherapists = useMemo(() => {
    if (!searchQuery.trim()) return TODOS_TERAPEUTAS;
    const query = searchQuery.toLowerCase();
    return TODOS_TERAPEUTAS.filter(
      t => t.nome.toLowerCase().includes(query) || 
           t.especialidade.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const renderRecommendedCard = (therapist: typeof TODOS_TERAPEUTAS[0]) => (
    <View key={therapist.id} style={styles.recommendedCard}>
      <Image source={{ uri: therapist.imagem }} style={styles.recommendedImage} />
      <View style={styles.recommendedInfo}>
        <Text style={styles.recName}>{therapist.nome}</Text>
        <Text style={styles.recSpecialty}>{therapist.especialidade}</Text>
        <View style={styles.recRating}>
          <Star size={14} color={Colors.light.primary} fill={Colors.light.primary} />
          <Text style={styles.recRatingText}>{therapist.nota}</Text>
        </View>
        <View style={styles.recButtons}>
          <TouchableOpacity 
            style={styles.btnOutline}
            onPress={() => router.push({ pathname: '/therapist/[id]', params: { id: therapist.id } })}
          >
            <Text style={styles.btnOutlineText}>Ver Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimarySmall}>
            <Text style={styles.btnPrimaryText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Mind Easy</Text>
        <TouchableOpacity 
          style={styles.notificationBtn} 
          onPress={() => router.push('/notifications')}
        >
          <Bell size={28} color={Colors.light.primary} />
          <Badge size={18} style={styles.badge}>2</Badge>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Olá <Text style={styles.boldBlue}>{name || '*User*'}</Text> !</Text>
        <Text style={styles.subGreeting}>Encontre seu Terapeuta</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Search size={20} color={Colors.light.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar terapeutas..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
              <X size={18} color={Colors.light.muted} />
            </TouchableOpacity>
          )}
          <View style={styles.divider} />
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={Colors.light.muted} />
            <Text style={styles.filterText}>Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Próxima Consulta - Hidden when searching */}
      {searchQuery === '' && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleBlue}>Próxima Consulta</Text>
          </View>

          <View style={styles.mainCard}>
            <View style={styles.mainCardImageContainer}>
              <Image source={{ uri: PROXIMA_CONSULTA.imagem }} style={styles.mainCardImage} resizeMode="cover" />
            </View>
            <View style={styles.mainCardInfo}>
              <Text style={styles.mainCardName}>{PROXIMA_CONSULTA.nome}</Text>
              <Text style={styles.mainCardSpecialty}>{PROXIMA_CONSULTA.especialidade}</Text>
              <View style={styles.cardRating}>
                <Star size={14} color={Colors.light.primary} fill={Colors.light.primary} />
                <Text style={styles.cardRatingText}>{PROXIMA_CONSULTA.nota}</Text>
              </View>
              <Text style={styles.appointmentTime}>
                <Text style={styles.boldTime}>Hoje, 15:00</Text> - Online
              </Text>
              <TouchableOpacity style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>Entrar na Sessão</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Terapeutas List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleGrey}>
          {searchQuery === '' ? 'Terapeutas Recomendados' : 'Resultados da Pesquisa'}
        </Text>
      </View>

      {filteredTherapists.length > 0 ? (
        <View style={styles.recommendedGrid}>
          {filteredTherapists.map(renderRecommendedCard)}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum terapeuta encontrado para "{searchQuery}"</Text>
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Limpar pesquisa</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 60, 
    marginBottom: 10 
  },
  brandTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.light.primary 
  },
  notificationBtn: { position: 'relative' },
  badge: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: '#3B82F6',
    color: 'white',
    fontWeight: 'bold'
  },
  greetingSection: { marginBottom: 20 },
  greetingText: { fontSize: 22, color: '#334155' },
  boldBlue: { color: Colors.light.primary, fontWeight: 'bold' },
  subGreeting: { fontSize: 22, fontWeight: 'bold', color: '#475569' },
  searchSection: { marginBottom: 25 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1E293B', fontSize: 13, height: 40, padding: 0 },
  clearIcon: { padding: 5 },
  divider: { width: 1.5, height: 25, backgroundColor: '#CBD5E1', marginHorizontal: 10 },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { marginLeft: 5, color: '#475569', fontSize: 12 },
  sectionHeader: { marginBottom: 15 },
  sectionTitleBlue: { fontSize: 20, fontWeight: 'bold', color: Colors.light.primary },
  sectionTitleGrey: { fontSize: 20, fontWeight: 'bold', color: '#475569' },
  mainCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    minHeight: 180,
  },
  mainCardImageContainer: { width: '40%', height: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20, overflow: 'hidden' },
  mainCardImage: { width: '100%', height: '100%' },
  mainCardInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  mainCardName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  mainCardSpecialty: { fontSize: 13, color: '#64748B', marginBottom: 5 },
  cardRating: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardRatingText: { marginLeft: 5, color: Colors.light.primary, fontWeight: '600' },
  appointmentTime: { fontSize: 13, color: '#64748B', marginBottom: 15 },
  boldTime: { fontWeight: 'bold', color: '#1E293B' },
  btnPrimary: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnPrimaryText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  recommendedGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  recommendedCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  recommendedImage: { width: '100%', height: 140, backgroundColor: '#E2E8F0' },
  recommendedInfo: { padding: 10 },
  recName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  recSpecialty: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  recRating: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  recRatingText: { marginLeft: 4, fontSize: 11, color: Colors.light.primary, fontWeight: '600' },
  recButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFF'
  },
  btnOutlineText: { fontSize: 10, color: '#475569', fontWeight: '600' },
  btnPrimarySmall: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  emptyState: { alignItems: 'center', marginTop: 20, padding: 20 },
  emptyStateText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 10 },
  clearSearchText: { color: Colors.light.primary, fontWeight: 'bold' }
});