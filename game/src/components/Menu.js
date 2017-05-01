import React from 'react';

import { View, StyleSheet } from 'react-native';
import SvgUri from 'react-native-svg-uri';

import { observer } from 'mobx-react';

import IconButton from './shared/IconButton';

import appStore from '../stores/app';

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default observer(() => {
  const currentNav = appStore.currentNavs.inner;

  const items = [{
    onPress: () => { 
      appStore.navigate('Hero');
      appStore.toggleMenu(false);
    },
    image: require('../assets/images/person-white.svg'),
    height: 24,
    width: 20,
    active: !currentNav || currentNav === 'Hero',
  }, {
    onPress: () => {
      appStore.navigate('Inventory');
      appStore.toggleMenu(false);
    },
    image: require('../assets/images/bag.svg'),
    height: 18,
    width: 16,
    active: currentNav === 'Inventory',
  }, {
    onPress: () => { console.log('3'); },
    image: require('../assets/images/cog.svg'),
  }, {
    onPress: () => { console.log('4'); },
    image: require('../assets/images/logout.svg'),
  }];

  return (
    <View>
      <View style={[styles.item]}>
        <SvgUri
          width="24"
          height="32"
          source={require('../assets/images/logo-white.svg')}
        />
      </View>
      {items.map((item, index) => (
        <IconButton
          key={index}
          style={[styles.item, item.active ? { backgroundColor: '#21C064' } : null]}
          onPress={item.onPress}
        >
          <SvgUri
            width={item.width || 16}
            height={item.height || 16}
            source={item.image}
          />
        </IconButton>
      ))}
    </View>
  );
});
