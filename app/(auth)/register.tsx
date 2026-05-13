import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { UserPlus, User, Mail, Lock, ArrowLeft, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { register } from '../../services/authService';

type Sexo = 'MASCULINO' | 'FEMININO' | 'OUTRO';

const SEXO_OPTIONS: { label: string; value: Sexo }[] = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
  { label: 'Outro', value: 'OUTRO' },
];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState<Sexo | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  // Formata entrada de data no padrão YYYY-MM-DD
  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    // Formato visível: DD/MM/YYYY → converte para YYYY-MM-DD ao enviar
    let formatted = cleaned;
    if (cleaned.length >= 3) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    if (cleaned.length >= 5) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    return formatted;
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !sexo || !dataNascimento) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 8 || password.length > 12) {
      setError('A senha deve ter entre 8 e 12 caracteres.');
      return;
    }

    // Converte DD/MM/YYYY → YYYY-MM-DD
    const parts = dataNascimento.split('/');
    if (parts.length !== 3 || parts[2].length !== 4) {
      setError('Data de nascimento inválida. Use DD/MM/AAAA.');
      return;
    }
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    setLoading(true);
    setError('');

    try {
      await register({
        nome: name,
        email,
        senha: password,
        sexo: sexo as Sexo,
        dataNascimento: isoDate,
      });
      router.replace('/(auth)/login');
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 400) {
        setError(message || 'Dados inválidos. Verifique os campos.');
      } else if (status === 409) {
        setError('E-mail já cadastrado. Faça login.');
      } else {
        setError('Erro de conexão. Verifique se a API está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>Cadastrar Conta</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>Junte-se ao MindEasy e cuide de você.</Text>
            </View>

            <Surface style={styles.card} elevation={4}>
              <TextInput
                label="Nome Completo"
                value={name}
                onChangeText={(v) => { setName(v); setError(''); }}
                mode="flat"
                left={<TextInput.Icon icon={() => <User size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="E-mail"
                value={email}
                onChangeText={(v) => { setEmail(v); setError(''); }}
                mode="flat"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon={() => <Mail size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="Senha (8 a 12 caracteres)"
                value={password}
                onChangeText={(v) => { setPassword(v); setError(''); }}
                mode="flat"
                secureTextEntry
                left={<TextInput.Icon icon={() => <Lock size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="Data de Nascimento (DD/MM/AAAA)"
                value={dataNascimento}
                onChangeText={(v) => { setDataNascimento(formatDate(v)); setError(''); }}
                mode="flat"
                keyboardType="numeric"
                maxLength={10}
                left={<TextInput.Icon icon={() => <Calendar size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <Text style={styles.sectionLabel}>Sexo</Text>
              <View style={styles.sexoRow}>
                {SEXO_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.sexoBtn, sexo === opt.value && styles.sexoBtnActive]}
                    onPress={() => setSexo(opt.value)}
                  >
                    <Text style={[styles.sexoBtnText, sexo === opt.value && styles.sexoBtnTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon={() => <UserPlus size={18} color="#fff" />}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>

              <Button
                mode="text"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.backButton}
                labelStyle={{ color: '#0284c7', fontWeight: 'bold' }}
                icon={() => <ArrowLeft size={16} color="#0284c7" />}
              >
                Já tenho conta. Fazer Login
              </Button>
            </Surface>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  innerContainer: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontWeight: '800', color: '#0369a1', textAlign: 'center' },
  subtitle: { color: '#0c4a6e', opacity: 0.7, textAlign: 'center' },
  card: { padding: 28, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.9)' },
  input: { marginBottom: 16, backgroundColor: 'transparent' },
  sectionLabel: { fontSize: 13, color: '#64748B', marginBottom: 10, marginTop: 4 },
  sexoRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sexoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  sexoBtnActive: { borderColor: '#0284c7', backgroundColor: '#E0F2FE' },
  sexoBtnText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  sexoBtnTextActive: { color: '#0284c7' },
  errorText: { color: '#DC2626', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  button: { marginTop: 8, borderRadius: 12, backgroundColor: '#0284c7' },
  buttonContent: { height: 48 },
  buttonLabel: { fontWeight: 'bold' },
  backButton: { marginTop: 12 },
});