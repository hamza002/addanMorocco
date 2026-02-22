/**
 * @format
 */

// Mock native modules before any imports
jest.mock('@react-native-async-storage/async-storage', () => ({
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@notifee/react-native', () => ({
  createChannel: jest.fn().mockResolvedValue(undefined),
  requestPermission: jest.fn().mockResolvedValue({authorizationStatus: 1}),
  createTriggerNotification: jest.fn().mockResolvedValue(undefined),
  cancelNotification: jest.fn().mockResolvedValue(undefined),
  cancelAllNotifications: jest.fn().mockResolvedValue(undefined),
  AndroidImportance: {HIGH: 4},
  TriggerType: {TIMESTAMP: 0},
}));

jest.mock('react-native-linear-gradient', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const {View} = require('react-native');
  return {default: View};
});

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  requestAuthorization: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({children}: {children: React.ReactNode}) => children,
  };
});

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});

