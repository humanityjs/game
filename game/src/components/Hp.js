import React, { Component, PropTypes } from 'react';
import { StyleSheet, View } from 'react-native';

import Text from './shared/Text';

import { countHp } from '../lib/utils';

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

export default class Hp extends Component {
  static propTypes = {
    warrior: PropTypes.shape(),
  };
  constructor(props) {
    super();

    const { current, max } = props.warrior.feature.hp;
    this.state = { currentHp: current };

    this.maxHp = max;

    this.setHp = this.setHp.bind(this);
  }
  componentDidMount() {
    this.countHp();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.warrior !== undefined) {
      this.state.currentHp = nextProps.warrior.feature.hp.current;
    }
  }
  componentDidUpdate() {
    const { hp } = this.props.warrior.feature;
    if (hp.max !== this.maxHp) {
      this.maxHp = hp.max;
      this.countHp();
    }
  }
  componentWillUnmount() {
    clearInterval(this.setHpInterval);
  }
  setHp() {
    const hp = countHp(this.props.warrior.feature.hp);

    if (hp.current !== this.state.currentHp) {
      this.setState({ currentHp: hp.current });
    }

    if (hp.max === hp.current) {
      clearInterval(this.setHpInterval);
    }
  }
  countHp() {
    const { warrior } = this.props;
    if (warrior.combat) return;

    this.setHpInterval = setInterval(this.setHp, 1000);
    this.setHp();
  }
  render() {
    const { warrior } = this.props;
    const { currentHp } = this.state;

    const { hp } = warrior.feature;
    const hpReady = currentHp / hp.max;

    return (
      <View style={styles.wrapper}>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>
            {warrior.login}{' '}
          </Text>
          <Text style={styles.level}>
            [{warrior.level}]
          </Text>
        </View>
        <View style={styles.hpWrapper}>
          <View style={[styles.hp, { width: `${hpReady * 100}%` }]} />
        </View>
      </View>
    );
  }
}
