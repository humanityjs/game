import React, { Component, PropTypes } from 'react';
import SvgUri from 'react-native-svg-uri';
import { observer } from 'mobx-react';
import { observe } from 'mobx';

import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import Button from './shared/Button';

import authStore from '../stores/auth';
import heroStore from '../stores/hero';

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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

@observer
export default class extends Component {
  static propTypes = {
    navigation: PropTypes.shape(),
  }
  constructor() {
    super();

    observe(heroStore, 'hero', () => {
      this.props.navigation.navigate('Hero');
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: -255, alignItems: 'center' }}>
          <SvgUri
            width="192"
            height="255"
            source={require('../assets/images/logo.svg')}
          />
          <Button
            style={{
              backgroundColor: '#4267B2',
              width: 320,
              height: 60,
              paddingTop: 18,
            }}
            textStyle={{
              fontSize: 15,
            }}
            onPress={authStore.login}
          >Sign In with FaceBook</Button>
        </View>

        {authStore.isLoggedIn &&
          <View style={styles.overlay}>
            <ActivityIndicator style={styles.loading} />
          </View>
        }
      </View>
    );
  }
}
