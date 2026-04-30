import { render } from '@testing-library/react-native';
import ProfileScreen from '../../app/(tabs)/profile';

describe('Tela de Profile', () => {

  //  TESTE 1 - Render geral
  test('deve renderizar a tela de perfil', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Perfil')).toBeTruthy();
  });

  //  TESTE 2 - Dados do usuário
  test('deve mostrar nome e informações do usuário', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Paulo Silva')).toBeTruthy();
    expect(getByText('Paciente | 29 anos')).toBeTruthy();
  });

  //  TESTE 3 - Estatísticas
  test('deve mostrar estatísticas do usuário', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Humor: 25 dias')).toBeTruthy();
    expect(getByText('Atividades: 15 concl.')).toBeTruthy();
  });

  //  TESTE 4 - Seções
  test('deve mostrar seções da tela', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Sua conta')).toBeTruthy();
    expect(getByText('Ajuda')).toBeTruthy();
  });

  //  TESTE 5 - Itens do menu
  test('deve renderizar itens do menu', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Informações Pessoais')).toBeTruthy();
    expect(getByText('Segurança')).toBeTruthy();
    expect(getByText('Dados')).toBeTruthy();

    expect(getByText('Apoio')).toBeTruthy();
    expect(getByText('Suporte')).toBeTruthy();
    expect(getByText('Enviar Feedback')).toBeTruthy();
  });

  //  TESTE 6 - Botão de logout
  test('deve mostrar botão de sair', () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Sair')).toBeTruthy();
  });

});