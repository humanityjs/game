import React, { Component, PropTypes } from 'react';
import { Provider, connect } from 'react-redux';

import {
  addNavigationHelpers,
  StackNavigator,
} from 'react-navigation';

import configureStore from '../store/configureStore';
import reducer from '../reducers';

import LoginScreen from './LoginScreen';
import HeroScreen from './HeroScreen';

const AppNavigator = StackNavigator({
  Hero: { screen: HeroScreen },
  Login: { screen: LoginScreen },
}, {
  headerMode: 'none',
});

const AppWithNavigationState = connect(state => ({
  nav: state.nav,
}))(({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
));

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};

const store = configureStore({
  nav: navReducer,
  ...reducer,
});

export default class extends Component {
  static childContextTypes = {
    store: PropTypes.shape(),
  }
  getChildContext() {
    return { store };
  }
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
