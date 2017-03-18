import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';

import Button from './src/components/shared/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
});

export default class Game extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button>Sign In With FaceBook</Button>
      </View>
    );
  }
}

AppRegistry.registerComponent('game', () => Game);
