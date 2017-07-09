import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
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

@observer
export default class extends Component {
  static propTypes = {
    updateHp: PropTypes.bool,
    warrior: PropTypes.shape(),
  }
  constructor(props) {
    super();

    const { current, max } = props.warrior.feature.hp;
    this.state = { currentHp: current };

    this.maxHp = max;

    this.setHp = this.setHp.bind(this);
  }
  componentDidMount() {
    if (this.props.updateHp) this.countHp();
  }
  componentDidUpdate() {
    if (!this.props.updateHp) return;
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
          <Text style={styles.name}>{warrior.login} </Text>
          <Text style={styles.level}>[{warrior.level}]</Text>
        </View>
        <View style={styles.hpWrapper}>
          <View style={[styles.hp, { width: `${(hpReady * 100)}%` }]} />
        </View>
      </View>
    );
  }
}
