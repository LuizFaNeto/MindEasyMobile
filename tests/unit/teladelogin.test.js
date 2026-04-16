import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../app/(auth)/login';

// mock do router
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe('Tela de Login', () => {

  beforeEach(() => {
    mockReplace.mockClear();
  });

  test('deve ir para tela de cadastro ao clicar em "Não tenho conta"', () => {

    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Não tenho conta. Cadastrar'));

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/register');
  });

});