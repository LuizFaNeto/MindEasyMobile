import { useRouter } from 'expo-router';
import { Bell, Search, SlidersHorizontal, Star, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Modal, Portal, Text } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { useUserStore } from '../../store/userStore';
import { listarTerapeutas, TerapeutaResponse } from '../../services/terapeutaService';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ specialty: '', minRating: 0 });

  const [terapeutas, setTerapeutas] = useState<TerapeutaResponse[]>([]);
  const [loadingTerapeutas, setLoadingTerapeutas] = useState(true);
  const [apiError, setApiError] = useState('');

  const name = useUserStore((state) => state.name);
  const router = useRouter();

  // Carrega terapeutas da API ao montar a tela
  useEffect(() => {
    let cancelled = false;
    setLoadingTerapeutas(true);
    setApiError('');

    listarTerapeutas()
      .then((data) => {
        if (!cancelled) setTerapeutas(data);
      })
      .catch(() => {
        if (!cancelled) setApiError('Não foi possível carregar os terapeutas. Verifique sua conexão.');
      })
      .finally(() => {
        if (!cancelled) setLoadingTerapeutas(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filteredTherapists = useMemo(() => {
    let result = terapeutas;

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

    return result;
  }, [searchQuery, activeFilters, terapeutas]);

  const specialties = useMemo(() => {
    return Array.from(new Set(terapeutas.map(t => t.especialidade)));
  }, [terapeutas]);

  const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);

  const resetFilters = () => {
    setActiveFilters({ specialty: '', minRating: 0 });
    setIsFilterModalVisible(false);
  };

  // Gera as iniciais do avatar a partir do nome
  const getInitials = (nome: string) => {
    const parts = nome.replace(/^(Dr\.|Dra\.)\s?/i, '').split(' ');
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  const renderRecommendedCard = (therapist: TerapeutaResponse) => (
    <View key={therapist.id} style={styles.recommendedCard}>
      {/* Avatar com iniciais pois a API não retorna foto */}
      <View style={styles.therapistAvatarContainer}>
        <Text style={styles.therapistAvatarText}>{getInitials(therapist.nome)}</Text>
      </View>
      <View style={styles.recommendedInfo}>
        <Text style={styles.recName} numberOfLines={1}>{therapist.nome}</Text>
        <Text style={styles.recSpecialty} numberOfLines={1}>{therapist.especialidade}</Text>
        <Text style={styles.recCrm} numberOfLines={1}>{therapist.crm}</Text>
        <View style={styles.recButtons}>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => router.push({ pathname: '/therapist/[id]', params: { id: String(therapist.id) } })}
          >
            <Text style={styles.btnOutlineText}>Ver Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimarySmall}
            onPress={() => router.push({ pathname: '/therapist/book', params: { id: String(therapist.id), nome: therapist.nome } })}
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
          <Text style={styles.greetingText}>Olá <Text style={styles.boldBlue}>{name || 'Usuário'}</Text> !</Text>
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
              <SlidersHorizontal size={20} color={activeFilters.specialty ? Colors.light.primary : Colors.light.muted} />
              <Text style={[styles.filterText, activeFilters.specialty && { color: Colors.light.primary, fontWeight: 'bold' }]}>Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terapeutas List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleGrey}>
            {searchQuery === '' && !activeFilters.specialty ? 'Terapeutas Disponíveis' : 'Resultados da Pesquisa'}
          </Text>
        </View>

        {loadingTerapeutas ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Carregando terapeutas...</Text>
          </View>
        ) : apiError ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{apiError}</Text>
            <TouchableOpacity onPress={() => {
              setLoadingTerapeutas(true);
              listarTerapeutas().then(setTerapeutas).catch(() => setApiError('Erro ao carregar.')).finally(() => setLoadingTerapeutas(false));
            }}>
              <Text style={styles.clearSearchText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTherapists.length > 0 ? (
          <View style={styles.recommendedGrid}>
            {filteredTherapists.map(renderRecommendedCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum terapeuta encontrado.</Text>
            <TouchableOpacity onPress={resetFilters}>
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
                onPress={() => setActiveFilters({ ...activeFilters, specialty: '' })}
              >
                <Text style={[styles.optionText, activeFilters.specialty === '' && styles.optionTextActive]}>Todas</Text>
              </TouchableOpacity>
              {specialties.map(spec => (
                <TouchableOpacity
                  key={spec}
                  style={[styles.optionChip, activeFilters.specialty === spec && styles.optionChipActive]}
                  onPress={() => setActiveFilters({ ...activeFilters, specialty: spec })}
                >
                  <Text style={[styles.optionText, activeFilters.specialty === spec && styles.optionTextActive]}>{spec}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 10 },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.light.primary },
  notificationBtn: { position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#3B82F6', color: 'white', fontWeight: 'bold' },
  greetingSection: { marginBottom: 20 },
  greetingText: { fontSize: 22, color: '#334155' },
  boldBlue: { color: Colors.light.primary, fontWeight: 'bold' },
  subGreeting: { fontSize: 22, fontWeight: 'bold', color: '#475569' },
  searchSection: { marginBottom: 25 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8 },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1E293B', fontSize: 13, height: 40, padding: 0 },
  clearIcon: { padding: 5 },
  divider: { width: 1.5, height: 25, backgroundColor: '#CBD5E1', marginHorizontal: 10 },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { marginLeft: 5, color: '#475569', fontSize: 12 },
  sectionHeader: { marginBottom: 15 },
  sectionTitleGrey: { fontSize: 20, fontWeight: 'bold', color: '#475569' },
  loadingState: { alignItems: 'center', marginTop: 40, gap: 12 },
  loadingText: { color: '#64748B', fontSize: 14 },
  recommendedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recommendedCard: { width: '48%', backgroundColor: '#F8FAFC', borderRadius: 20, overflow: 'hidden', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  therapistAvatarContainer: { width: '100%', height: 120, backgroundColor: Colors.light.primary + '20', justifyContent: 'center', alignItems: 'center' },
  therapistAvatarText: { fontSize: 36, fontWeight: 'bold', color: Colors.light.primary },
  recommendedInfo: { padding: 10 },
  recName: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  recSpecialty: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  recCrm: { fontSize: 10, color: '#94A3B8', marginBottom: 8 },
  recButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btnOutline: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#FFF' },
  btnOutlineText: { fontSize: 10, color: '#475569', fontWeight: '600' },
  btnPrimarySmall: { backgroundColor: Colors.light.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  btnPrimaryText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  emptyState: { alignItems: 'center', marginTop: 20, padding: 20 },
  emptyStateText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 10 },
  clearSearchText: { color: Colors.light.primary, fontWeight: 'bold' },
  modalContainer: { backgroundColor: 'white', margin: 20, borderRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  modalContent: { marginBottom: 24 },
  filterSectionTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginBottom: 12, marginTop: 16 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  optionChipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  optionText: { fontSize: 14, color: '#475569' },
  optionTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  modalFooter: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, borderRadius: 12 },
});