import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';
import { renderWithProviders } from '../test-utils';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

jest.mock('../../store/userStore', () => ({
  useUserStore: (selector) =>
    selector({
      name: 'Maria',
      email: 'maria@test.com',
      isLogged: true,
      setUser: jest.fn(),
      logout: jest.fn(),
    }),
}));

function renderHome() {
  return renderWithProviders(<HomeScreen />);
}

describe('HomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renderiza marca, saudação e próxima consulta', () => {
    const { getByText } = renderHome();
    expect(getByText('Mind Easy')).toBeTruthy();
    expect(getByText(/Maria/)).toBeTruthy();
    expect(getByText('Próxima Consulta')).toBeTruthy();
    expect(getByText('Dra. Andréa Soares')).toBeTruthy();
  });

  it('abre notificações ao tocar no sino', () => {
    const { getByTestId } = renderHome();
    fireEvent.press(getByTestId('header-notifications'));
    expect(mockPush).toHaveBeenCalledWith('/notifications');
  });

  it('filtra terapeutas pela pesquisa', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderHome();
    fireEvent.changeText(getByPlaceholderText('Pesquisar terapeutas...'), 'Carlos');
    expect(getByText('Dr. Carlos Alberto')).toBeTruthy();
    expect(queryByText('Dra. Juliana Mendes')).toBeNull();
  });

  it('abre o modal de filtros', () => {
    const { getByText } = renderHome();
    fireEvent.press(getByText('Filtros'));
    expect(getByText('Filtrar Terapeutas')).toBeTruthy();
  });

  it('navega para o perfil do terapeuta', () => {
    const { getAllByText } = renderHome();
    const verPerfil = getAllByText('Ver Perfil')[0];
    fireEvent.press(verPerfil);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/therapist/[id]',
      params: { id: '2' },
    });
  });
});
