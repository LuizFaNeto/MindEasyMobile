import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
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
  VenusAndMars,
} from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useUserStore } from '../../store/userStore';

export default function RegisterScreen() {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const formatarDataParaAPI = (data: string) => {
    const partes = data.split('/');

    if (partes.length !== 3) {
      return '';
    }

    const [dia, mes, ano] = partes;

    return `${ano}-${mes}-${dia}`;
  };

  const handleRegister = async () => {
    if (
      !nome ||
      !email ||
      !senha ||
      !sexo ||
      !dataNascimento
    ) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const paciente = {
      nome,
      email,
      senha,
      sexo,
      dataNascimento: formatarDataParaAPI(
        dataNascimento
      ),
    };

    console.log('Dados enviados:', paciente);

    // Aqui você fará o POST para a API futuramente

    setUser(nome, email);

    router.replace('/(auth)/login');
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
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.innerContainer}
          >
            <View style={styles.header}>
              <Text
                variant="headlineMedium"
                style={styles.title}
              >
                Cadastrar Conta
              </Text>

              <Text
                variant="bodyMedium"
                style={styles.subtitle}
              >
                Junte-se ao MindEasy e cuide de você.
              </Text>
            </View>

            <Surface style={styles.card} elevation={4}>
              <TextInput
                label="Nome Completo"
                value={nome}
                onChangeText={setNome}
                mode="flat"
                left={
                  <TextInput.Icon
                    icon={() => (
                      <User size={20} color="#0284c7" />
                    )}
                  />
                }
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
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Mail size={20} color="#0284c7" />
                    )}
                  />
                }
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                mode="flat"
                secureTextEntry
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Lock size={20} color="#0284c7" />
                    )}
                  />
                }
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="Sexo"
                value={sexo}
                onChangeText={setSexo}
                mode="flat"
                placeholder="MASCULINO, FEMININO ou OUTRO"
                autoCapitalize="characters"
                 left={
                  <TextInput.Icon
                  icon={() => (
                    <VenusAndMars size={20} color="#0284c7" />
                  )}
                />
              }
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="Data de Nascimento"
                value={dataNascimento}
                onChangeText={setDataNascimento}
                mode="flat"
                placeholder="DD/MM/YYYY"
                keyboardType="numeric"
                left={
                  <TextInput.Icon
                  icon={() => (
                    <Calendar size={20} color="#0284c7" />
                  )}
                />
              }
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
                icon={() => (
                  <UserPlus size={18} color="#fff" />
                )}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>

              <Button
                mode="text"
                onPress={() =>
                  router.replace('/(auth)/login')
                }
                style={styles.backButton}
                labelStyle={{
                  color: '#0284c7',
                  fontWeight: 'bold',
                }}
                icon={() => (
                  <ArrowLeft
                    size={16}
                    color="#0284c7"
                  />
                )}
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