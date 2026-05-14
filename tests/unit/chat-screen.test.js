import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ChatScreen from '../../app/(tabs)/ChatScreen';

describe('ChatScreen', () => {
  it('mostra mensagens iniciais', () => {
    const { getByText } = render(<ChatScreen />);
    expect(getByText('Olá, como você está hoje?')).toBeTruthy();
    expect(getByText('Estou me sentindo meio ansioso...')).toBeTruthy();
  });

  it('envia nova mensagem do utilizador', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);
    fireEvent.changeText(getByPlaceholderText('Digite sua mensagem...'), 'Preciso de apoio');
    fireEvent.press(getByTestId('chat-send'));
    expect(getByText('Preciso de apoio')).toBeTruthy();
  });
});
