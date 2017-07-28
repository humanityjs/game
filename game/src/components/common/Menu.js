import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import IconButton from '../shared/IconButton';

import appStore from '../../stores/app';
import authStore from '../../stores/auth';

import SettingsModal from '../SettingsModal';

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

@observer
export default class Menu extends Component {
  @observable showSettingsModal = false;
  constructor() {
    super();

    this.onShowSettingsModal = this.onToggleSettingsModal.bind(this, true);
    this.onHideSettingsModal = this.onToggleSettingsModal.bind(this, false);
  }
  onToggleSettingsModal(value) {
    appStore.toggleOverlay(value);
    this.showSettingsModal = value;
  }
  render() {
    const currentNav = appStore.currentNavs.inner;

    const items = [
      {
        key: 1,
        onPress: () => {
          appStore.navigate('Hero');
          appStore.toggleMenu(false);
        },
        image: require('../../assets/images/person-white.svg'),
        height: 24,
        width: 20,
        active: !currentNav || currentNav === 'Hero',
      },
      {
        key: 2,
        onPress: () => {
          appStore.navigate('Inventory');
          appStore.toggleMenu(false);
        },
        image: require('../../assets/images/bag.svg'),
        height: 18,
        width: 16,
        active: currentNav === 'Inventory',
      },
      {
        key: 3,
        onPress: () => {
          this.onShowSettingsModal();
          appStore.toggleMenu(false);
        },
        image: require('../../assets/images/cog.svg'),
      },
      {
        key: 4,
        onPress: () => {
          appStore.toggleMenu(false);
          authStore.logout();
          appStore.navigate('Login', 'outer');
        },
        image: require('../../assets/images/logout.svg'),
      },
    ];

    return (
      <View>
        <View style={[styles.item]}>
          <SvgUri width="24" height="32" source={require('../../assets/images/logo-white.svg')} />
        </View>
        {items.map(item =>
          <IconButton
            key={item.key}
            style={[styles.item, item.active && { backgroundColor: '#21C064' }]}
            onPress={item.onPress}
          >
            <SvgUri width={item.width || 16} height={item.height || 16} source={item.image} />
          </IconButton>,
        )}
        {this.showSettingsModal && <SettingsModal onHide={this.onHideSettingsModal} />}
      </View>
    );
  }
}
