import React, { Component, PropTypes } from 'react';
import SvgUri from 'react-native-svg-uri';
import { connect } from 'react-redux';
import {
  NavigationActions,
} from 'react-navigation';

import {
  StyleSheet,
  View,
} from 'react-native';

import Button from './shared/Button';

import { login } from '../actions/app';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    marginTop: -255,
  },
});

class Login extends Component {
  static propTypes = {
    app: PropTypes.shape(),
  };
  static contextTypes = {
    store: PropTypes.shape(),
  }
  constructor() {
    super();

    this.onLogin = this.onLogin.bind(this);
  }
  componentWillUpdate(nextProps) {
    const { app } = nextProps;
    if (app.loggedIn) {
      const { dispatch } = this.context.store;
      dispatch(NavigationActions.navigate({ routeName: 'Hero' }));
    }
  }
  onLogin() {
    const { dispatch } = this.context.store;
    dispatch(login());
  }
  render() {
    return (
      <View style={styles.container}>
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
          }}
          textStyle={{
            fontSize: 15,
          }}
          onPress={this.onLogin}
        >Sign In with FaceBook</Button>
      </View>
    );
  }
}

export default connect(state => ({ app: state.app }))(Login);
