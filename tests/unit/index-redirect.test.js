import React from 'react';
import { render } from '@testing-library/react-native';
import Index from '../../app/index';

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }) =>
      React.createElement(Text, { testID: 'redirect-target', children: href }),
  };
});

describe('app/index', () => {
  it('redireciona para o fluxo de cadastro', () => {
    const { getByTestId } = render(<Index />);
    expect(getByTestId('redirect-target').props.children).toBe('/(auth)/register');
  });
});
