/**
 * Morocco Prayer Times App
 * A clean, modern Islamic prayer times app for Morocco.
 */

import './src/i18n'; // Initialize i18n before anything else
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
