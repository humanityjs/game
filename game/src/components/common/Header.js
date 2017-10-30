import React from 'react';
import { observer } from 'mobx-react';

import { View } from 'react-native';
import Icon from '../shared/Icon';

import IconButton from '../shared/IconButton';
import Hp from './Hp';
import TopInfo from './TopInfo';

import appStore from '../../stores/app';
import heroStore from '../../stores/hero';

export default observer(() => (
  <View style={{ position: 'relative' }}>
    <IconButton
      onPress={() => appStore.toggleMenu(true)}
      style={{ position: 'absolute', top: 7, zIndex: 1 }}
    >
      <Icon size={14} name="menu" />
    </IconButton>
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      <View>
        <Hp warrior={heroStore.hero} />
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <TopInfo />
      </View>
    </View>
    {appStore.currentNavs.inner !== 'Island' && (
      <IconButton
        style={{ position: 'absolute', right: 240, top: 10 }}
        onPress={() => appStore.navigate('Island')}
      >
        <Icon size={24} name="back" />
      </IconButton>
    )}
  </View>
));
