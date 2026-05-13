import { render } from '@testing-library/react-native';
import UserProfileScreen from '../../app/(tabs)/user-profile';

//  Mock do hook de tema
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

//  Mock do Colors
jest.mock('@/constants/Colors', () => ({
  light: {
    background: '#fff',
    cardBackground: '#fff',
    text: '#000',
    muted: '#999',
    primary: '#2563EB',
  },
}));

describe('UserProfileScreen', () => {

  //  TESTE 1 - Render geral
  test('deve renderizar a tela corretamente', () => {
    const { getByText } = render(<UserProfileScreen />);

    expect(getByText('Davi Assunção')).toBeTruthy();
    expect(getByText('davi@mindeasy.com')).toBeTruthy();
  });

  //  TESTE 2 - Seções
  test('deve renderizar as seções', () => {
    const { getByText } = render(<UserProfileScreen />);

    expect(getByText('CONTA')).toBeTruthy();
    expect(getByText('PREFERÊNCIAS')).toBeTruthy();
  });

  //  TESTE 3 - Itens da conta
  test('deve renderizar opções da conta', () => {
    const { getByText } = render(<UserProfileScreen />);

    expect(getByText('Dados Pessoais')).toBeTruthy();
    expect(getByText('Segurança')).toBeTruthy();
    expect(getByText('Notificações')).toBeTruthy();
  });

  //  TESTE 4 - Preferências
  test('deve renderizar opções de preferências', () => {
    const { getByText } = render(<UserProfileScreen />);

    expect(getByText('Configurações do App')).toBeTruthy();
    expect(getByText('Sair da Conta')).toBeTruthy();
  });

});