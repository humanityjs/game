import React from 'react';

import { StackNavigator } from 'react-navigation';
import Drawer from 'react-native-drawer';
import { observer } from 'mobx-react';
import { View } from 'react-native';

import Menu from './Menu';
import LoginScreen from './LoginScreen';

import InnerContainer from './InnerContainer';

import authStore from '../stores/auth';
import appStore from '../stores/app';

import startLogging from '../lib/mobx-logger';

startLogging();

const stackNavigatorConfig = {
  initialRouteName: 'Login',
  headerMode: 'none',
  cardStyle: { backgroundColor: 'transparent' },
};

const Stack = StackNavigator({
  Login: { screen: LoginScreen },
  Inner: { screen: InnerContainer, navigationOptions: { gesturesEnabled: false } },
}, stackNavigatorConfig);

export default observer(() => (
  <Drawer
    type="static"
    ref={ref => appStore.setMenuRef(ref)}
    content={<Menu />}
    acceptDoubleTap
    openDrawerOffset={viewport => viewport.width - 80}
    panThreshold={0.08}
    panOpenMask={0.2}
    styles={{ drawer: { backgroundColor: '#1C1C1C' } }}
    disabled={!authStore.isLoggedIn}
    acceptPan={authStore.isLoggedIn}
  >
    <View style={{ backgroundColor: '#F2F2F2', flex: 1 }}>
      <Stack ref={ref => appStore.setNavigationRef(ref, 'outer')} />
    </View>
  </Drawer>
));
