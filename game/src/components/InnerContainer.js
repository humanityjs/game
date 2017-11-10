import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { observer } from 'mobx-react';

import Header from './common/Header';

import HeroScreen from './HeroScreen';
import InventoryScreen from './Inventory/InventoryScreen';
import IslandScreen from './IslandScreen';

import appStore from '../stores/app';

const tabNavigatorConfig = {
  initialRouteName: 'Hero',
};

const Stack = TabNavigator(
  {
    Hero: { screen: HeroScreen },
    Inventory: { screen: InventoryScreen },
    Island: { screen: IslandScreen },
  },
  tabNavigatorConfig,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
});

export default observer(() => (
  <View style={styles.container}>
    <Header />
    <Stack
      ref={(ref) => {
        appStore.setNavigationRef(ref, 'inner');
      }}
    />
  </View>
));
