import * as types from '../constants/types';

const initialState = {
  hero: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.HERO_FETCHED:
      return { ...state, hero: action.data };
    case types.HERO_CHANGED:
      return { ...state, hero: action.data };
    default:
      return state;
  }
};
