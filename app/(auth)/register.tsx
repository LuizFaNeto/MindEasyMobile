import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import {
  TextInput,
  Button,
  Text,
  Surface,
} from 'react-native-paper';

import { useRouter } from 'expo-router';

import {
  UserPlus,
  User,
  Mail,
  Lock,
  ArrowLeft,
  Calendar,
} from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { register, login } from '../../services/authService';
import { useUserStore } from '../../store/userStore';

// Opções de sexo conforme enum Java: Sexo.java
const SEXO_OPTIONS = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
  { label: 'Outro', value: 'OUTRO' },
] as const;

type SexoValue = typeof SEXO_OPTIONS[number]['value'];

// Aplica máscara DD/MM/AAAA automaticamente ao digitar
function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// Converte DD/MM/AAAA → YYYY-MM-DD para a API
function toApiDate(formatted: string): string {
  const parts = formatted.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return '';
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export default function RegisterScreen() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sexo, setSexo] = useState<SexoValue | ''>('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!nome || !email || !senha || !sexo || !dataNascimento) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (dataNascimento.length !== 10) {
      setError('Data de nascimento inválida. Use DD/MM/AAAA.');
      return;
    }

    if (senha.length < 8 || senha.length > 12) {
      setError('A senha deve ter entre 8 e 12 caracteres.');
      return;
    }

    const apiDate = toApiDate(dataNascimento);
    if (!apiDate) {
      setError('Data de nascimento inválida.');
      return;
    }

    setLoading(true);

    try {
      // 1. Cadastra o paciente na API — POST /api/pacientes
      await register({
        nome,
        email,
        senha,
        sexo: sexo as 'MASCULINO' | 'FEMININO' | 'OUTRO',
        dataNascimento: apiDate,
      });

      // 2. Faz login automaticamente — POST /api/auth/login
      const data = await login({ username: email, password: senha });

      // 3. Salva o usuário no store global
      setUser(data.id, data.nome, data.email, data.token);

      // 4. Vai para a tela principal
      router.replace('/(tabs)');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409 || status === 400) {
        setError('E-mail já cadastrado ou dados inválidos.');
      } else if (status === 422) {
        setError('Dados inválidos. Verifique os campos.');
      } else {
        setError('Erro de conexão. Verifique se a API está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.innerContainer}
          >
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>
                Criar Conta
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Junte-se ao MindEasy e cuide de você.
              </Text>
            </View>

            <Surface style={styles.card} elevation={4}>

              {/* Nome */}
              <TextInput
                label="Nome Completo"
                value={nome}
                onChangeText={(v) => { setNome(v); setError(''); }}
                mode="flat"
                left={<TextInput.Icon icon={() => <User size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
                autoCapitalize="words"
              />

              {/* E-mail */}
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

              {/* Senha */}
              <TextInput
                label="Senha (8 a 12 caracteres)"
                value={senha}
                onChangeText={(v) => { setSenha(v); setError(''); }}
                mode="flat"
                secureTextEntry
                maxLength={12}
                left={<TextInput.Icon icon={() => <Lock size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              {/* Data de Nascimento com máscara */}
              <TextInput
                label="Data de Nascimento (DD/MM/AAAA)"
                value={dataNascimento}
                onChangeText={(v) => { setDataNascimento(formatDate(v)); setError(''); }}
                mode="flat"
                keyboardType="numeric"
                maxLength={10}
                placeholder="DD/MM/AAAA"
                left={<TextInput.Icon icon={() => <Calendar size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              {/* Sexo — botões de seleção */}
              <Text style={styles.sectionLabel}>Sexo</Text>
              <View style={styles.sexoRow}>
                {SEXO_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.sexoBtn, sexo === opt.value && styles.sexoBtnActive]}
                    onPress={() => { setSexo(opt.value); setError(''); }}
                  >
                    <Text style={[styles.sexoBtnText, sexo === opt.value && styles.sexoBtnTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mensagem de erro */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Botão de cadastro */}
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
                {loading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>

              {/* Link para login */}
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '800',
    color: '#0369a1',
    textAlign: 'center',
  },
  subtitle: {
    color: '#0c4a6e',
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    padding: 28,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  sectionLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    marginTop: 4,
  },
  sexoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  sexoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  sexoBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  sexoBtnText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  sexoBtnTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: -4,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#0284c7',
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 12,
  },
});