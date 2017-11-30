import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { observable } from 'mobx';
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
export default class Hp extends Component {
  static propTypes = {
    warrior: PropTypes.shape(),
    showInfo: PropTypes.bool,
  };
  @observable currentHp = null;
  constructor(props) {
    super();

    const { current, max, time } = props.warrior.feature.hp;

    this.currentHp = current;
    this.currentTime = time;

    this.maxHp = max;

    this.setHp = this.setHp.bind(this);
  }
  componentDidMount() {
    this.countHp();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.warrior !== undefined) {
      const { current, time } = nextProps.warrior.feature.hp;
      if (time >= this.currentTime) {
        this.currentHp = current;
      }
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

    if (hp.current !== this.currentHp) {
      this.currentHp = hp.current;
      this.currentTime = hp.time;
    }

    if (hp.max === hp.current) {
      clearInterval(this.setHpInterval);
      this.setHpInterval = null;
    }
  }
  countHp() {
    const { warrior } = this.props;
    if (warrior.combat) return;

    if (!this.setHpInterval) {
      this.setHpInterval = setInterval(this.setHp, 1000);
      this.setHp();
    }
  }
  render() {
    const { warrior, showInfo } = this.props;

    const { hp } = warrior.feature;
    const hpReady = this.currentHp / hp.max;

    return (
      <View style={styles.wrapper}>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>{warrior.login} </Text>
          <Text style={styles.level}>[{warrior.level}]</Text>
          {showInfo && (
            <IconButton
              style={{ marginTop: 7, marginLeft: 2 }}
              onPress={() => appStore.toggleWarriorInfoModal(warrior)}
            >
              <Icon size={14} name="info" />
            </IconButton>
          )}
        </View>
        <View style={{ position: 'absolute', right: 0, top: 17 }}>
          <Text style={{ fontSize: 11 }}>
            [{this.currentHp} / {hp.max}]
          </Text>
        </View>
        <View style={styles.hpWrapper}>
          <View style={[styles.hp, { width: `${hpReady * 100}%` }]} />
        </View>
      </View>
    );
  }
}
