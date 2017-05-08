import React from 'react';

import { StyleSheet, View } from 'react-native';

import { StackNavigator } from 'react-navigation';

import Header from './Header';

import HeroScreen from './HeroScreen';
import InventoryScreen from './InventoryScreen';

import appStore from '../stores/app';

const stackNavigatorConfig = {
  initialRouteName: 'Hero',
  headerMode: 'none',
  cardStyle: { shadowOpacity: 0, backgroundColor: '#F2F2F2' },
};

const Stack = StackNavigator({
  Hero: { screen: HeroScreen, navigationOptions: { gesturesEnabled: false } },
  Inventory: { screen: InventoryScreen, navigationOptions: { gesturesEnabled: false } },
}, stackNavigatorConfig);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
});

export default () => (
  <View style={styles.container}>
    <Header />
    <Stack ref={ref => appStore.setNavigationRef(ref, 'inner')} />
  </View>
);
