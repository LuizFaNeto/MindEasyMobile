import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import CallScreen from '../../app/call/[id]';
import { renderWithSafeArea } from '../test-utils';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1', nome: 'Dra. Andréa Soares' }),
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    WebView: ({ onLoadEnd }) => {
      React.useEffect(() => {
        onLoadEnd?.();
      }, [onLoadEnd]);
      return (
        <View testID="mock-webview">
          <Text>WebView</Text>
        </View>
      );
    },
  };
});

describe('CallScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('mostra o nome do profissional na barra superior', () => {
    const { getByText } = renderWithSafeArea(<CallScreen />);
    expect(getByText('Consulta Online com')).toBeTruthy();
    expect(getByText('Dra. Andréa Soares')).toBeTruthy();
  });

  it('volta ao fechar', () => {
    const { getByTestId } = renderWithSafeArea(<CallScreen />);
    fireEvent.press(getByTestId('call-close'));
    expect(mockBack).toHaveBeenCalled();
  });
});
