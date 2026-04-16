import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterScreen from '../app/(auth)/register';

// MOCK do expo-router
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe('Tela de Cadastro', () => {

  beforeEach(() => {
    mockReplace.mockClear();
  });

  test('deve ir para login ao clicar em "Já tenho conta"', () => {
    
    const { getByText } = render(<RegisterScreen />);

    const botao = getByText('Já tenho conta. Fazer Login');

    fireEvent.press(botao);

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });

});