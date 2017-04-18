import React from 'react';
import { observer } from 'mobx-react';

import {
  View,
} from 'react-native';

import Text from './shared/Text';

import heroStore from '../stores/hero';

export default observer(() => (
  <View
    style={{
      width: 220,
      height: 40,
      backgroundColor: '#EAEAEA',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Money</Text>
    <Text style={{ marginLeft: 5 }}>{heroStore.hero.money}</Text>
    <Text style={{ marginLeft: 10 }}>Capacity</Text>
    <Text style={{ marginLeft: 5 }}>
      {`${heroStore.hero.feature.capacity.current}/${heroStore.hero.feature.capacity.max}`}
    </Text>
  </View>
));
