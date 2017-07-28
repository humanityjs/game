import React from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet } from 'react-native';

import Text from '../shared/Text';

import heroStore from '../../stores/hero';

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 40,
    backgroundColor: '#EAEAEA',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default observer(() =>
  <View style={styles.container}>
    <Text>Money</Text>
    <Text style={{ marginLeft: 5 }}>
      {heroStore.hero.money}
    </Text>
    <Text style={{ marginLeft: 10 }}>Capacity</Text>
    <Text style={{ marginLeft: 5 }}>
      {`${heroStore.hero.feature.capacity.current}/${heroStore.hero.feature.capacity.max}`}
    </Text>
  </View>,
);
