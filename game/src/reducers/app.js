import * as types from '../constants/types';

const initialState = {
  loggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGGED_IN:
      return { loggedIn: true };
    case types.LOGGED_IN_FAIL:
      return { ...state, errorMessage: action.error.message };
    default:
      return state;
  }
};
