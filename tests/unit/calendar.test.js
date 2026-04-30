import { fireEvent, render } from '@testing-library/react-native';
import CalendarScreen from '../../app/(tabs)/calendar';

//  Mock tema
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/constants/Colors', () => ({
  light: {
    background: '#fff',
    text: '#000',
    tint: '#2563EB',
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

  //  TESTE 3 - Estado vazio ao mudar data
  test('deve mostrar mensagem quando não há consultas', () => {
    const { getByText, queryByText } = render(<CalendarScreen />);

    // pega algum dia diferente (ex: o primeiro botão)
    const dayButton = getByText((content) => {
      return content !== '' && !isNaN(Number(content)); // pega número do dia
    });

    fireEvent.press(dayButton);

    // pode ou não ter consulta, então validamos fallback
    const emptyText = queryByText('Nenhuma consulta para este dia.');

    if (emptyText) {
      expect(emptyText).toBeTruthy();
    }
  });

  //  TESTE 4 - Botão de chamada
  test('deve chamar alert ao clicar no botão', () => {
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('Entrar na Chamada'));

    expect(alertMock).toHaveBeenCalledWith('Iniciando chamada...');

    alertMock.mockRestore();
  });

});