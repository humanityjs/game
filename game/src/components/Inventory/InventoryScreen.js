import React from 'react';
import { View } from 'react-native';

import Body from '../common/Body';
import Inventory from './Inventory';

import heroStore from '../../stores/hero';

export default () =>
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ width: 324 }}>
      <Body undressEnabled warrior={heroStore.hero} />
    </View>
    <View style={{ marginLeft: 20, width: 640 }}>
      <Inventory />
    </View>
  </View>;
