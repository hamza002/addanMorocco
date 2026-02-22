module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-navigation|@notifee|react-native-screens|react-native-safe-area-context|react-native-linear-gradient|adhan|i18next|react-i18next)/)',
  ],
  moduleNameMapper: {
    '^react-native-linear-gradient$': '<rootDir>/__mocks__/react-native-linear-gradient.js',
  },
};
