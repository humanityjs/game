import React from 'react';

import { View } from 'react-native';
import SvgUri from 'react-native-svg-uri';

import IconButton from './shared/IconButton';
import Hp from './Hp';
import TopInfo from './TopInfo';

import appStore from '../stores/app';

export default () => (
  <View style={{ position: 'relative' }}>
    <IconButton
      onPress={() => appStore.toggleMenu(true)}
      style={{ position: 'absolute', top: 7, zIndex: 1 }}
    >
      <SvgUri
        width="14"
        height="14"
        source={require('../assets/images/menu.svg')}
      />
    </IconButton>
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      <View>
        <Hp />
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <TopInfo />
      </View>
    </View>
  </View>
);
