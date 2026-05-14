import { fireEvent, render } from '@testing-library/react-native';
import CalendarScreen from '../../app/(tabs)/calendar';

//  Mock tema
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/constants/Colors', () => ({
  __esModule: true,
  default: {
    light: {
      background: '#fff',
      text: '#000',
      tint: '#2563EB',
    },
    dark: {
      background: '#000',
      text: '#fff',
      tint: '#fff',
    },
  },
}));

describe('CalendarScreen', () => {

  //  TESTE 1 - Render básico
  test('deve renderizar título e subtítulo', () => {
    const { getByText } = render(<CalendarScreen />);

    expect(getByText('Minhas Consultas')).toBeTruthy();
    expect(getByText('Gerencie seus agendamentos')).toBeTruthy();
  });

  //  TESTE 2 - Mostra consulta do dia atual
  test('deve mostrar consulta do dia atual', () => {
    const { getByText } = render(<CalendarScreen />);

    expect(getByText('Dra. Andréa Soares')).toBeTruthy();
    expect(getByText('Psicóloga')).toBeTruthy();
    expect(getByText('15:00')).toBeTruthy();
  });

  //  TESTE 3 - Estado vazio ao mudar data (primeiro dia da faixa = hoje - 3)
  test('deve mostrar mensagem quando não há consultas', () => {
    const { UNSAFE_getAllByType, queryByText } = render(<CalendarScreen />);
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[0]);

    expect(queryByText('Nenhuma consulta para este dia.')).toBeTruthy();
  });

  //  TESTE 4 - Botão de chamada
  test('deve chamar alert ao clicar no botão', () => {
    global.alert = jest.fn();

    const { getByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('Entrar na Chamada'));

    expect(global.alert).toHaveBeenCalledWith('Iniciando chamada...');
  });

});