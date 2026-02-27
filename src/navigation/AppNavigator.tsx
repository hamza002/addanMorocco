import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../theme';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TasbihScreen from '../screens/TasbihScreen';
import QiblaScreen from '../screens/QiblaScreen';
import {useAdNav} from '../ads/AdContext';
import AdBanner from '../ads/AdBanner';
import {AD_UNITS} from '../ads/adConfig';
import {BannerAdSize} from 'react-native-google-mobile-ads';

const Tab = createBottomTabNavigator();

/** Tab bar with a sticky banner above it */
const TabBarWithBanner = (props: any) => {
  const {colors} = useTheme();
  return (
    <View style={{backgroundColor: colors.tabBar}}>
      <AdBanner unitId={AD_UNITS.HOME_BANNER} size={BannerAdSize.BANNER} />
      <BottomTabBar {...props} />
    </View>
  );
};

const AppNavigator: React.FC = () => {
  const {colors, isDark} = useTheme();
  const {t, i18n} = useTranslation();
  const showInterstitialOnNav = useAdNav();

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
        tabBar={props => <TabBarWithBanner {...props} />}
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
          listeners={{tabPress: () => showInterstitialOnNav()}}
          options={{
            tabBarLabel: t('home'),
            tabBarIcon: ({focused}) => (
              <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                🕌
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="Tasbih"
          component={TasbihScreen}
          listeners={{tabPress: () => showInterstitialOnNav()}}
          options={{
            tabBarLabel: t('tasbih'),
            tabBarIcon: ({focused}) => (
              <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                📿
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="Qibla"
          component={QiblaScreen}
          listeners={{tabPress: () => showInterstitialOnNav()}}
          options={{
            tabBarLabel: t('qibla'),
            tabBarIcon: ({focused}) => (
              <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                🧭
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          listeners={{tabPress: () => showInterstitialOnNav()}}
          options={{
            tabBarLabel: t('settings'),
            tabBarIcon: ({focused}) => (
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
