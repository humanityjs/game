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
  Login: { screen: LoginScreen },
  Hero: { screen: HeroScreen },
}, {
  headerMode: 'none',
});

const AppWithNavigationState = connect(state => ({
  nav: state.nav,
}))(({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
));

function getCurrentRoute(state) {
  if (state.routes) {
    return getCurrentRoute(state.routes[state.index]);
  }
  return state;
}

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  newState.currentRoute = getCurrentRoute(newState).routeName;
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
