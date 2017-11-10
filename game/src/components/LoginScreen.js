import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleSheet, View, AsyncStorage } from 'react-native';

import Button from './shared/Button';
import Icon from './shared/Icon';

import authStore from '../stores/auth';
import appStore from '../stores/app';
import heroStore from '../stores/hero';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  loginButton: {
    backgroundColor: '#4267B2',
    width: 320,
    height: 60,
    marginTop: 20,
    paddingTop: 18,
  },
});

function postLogin() {
  appStore.toggleLoading(false);
  if (heroStore.hero.combat) {
    appStore.navigate('Combat', 'outer', 'reset');
    return;
  }
  appStore.navigate('Inner', 'outer', 'reset');
}

async function init() {
  const id = await AsyncStorage.getItem('Id');
  if (!id) return;
  appStore.toggleLoading(true);
  await authStore.init();
  postLogin();
}

async function onLogin() {
  appStore.toggleLoading(true);
  await authStore.login();
  postLogin();
}

@observer
export default class LoginScreen extends Component {
  componentDidMount() {
    init();
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
            onPress={onLogin}
          >
            Sign In with FaceBook
          </Button>
        </View>
      </View>
    );
  }
}
