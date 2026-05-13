import { useRouter } from 'expo-router';
import { Bell, Search, SlidersHorizontal, Star, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Modal, Portal, Text } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { useUserStore } from '../../store/userStore';

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
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    specialty: '',
    minRating: 0,
  });

  const name = useUserStore((state) => state.name);
  const router = useRouter();

  const filteredTherapists = useMemo(() => {
    let result = TODOS_TERAPEUTAS;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        t => t.nome.toLowerCase().includes(query) ||
          t.especialidade.toLowerCase().includes(query)
      );
    }

    if (activeFilters.specialty) {
      result = result.filter(t => t.especialidade === activeFilters.specialty);
    }

    if (activeFilters.minRating > 0) {
      result = result.filter(t => t.nota >= activeFilters.minRating);
    }

    return result;
  }, [searchQuery, activeFilters]);

  const specialties = useMemo(() => {
    const specs = Array.from(new Set(TODOS_TERAPEUTAS.map(t => t.especialidade)));
    return specs;
  }, []);

  const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);

  const resetFilters = () => {
    setActiveFilters({
      specialty: '',
      minRating: 0,
    });
    setIsFilterModalVisible(false);
  };

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
          <TouchableOpacity 
            style={styles.btnPrimarySmall}
            onPress={() => router.push({ pathname: '/therapist/book', params: { id: therapist.id, nome: therapist.nome } })}
          >
            <Text style={styles.btnPrimaryText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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
            <TouchableOpacity style={styles.filterBtn} onPress={toggleFilterModal}>
              <SlidersHorizontal size={20} color={activeFilters.specialty || activeFilters.minRating > 0 ? Colors.light.primary : Colors.light.muted} />
              <Text style={[styles.filterText, (activeFilters.specialty || activeFilters.minRating > 0) && { color: Colors.light.primary, fontWeight: 'bold' }]}>Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Próxima Consulta - Hidden when searching or filtering */}
        {searchQuery === '' && !activeFilters.specialty && activeFilters.minRating === 0 && (
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
            {searchQuery === '' && !activeFilters.specialty && activeFilters.minRating === 0 ? 'Terapeutas Recomendados' : 'Resultados da Pesquisa'}
          </Text>
        </View>

        {filteredTherapists.length > 0 ? (
          <View style={styles.recommendedGrid}>
            {filteredTherapists.map(renderRecommendedCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum terapeuta encontrado com os filtros selecionados.</Text>
            <TouchableOpacity onPress={() => resetFilters()}>
              <Text style={styles.clearSearchText}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={isFilterModalVisible}
          onDismiss={toggleFilterModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Terapeutas</Text>
            <TouchableOpacity onPress={toggleFilterModal}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.filterSectionTitle}>Especialidade</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[styles.optionChip, activeFilters.specialty === '' && styles.optionChipActive]}
                onPress={() => setActiveFilters({...activeFilters, specialty: ''})}
              >
                <Text style={[styles.optionText, activeFilters.specialty === '' && styles.optionTextActive]}>Todas</Text>
              </TouchableOpacity>
              {specialties.map(spec => (
                <TouchableOpacity 
                  key={spec}
                  style={[styles.optionChip, activeFilters.specialty === spec && styles.optionChipActive]}
                  onPress={() => setActiveFilters({...activeFilters, specialty: spec})}
                >
                  <Text style={[styles.optionText, activeFilters.specialty === spec && styles.optionTextActive]}>{spec}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Avaliação Mínima</Text>
            <View style={styles.optionsContainer}>
              {[0, 3, 4, 4.5].map(rating => (
                <TouchableOpacity 
                  key={rating}
                  style={[styles.optionChip, activeFilters.minRating === rating && styles.optionChipActive]}
                  onPress={() => setActiveFilters({...activeFilters, minRating: rating})}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.optionText, activeFilters.minRating === rating && styles.optionTextActive]}>
                      {rating === 0 ? 'Qualquer' : `${rating}+`}
                    </Text>
                    {rating > 0 && <Star size={12} color={activeFilters.minRating === rating ? '#FFF' : '#FFB84D'} fill={activeFilters.minRating === rating ? '#FFF' : '#FFB84D'} style={{ marginLeft: 4 }} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button mode="outlined" onPress={resetFilters} style={styles.modalBtn} textColor={Colors.light.primary}>
              Limpar
            </Button>
            <Button mode="contained" onPress={toggleFilterModal} style={[styles.modalBtn, { backgroundColor: Colors.light.primary }]}>
              Aplicar
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
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
  clearSearchText: { color: Colors.light.primary, fontWeight: 'bold' },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalContent: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    marginTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 14,
    color: '#475569',
  },
  optionTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
  },
});