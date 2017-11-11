import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';

import Icon from '../shared/Icon';
import Text from '../shared/Text';
import IconButton from '../shared/IconButton';

import { countHp } from '../../lib/warrior-utils';

import appStore from '../../stores/app';

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
@autobind
export default class Hp extends Component {
  static propTypes = {
    warrior: PropTypes.shape(),
    showInfo: PropTypes.bool,
  };
  constructor(props) {
    super();

    const { current, max } = props.warrior.feature.hp;
    this.state = { currentHp: current };

    this.maxHp = max;
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
    const { warrior, showInfo } = this.props;
    const { currentHp } = this.state;

    const { hp } = warrior.feature;
    const hpReady = currentHp / hp.max;

    return (
      <View style={styles.wrapper}>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>{warrior.login} </Text>
          <Text style={styles.level}>[{warrior.level}]</Text>
          {showInfo && (
            <IconButton onPress={() => appStore.toggleWarriorInfoModal(warrior)}>
              <Icon size={14} name="info" />
            </IconButton>
          )}
        </View>
        <View style={styles.hpWrapper}>
          <View style={[styles.hp, { width: `${hpReady * 100}%` }]} />
        </View>
      </View>
    );
  }
}
