module.exports = {
  preset: 'jest-expo',
  cacheDirectory: '<rootDir>/.jest-cache',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^\\.\\./(app/\\([^)]+\\)/.+)$': '<rootDir>/$1',
    '^react-native-svg$': '<rootDir>/__mocks__/react-native-svg.js',
    '^react-native-svg/(.+)$': '<rootDir>/__mocks__/react-native-svg.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|lucide-react-native))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
};
