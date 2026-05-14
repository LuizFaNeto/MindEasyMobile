import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import ReviewScreen from '../../app/therapist/review';
import { renderWithProviders } from '../test-utils';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
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
      primary: '#3B82F6',
      background: '#fff',
      text: '#000',
      muted: '#64748B',
    },
    dark: {
      primary: '#60A5FA',
      background: '#000',
      text: '#fff',
      muted: '#94A3B8',
    },
  },
}));

function renderReview() {
  return renderWithProviders(<ReviewScreen />);
}

describe('ReviewScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('mostra título e dados do profissional', () => {
    const { getByText } = renderReview();
    expect(getByText('Avaliar Profissional')).toBeTruthy();
    expect(getByText('Dra. Andréa Soares')).toBeTruthy();
  });

  it(
    'envia avaliação e exibe agradecimento',
    async () => {
      const { getByTestId, getByText, findByText } = renderReview();

      fireEvent.press(getByTestId('star-5'));
      fireEvent.changeText(getByTestId('comment-input'), 'Excelente sessão');
      await act(async () => {
        fireEvent.press(getByText('Enviar Avaliação'));
      });

      expect(await findByText('Obrigado!', {}, { timeout: 15000 })).toBeTruthy();

      await act(async () => {
        fireEvent.press(getByText('Fechar'));
      });
      expect(mockBack).toHaveBeenCalled();
    },
    20000
  );
});
