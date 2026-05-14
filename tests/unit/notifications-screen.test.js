import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import NotificationsScreen from '../../app/notifications';
import { renderWithSafeArea } from '../test-utils';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/constants/Colors', () => ({
  __esModule: true,
  default: {
    light: {
      background: '#fff',
      primary: '#3B82F6',
      text: '#000',
      muted: '#64748B',
      cardBackground: '#fff',
      tint: '#3B82F6',
    },
    dark: {
      background: '#000',
      primary: '#60A5FA',
      text: '#fff',
      muted: '#94A3B8',
      cardBackground: '#1E293B',
      tint: '#fff',
    },
  },
}));

describe('NotificationsScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('lista notificações recentes', () => {
    const { getByText } = renderWithSafeArea(<NotificationsScreen />);
    expect(getByText('Notificações')).toBeTruthy();
    expect(getByText('Consulta em 1 hora')).toBeTruthy();
    expect(getByText('Nova mensagem')).toBeTruthy();
    expect(getByText('Não há mais notificações por aqui.')).toBeTruthy();
  });

  it('volta ao pressionar voltar', () => {
    const { UNSAFE_getAllByType } = renderWithSafeArea(<NotificationsScreen />);
    const { TouchableOpacity } = require('react-native');
    const [back] = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(back);
    expect(mockBack).toHaveBeenCalled();
  });
});
