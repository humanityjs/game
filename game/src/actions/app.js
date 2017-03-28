import * as types from '../constants/types';
import { loginAndFetchData } from '../lib/crud-utils';

export const loggedIn = data => ({
  type: types.LOGGED_IN,
  data,
});

export const login = () => (dispatch) => {
  loginAndFetchData()
    .then(data => dispatch(loggedIn(data)));
};
