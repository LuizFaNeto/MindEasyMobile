import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Aqui você validaria os dados
    if (email && password) {
      router.replace('/(tabs)');
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.innerContainer}
          >
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>Bem-vindo de volta!</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>Acesse sua conta para continuar.</Text>
            </View>

            <Surface style={styles.card} elevation={4}>
              <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                mode="flat"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon={() => <Mail size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                mode="flat"
                secureTextEntry
                left={<TextInput.Icon icon={() => <Lock size={20} color="#0284c7" />} />}
                style={styles.input}
                activeUnderlineColor="#0284c7"
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon={() => <LogIn size={18} color="#fff" />}
              >
                Entrar
              </Button>

              <Button 
                mode="text" 
                onPress={() => router.replace('/(auth)/register')} 
                style={styles.backButton}
                labelStyle={{ color: '#0284c7', fontWeight: 'bold' }}
                icon={() => <UserPlus size={16} color="#0284c7" />}
              >
                Não tenho conta. Cadastrar
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
  button: { marginTop: 8, borderRadius: 12, backgroundColor: '#0284c7' },
  buttonContent: { height: 48 },
  buttonLabel: { fontWeight: 'bold' },
  backButton: { marginTop: 12 },
});