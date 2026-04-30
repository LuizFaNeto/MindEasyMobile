module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    // Resolve Expo Router group paths like (auth), (tabs), etc.
    '^\\.\\./(app/\\([^)]+\\)/.+)$': '<rootDir>/$1',
    // Mock react-native-svg (native module, cannot run in Jest)
    '^react-native-svg$': '<rootDir>/__mocks__/react-native-svg.js',
    '^react-native-svg/(.+)$': '<rootDir>/__mocks__/react-native-svg.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|lucide-react-native))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
};