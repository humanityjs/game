import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Text from './shared/Text';

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
    width: 50,
    height: 5,
    backgroundColor: '#FF8080',
  },
});

export default class extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>ButuzGOL </Text>
          <Text style={styles.level}>[10]</Text>
        </View>
        <View style={styles.hpWrapper}>
          <View style={styles.hp} />
        </View>
      </View>
    );
  }
}
