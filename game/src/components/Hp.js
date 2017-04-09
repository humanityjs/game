import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

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

class Hp extends Component {
  static propTypes = {
    hero: PropTypes.shape(),
  }
  constructor(props) {
    super();

    const { current, max } = props.hero.feature.hp;
    this.state = {
      currentHp: current,
    };

    this.maxHp = max;

    this.setHp = this.setHp.bind(this);
  }
  componentDidMount() {
    this.countHp();
  }
  componentDidUpdate() {
    const { hp } = this.props.hero.feature;
    if (hp.max !== this.maxHp) {
      this.maxHp = hp.max;
      this.countHp();
    }
  }
  componentWillUnmount() {
    clearInterval(this.setHpInterval);
  }
  setHp() {
    const { hero } = this.props;
    const hp = countHp(hero.feature.hp);

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
    const { hero } = this.props;
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

export default connect(state => ({ hero: state.hero.hero }))(Hp);
