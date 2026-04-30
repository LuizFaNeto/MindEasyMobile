import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { Send } from 'lucide-react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá, como você está hoje?', from: 'psych' },
    { id: '2', text: 'Estou me sentindo meio ansioso...', from: 'user' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), text: message, from: 'user' }
    ]);

    setMessage('');
  };

  const renderItem = ({ item }: any) => {
    const isUser = item.from === 'user';

    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.psychMessage
      ]}>
        {!isUser && <Avatar.Text size={32} label="P" />}

        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.psychBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Send size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end'
  },

  userMessage: {
    justifyContent: 'flex-end'
  },

  psychMessage: {
    justifyContent: 'flex-start'
  },

  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12
  },

  userBubble: {
    backgroundColor: '#2563EB'
  },

  psychBubble: {
    backgroundColor: '#E5E7EB'
  },

  messageText: {
    color: '#000'
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },

  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10
  }
});