import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import TherapistProfile from '../../app/therapist/[id]';
import { renderWithSafeArea } from '../test-utils';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: mockPush,
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
      primary: '#3B82F6',
      background: '#fff',
      text: '#000',
      muted: '#64748B',
      tint: '#3B82F6',
    },
    dark: {
      primary: '#60A5FA',
      background: '#000',
      text: '#fff',
      muted: '#94A3B8',
      tint: '#fff',
    },
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

describe('TherapistProfile', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('mostra dados do terapeuta pelo id', () => {
    const { getByText } = renderWithSafeArea(<TherapistProfile />);
    expect(getByText('Dra. Andréa Soares')).toBeTruthy();
    expect(getByText('Psicóloga Clínica')).toBeTruthy();
    expect(getByText('Sobre o profissional')).toBeTruthy();
  });

  it('navega para agendamento', () => {
    const { getByText } = renderWithSafeArea(<TherapistProfile />);
    fireEvent.press(getByText('Agendar'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/therapist/book',
      params: { id: '1', nome: 'Dra. Andréa Soares' },
    });
  });

  it('navega para avaliação', () => {
    const { getByText } = renderWithSafeArea(<TherapistProfile />);
    fireEvent.press(getByText('Avaliar agora'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/therapist/review',
      params: { id: '1' },
    });
  });
});
