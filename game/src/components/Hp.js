import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleSheet, View } from 'react-native';

import Text from './shared/Text';

import { countHp } from '../lib/utils';

import heroStore from '../stores/hero';

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    width: 324,
  },
  nameWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    marginTop: -4,
  },
  level: {
    fontSize: 18,
  },
  hpWrapper: {
    height: 5,
    backgroundColor: '#EAEAEA',
  },
  hp: {
    height: 5,
    backgroundColor: '#FF8080',
  },
});

@observer
export default class extends Component {
  constructor() {
    super();

    const { current, max } = heroStore.hero.feature.hp;
    this.state = { currentHp: current };

    this.maxHp = max;

    this.setHp = this.setHp.bind(this);
  }
  componentDidMount() {
    this.countHp();
  }
  componentDidUpdate() {
    const { hp } = heroStore.hero.feature;
    if (hp.max !== this.maxHp) {
      this.maxHp = hp.max;
      this.countHp();
    }
  }
  componentWillUnmount() {
    clearInterval(this.setHpInterval);
  }
  setHp() {
    const hp = countHp(heroStore.hero.feature.hp);

    if (hp.current !== this.state.currentHp) {
      this.setState({ currentHp: hp.current });
    }

    if (hp.max === hp.current) {
      clearInterval(this.setHpInterval);
    }
  }
  countHp() {
    this.setHpInterval = setInterval(this.setHp, 1000);
    this.setHp();
  }
  render() {
    const { hero } = heroStore;
    const { currentHp } = this.state;

    const { hp } = hero.feature;
    const hpReady = currentHp / hp.max;

    return (
      <View style={styles.wrapper}>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>{hero.login} </Text>
          <Text style={styles.level}>[{hero.level}]</Text>
        </View>
        <View style={styles.hpWrapper}>
          <View style={[styles.hp, { width: `${(hpReady * 100)}%` }]} />
        </View>
      </View>
    );
  }
}
