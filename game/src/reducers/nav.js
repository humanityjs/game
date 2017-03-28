import { StackNavigator } from 'react-navigation';

const AppNavigator = StackNavigator({
  Login: { screen: LoginSreen },
  Hero: { screen: HeroScreen },
});

export default (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};
