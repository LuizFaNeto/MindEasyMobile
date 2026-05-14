import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/** Required in Jest so useSafeAreaInsets() works inside screens and react-native-paper. */
export const safeAreaInitialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function renderWithProviders(ui) {
  return render(
    <SafeAreaProvider initialMetrics={safeAreaInitialMetrics}>
      <PaperProvider>{ui}</PaperProvider>
    </SafeAreaProvider>
  );
}

export function renderWithSafeArea(ui) {
  return render(
    <SafeAreaProvider initialMetrics={safeAreaInitialMetrics}>{ui}</SafeAreaProvider>
  );
}
