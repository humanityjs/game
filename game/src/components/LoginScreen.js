import React, { Component, PropTypes } from 'react';
import SvgUri from 'react-native-svg-uri';
import { connect } from 'react-redux';
import {
  NavigationActions,
} from 'react-navigation';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import Button from './shared/Button';

import { login, fetchInitData } from '../actions/app';
import { fetchHero } from '../actions/hero';

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
  state = {
    loading: false,
  }
  componentDidMount() {
    AsyncStorage.getItem('Id')
      .then((id) => {
        if (!id) return;
        this.setState({ loading: true });
        const { dispatch } = this.context.store;
        dispatch(fetchHero({ id }));
        dispatch(fetchInitData());
      });
  }
  shouldComponentUpdate(nextProps) {
    return (nextProps.currentRoute === 'Login');
  }
  componentWillUpdate(nextProps) {
    const { app, hero } = nextProps;

    const { dispatch } = this.context.store;

    if (app.loggedIn && !hero.hero) {
      this.state.loading = true;
      dispatch(fetchHero(app.loggedData));
      dispatch(fetchInitData());
    }
    if (hero.hero && app.initData) {
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
            }}
            textStyle={{
              fontSize: 15,
            }}
            onPress={this.onLogin}
          >Sign In with FaceBook</Button>
        </View>

        {this.state.loading &&
          <View style={styles.overlay}>
            <ActivityIndicator style={styles.loading} />
          </View>
        }
      </View>
    );
  }
}

export default connect(state => ({
  app: state.app,
  hero: state.hero,
  currentRoute: state.nav.currentRoute,
}))(Login);
