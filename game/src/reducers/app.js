import * as types from '../constants/types';

const initialState = {
  loggedIn: false,
  loggedData: null,
  initData: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGGED_IN:
      return { loggedIn: true, loggedData: action.data };
    case types.LOGGED_IN_FAIL:
      return { ...state, errorMessage: action.error.message };
    case types.INIT_DATA_FETCHED:
      return { ...state, initData: action.data };
    default:
      return state;
  }
};
