import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Surface, Avatar, Portal, Dialog } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ArrowLeft, Send } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const THERAPISTS = {
  '1': { nome: 'Dra. Andréa Soares', especialidade: 'Psicóloga Clínica' },
  '2': { nome: 'Dr. Carlos Alberto', especialidade: 'Terapia Infantil' },
  'default': { nome: 'Profissional MindEasy', especialidade: 'Psicólogo(a)' }
};

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);

  const therapist = THERAPISTS[id as keyof typeof THERAPISTS] || THERAPISTS['default'];

  const handleSubmit = () => {
    console.log('Avaliação enviada:', { id, rating, comment });
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            testID="back-button"
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Avaliar Profissional</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Professional Card */}
          <Surface style={styles.therapistCard} elevation={1}>
            <Avatar.Text 
              size={64} 
              label={therapist.nome.substring(0, 2).toUpperCase()} 
              style={{ backgroundColor: theme.primary }} 
            />
            <View style={styles.therapistInfo}>
              <Text style={styles.therapistName}>{therapist.nome}</Text>
              <Text style={styles.therapistSpec}>{therapist.especialidade}</Text>
            </View>
          </Surface>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Como foi sua experiência?</Text>
            <Text style={styles.sectionSubtitle}>Toque nas estrelas para avaliar</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star}
                  testID={`star-${star}`}   
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <Star 
                    size={48} 
                    color={star <= rating ? "#FFB84D" : "#E2E8F0"} 
                    fill={star <= rating ? "#FFB84D" : "transparent"}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={styles.sectionTitle}>Deixe um comentário (opcional)</Text>
            <TextInput
              testID="comment-input"  
              style={styles.input}
              placeholder="Descreva o que você achou do atendimento..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Button 
            testID="submit-button"  
            mode="contained" 
            onPress={handleSubmit}
            disabled={rating === 0}
            style={[styles.submitBtn, { backgroundColor: rating > 0 ? theme.primary : '#CBD5E1' }]}
            contentStyle={styles.submitBtnContent}
            labelStyle={styles.submitBtnLabel}
            icon={() => <Send size={20} color="#FFF" />}
          >
            Enviar Avaliação
          </Button>
        </View>

        {/* Success Modal */}
        <Portal>
          <Dialog 
            testID="success-dialog"  
            visible={visible} 
            onDismiss={handleClose} 
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Obrigado!</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>
                Sua avaliação foi enviada com sucesso e ajuda outros pacientes a encontrarem o melhor cuidado.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
                testID="close-dialog-button"
                onPress={handleClose} 
                textColor={theme.primary}
              >
                Fechar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </View>
    </KeyboardAvoidingView>
  );
}