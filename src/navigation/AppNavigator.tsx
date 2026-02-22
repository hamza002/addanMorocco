import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  const {colors, isDark} = useTheme();
  const {t, i18n} = useTranslation();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.tabBar,
          border: colors.tabBarBorder,
          primary: colors.primary,
          text: colors.text,
          notification: colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.tabBar,
          border: colors.tabBarBorder,
          primary: colors.primary,
          text: colors.text,
          notification: colors.accent,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: t('home'),
            tabBarIcon: ({color, focused}) => (
              <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                🕌
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: t('settings'),
            tabBarIcon: ({color, focused}) => (
              <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                ⚙️
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
    opacity: 0.7,
  },
  tabIconFocused: {
    opacity: 1,
  },
});

export default AppNavigator;
