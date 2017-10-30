import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observe } from 'mobx';

import { StyleSheet, View, ActivityIndicator } from 'react-native';

import Button from './shared/Button';
import Icon from './shared/Icon';

import authStore from '../stores/auth';
import appStore from '../stores/app';
import heroStore from '../stores/hero';
import combatStore from '../stores/combat';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  loginButton: {
    backgroundColor: '#4267B2',
    width: 320,
    height: 60,
    marginTop: 20,
    paddingTop: 18,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

@observer
export default class LoginScreen extends Component {
  constructor() {
    super();

    observe(heroStore, 'hero', () => {
      if (heroStore.hero.combat) {
        observe(combatStore, 'combat', () => {
          appStore.navigate('Combat', 'outer');
        });
        return;
      }
      appStore.navigate('Inner', 'outer');
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: -255, alignItems: 'center' }}>
          <Icon size={192} name="logo" />
          <Button
            style={styles.loginButton}
            textStyle={{
              fontSize: 15,
            }}
            onPress={authStore.login}
          >
            Sign In with FaceBook
          </Button>
        </View>

        {authStore.isLoggedIn && (
          <View style={styles.overlay}>
            <ActivityIndicator style={styles.loading} />
          </View>
        )}
      </View>
    );
  }
}
