import React from 'react';

import { StackNavigator } from 'react-navigation';

import LoginScreen from './LoginScreen';
import HeroScreen from './HeroScreen';

import startLogging from '../lib/mobx-logger';

startLogging();

const stackNavigatorConfig = {
  initialRouteName: 'Login',
  headerMode: 'none',
};

const Stack = StackNavigator({
  Login: { screen: LoginScreen },
  Hero: { screen: HeroScreen },
}, stackNavigatorConfig);

export default () => <Stack />;
