import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Card, Avatar, IconButton } from 'react-native-paper';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';

// Dados fictícios para teste
const TERAPEUTAS = [
  { id: '1', nome: 'Dra. Ana Silva', especialidade: 'Psicóloga Clínica', nota: 4.9, imagem: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', nome: 'Dr. Marcos Souza', especialidade: 'Terapeuta Cognitivo', nota: 4.8, imagem: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', nome: 'Dra. Julia Lins', especialidade: 'Especialista em Ansiedade', nota: 5.0, imagem: 'https://i.pravatar.cc/150?u=3' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const name = useUserStore((state) => state.name);
  const router = useRouter();

  const renderTherapist = ({ item }: { item: typeof TERAPEUTAS[0] }) => (
    <Card 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/therapist/[id]', params: { id: item.id } })}
    >
      <Card.Content style={styles.cardContent}>
        <Avatar.Image size={60} source={{ uri: item.imagem }} />
        <View style={styles.infoContainer}>
          <Text variant="titleMedium" style={styles.name}>{item.nome}</Text>
          <Text variant="bodySmall" style={styles.specialty}>{item.especialidade}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{item.nota}</Text>
          </View>
        </View>
        <IconButton icon="chevron-right" iconColor="#0284c7" onPress={() => {}} />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header com Nome do Usuário */}
      <View style={styles.header}>
        <View>
          <Text variant="bodyLarge" style={styles.greeting}>Olá, {name || 'Visitante'}</Text>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>Encontre seu terapeuta</Text>
        </View>
        <Avatar.Text size={45} label={name ? name.substring(0, 2).toUpperCase() : 'ME'} style={styles.avatar} />
      </View>

      {/* Barra de Busca */}
      <Searchbar
        placeholder="Buscar especialidade ou nome..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={{ minHeight: 0 }}
      />

      {/* Lista de Profissionais */}
      <FlatList
        data={TERAPEUTAS}
        keyExtractor={(item) => item.id}
        renderItem={renderTherapist}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text variant="titleMedium" style={styles.listTitle}>Profissionais em destaque</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
  greeting: { color: '#64748b' },
  welcomeTitle: { fontWeight: 'bold', color: '#0369a1' },
  avatar: { backgroundColor: '#BAE6FD' },
  searchBar: { marginBottom: 25, borderRadius: 12, backgroundColor: '#fff', elevation: 2 },
  listTitle: { marginBottom: 15, color: '#0c4a6e', fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  card: { marginBottom: 12, backgroundColor: '#fff', borderRadius: 16 },
  cardContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  infoContainer: { flex: 1, marginLeft: 15 },
  name: { fontWeight: 'bold', color: '#1e293b' },
  specialty: { color: '#64748b' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { marginLeft: 4, fontSize: 12, color: '#475569', fontWeight: '600' },
});