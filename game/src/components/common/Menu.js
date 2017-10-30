import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Icon from '../shared/Icon';
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
        image: 'person',
        size: 20,
        active: !currentNav || currentNav === 'Hero',
      },
      {
        key: 2,
        onPress: () => {
          appStore.navigate('Inventory');
          appStore.toggleMenu(false);
        },
        image: 'bag',
        active: currentNav === 'Inventory',
      },
      {
        key: 3,
        onPress: () => {
          this.onShowSettingsModal();
          appStore.toggleMenu(false);
        },
        image: 'cog',
      },
      {
        key: 4,
        onPress: () => {
          appStore.toggleMenu(false);
          authStore.logout();
          appStore.navigate('Login', 'outer');
        },
        image: 'logout',
      },
    ];

    return (
      <View>
        <View style={[styles.item]}>
          <Icon size={24} color="#ffffff" name="logo" />
        </View>
        {items.map(item => (
          <IconButton
            key={item.key}
            style={[styles.item, item.active && { backgroundColor: '#21C064' }]}
            onPress={item.onPress}
          >
            <Icon size={item.size || 16} color="#ffffff" name={item.image} />
          </IconButton>
        ))}
        {this.showSettingsModal && <SettingsModal onHide={this.onHideSettingsModal} />}
      </View>
    );
  }
}
