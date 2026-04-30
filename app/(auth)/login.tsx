import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Lock, LogIn, Mail, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) router.replace('/(tabs)');
    else alert('Por favor, preencha todos os campos.');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.innerContainer}>
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>Bem-vindo de volta!</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>Acesse sua conta para continuar.</Text>
            </View>

            <Surface style={styles.card} elevation={4}>
              <Pressable style={styles.field} onPress={() => emailRef.current?.focus()}>
                <Mail size={20} color="#0284c7" />
                <TextInput
                  ref={emailRef}
                  mode="flat"
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.fieldInput}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </Pressable>

              <TextInput
                mode="outlined"
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onPressIn={() => {}}
                style={styles.input}
                outlineColor="#D9E6F2"
                activeOutlineColor="#0284c7"
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