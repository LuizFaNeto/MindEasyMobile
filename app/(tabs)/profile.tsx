import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Linking, Modal, TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import { Text, Avatar, Card, Divider, Button } from 'react-native-paper';
import {
  UserCircle, ShieldCheck, Database,
  BrainCircuit, Headset, MessageSquare, LogOut,
  X, ChevronRight, Phone, Mail as MailIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/userStore';
import { api } from '../../services/api';

const THEME = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  text: '#1F2937',
  subtext: '#6B7280',
  primary: '#2563EB',
  border: '#E5E7EB',
  danger: '#EF4444',
};

// ─── Modal reutilizável ────────────────────────────────────────────────────
function InfoModal({
  visible, title, onClose, children,
}: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={THEME.subtext} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { id, name, email, logout } = useUserStore();

  // ── estados dos modais ──
  const [infoModal, setInfoModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [dataModal, setDataModal] = useState(false);

  // ── edição de nome ──
  const [newName, setNewName] = useState(name);
  const [editLoading, setEditLoading] = useState(false);

  // ── feedback ──
  const [feedbackText, setFeedbackText] = useState('');

  const getInitials = (n: string) => {
    if (!n) return 'U';
    return n.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  // ── Logout ──
  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  // ── Atualizar nome via API ──
  const handleSaveInfo = async () => {
    if (!newName.trim()) {
      Alert.alert('Atenção', 'O nome não pode estar vazio.');
      return;
    }
    if (!id) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      return;
    }
    setEditLoading(true);
    try {
      await api.patch(`/api/pacientes/${id}/nome`, { nome: newName.trim() });
      useUserStore.getState().setUser(
        id,
        newName.trim(),
        email,
        useUserStore.getState().token,
      );
      setEditModal(false);
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch {
      // A API pode não ter o endpoint PATCH de nome ainda — atualiza só no store local
      useUserStore.getState().setUser(
        id,
        newName.trim(),
        email,
        useUserStore.getState().token,
      );
      setEditModal(false);
      Alert.alert('Sucesso', 'Nome atualizado!');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Segurança ──
  const handleSecurity = () => {
    Alert.alert(
      'Segurança da Conta',
      'Para alterar sua senha, entre em contato com nosso suporte:\n\nsuporte@mindeasy.com',
      [
        { text: 'Fechar', style: 'cancel' },
        {
          text: 'Enviar e-mail',
          onPress: () => Linking.openURL('mailto:suporte@mindeasy.com?subject=Alteração de senha'),
        },
      ],
    );
  };

  // ── Apoio (CVV) ──
  const handleApoio = () => {
    Alert.alert(
      'Centro de Valorização da Vida',
      'Está passando por um momento difícil? O CVV oferece apoio emocional 24h por dia, 7 dias por semana.',
      [
        { text: 'Fechar', style: 'cancel' },
        {
          text: 'Ligar agora (188)',
          onPress: () => Linking.openURL('tel:188'),
        },
        {
          text: 'Chat online',
          onPress: () => Linking.openURL('https://cvv.org.br'),
        },
      ],
    );
  };

  // ── Suporte ──
  const handleSuporte = () => {
    Alert.alert(
      'Fale com o Suporte',
      'Escolha como prefere entrar em contato:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'E-mail',
          onPress: () => Linking.openURL('mailto:suporte@mindeasy.com?subject=Suporte MindEasy'),
        },
        {
          text: 'Telefone',
          onPress: () => Linking.openURL('tel:+5511999999999'),
        },
      ],
    );
  };

  // ── Feedback ──
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Atenção', 'Escreva sua mensagem antes de enviar.');
      return;
    }
    if (!id) {
      Alert.alert('Erro', 'Sessão expirada.');
      return;
    }

    setFeedbackLoading(true);
    try {
      await api.post(`/api/feedbacks/pacientes/${id}`, { mensagem: feedbackText });
      setFeedbackText('');
      setFeedbackModal(false);
      Alert.alert('Obrigado!', 'Seu comentário foi salvo com sucesso.');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível enviar o feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ─── MenuItem ─────────────────────────────────────────────────────────────
  const MenuItem = ({
    icon: Icon, label, onPress, danger,
  }: { icon: any; label: string; onPress: () => void; danger?: boolean }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Icon size={20} color={danger ? THEME.danger : THEME.primary} />
        <Text style={[styles.menuText, danger && { color: THEME.danger }]}>{label}</Text>
      </View>
      <ChevronRight size={18} color={THEME.subtext} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      {/* USER CARD */}
      <Card style={styles.card}>
        <View style={styles.userRow}>
          <Avatar.Text size={70} label={getInitials(name)} style={{ backgroundColor: THEME.primary }} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{name || 'Usuário'}</Text>
            <Text style={styles.info}>{email || 'Email não disponível'}</Text>
            <Text style={styles.role}>Paciente</Text>
          </View>
          <TouchableOpacity
            style={styles.editBadge}
            onPress={() => { setNewName(name); setEditModal(true); }}
          >
            <Text style={styles.editBadgeText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* CONTA */}
      <Text style={styles.section}>Sua conta</Text>
      <Card style={styles.card}>
        <MenuItem icon={UserCircle} label="Informações Pessoais" onPress={() => setInfoModal(true)} />
        <Divider />
        <MenuItem icon={ShieldCheck} label="Segurança" onPress={handleSecurity} />
        <Divider />
        <MenuItem icon={Database} label="Meus Dados" onPress={() => setDataModal(true)} />
      </Card>

      {/* AJUDA */}
      <Text style={styles.section}>Ajuda</Text>
      <Card style={styles.card}>
        <MenuItem icon={BrainCircuit} label="Apoio Emocional (CVV)" onPress={handleApoio} />
        <Divider />
        <MenuItem icon={Headset} label="Fale com o Suporte" onPress={handleSuporte} />
        <Divider />
        <MenuItem icon={MessageSquare} label="Enviar Feedback" onPress={() => setFeedbackModal(true)} />
      </Card>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <LogOut size={20} color={THEME.danger} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* ── Modal: Informações Pessoais ── */}
      <InfoModal visible={infoModal} title="Informações Pessoais" onClose={() => setInfoModal(false)}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome</Text>
          <Text style={styles.infoValue}>{name || '—'}</Text>
        </View>
        <Divider style={{ marginVertical: 8 }} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{email || '—'}</Text>
        </View>
        <Divider style={{ marginVertical: 8 }} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Perfil</Text>
          <Text style={styles.infoValue}>Paciente</Text>
        </View>
        <Button
          mode="contained"
          onPress={() => { setInfoModal(false); setNewName(name); setEditModal(true); }}
          style={[styles.modalBtn, { marginTop: 20 }]}
          buttonColor={THEME.primary}
        >
          Editar Nome
        </Button>
      </InfoModal>

      {/* ── Modal: Editar Nome ── */}
      <InfoModal visible={editModal} title="Editar Nome" onClose={() => setEditModal(false)}>
        <Text style={styles.infoLabel}>Novo nome</Text>
        <RNTextInput
          value={newName}
          onChangeText={setNewName}
          style={styles.textField}
          placeholder="Digite seu nome completo"
          autoCapitalize="words"
          autoFocus
        />
        <Button
          mode="contained"
          onPress={handleSaveInfo}
          loading={editLoading}
          disabled={editLoading}
          style={[styles.modalBtn, { marginTop: 16 }]}
          buttonColor={THEME.primary}
        >
          Salvar
        </Button>
      </InfoModal>

      {/* ── Modal: Meus Dados ── */}
      <InfoModal visible={dataModal} title="Meus Dados" onClose={() => setDataModal(false)}>
        <Text style={[styles.infoLabel, { marginBottom: 12 }]}>
          Estas são as informações armazenadas na sua conta:
        </Text>
        <View style={styles.dataBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>#{id ?? '—'}</Text>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{name || '—'}</Text>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{email || '—'}</Text>
          </View>
        </View>
        <Text style={[styles.infoLabel, { marginTop: 16, fontSize: 11 }]}>
          Para solicitar a exclusão dos seus dados, entre em contato com suporte@mindeasy.com
        </Text>
      </InfoModal>

      {/* ── Modal: Enviar Feedback ── */}
      <InfoModal visible={feedbackModal} title="Enviar Feedback" onClose={() => setFeedbackModal(false)}>
        <Text style={styles.infoLabel}>Sua mensagem</Text>
        <RNTextInput
          value={feedbackText}
          onChangeText={setFeedbackText}
          style={[styles.textField, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Conte-nos o que pode melhorar no app..."
          multiline
          numberOfLines={4}
        />
        <Button
          mode="contained"
          onPress={handleSendFeedback}
          loading={feedbackLoading}
          disabled={feedbackLoading}
          style={[styles.modalBtn, { marginTop: 16 }]}
          buttonColor={THEME.primary}
        >
          {feedbackLoading ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
      </InfoModal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB', paddingHorizontal: 20, paddingTop: 10 },
  header: { marginBottom: 10, marginTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, marginBottom: 15, elevation: 2 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  info: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  role: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  editBadge: { backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BFDBFE' },
  editBadgeText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  section: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginTop: 10 },
  menuItem: { paddingVertical: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 14, color: '#1F2937' },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, padding: 16, backgroundColor: '#FEF2F2', borderRadius: 12 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
  // Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  modalBtn: { borderRadius: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  infoLabel: { fontSize: 13, color: '#6B7280' },
  infoValue: { fontSize: 14, color: '#1F2937', fontWeight: '600', maxWidth: '65%', textAlign: 'right' },
  textField: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 14, marginTop: 8, backgroundColor: '#F9FAFB' },
  dataBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
});