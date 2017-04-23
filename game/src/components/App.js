import React from 'react';

import { StackNavigator } from 'react-navigation';

import LoginScreen from './LoginScreen';
import HeroScreen from './HeroScreen';
import InventoryScreen from './InventoryScreen';

import startLogging from '../lib/mobx-logger';

startLogging();

const stackNavigatorConfig = {
  initialRouteName: 'Login',
  headerMode: 'none',
};

const Stack = StackNavigator({
  Login: { screen: LoginScreen },
  Hero: { screen: InventoryScreen },
}, stackNavigatorConfig);

export default () => <Stack />;
