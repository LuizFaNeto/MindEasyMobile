import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import BookAppointmentScreen from '../../app/therapist/book';
import { renderWithProviders } from '../test-utils';

const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1', nome: 'Dra. Andréa Soares' }),
  useRouter: () => ({
    replace: mockReplace,
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

function renderBook() {
  return renderWithProviders(<BookAppointmentScreen />);
}

describe('BookAppointmentScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
    mockReplace.mockClear();
    mockBack.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza cabeçalho e nome do terapeuta', () => {
    const { getByText } = renderBook();
    expect(getByText('Agendar Consulta')).toBeTruthy();
    expect(getByText('Dra. Andréa Soares')).toBeTruthy();
  });

  it('confirma agendamento e mostra diálogo de sucesso', async () => {
    const { UNSAFE_getAllByType, getByText } = renderBook();
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[1]);
    fireEvent.press(getByText('09:00'));
    fireEvent.press(getByText('Confirmar Agendamento'));

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText('Sucesso!')).toBeTruthy();

    fireEvent.press(getByText('Ver meus agendamentos'));
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/calendar');
  });
});
