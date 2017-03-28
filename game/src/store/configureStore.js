import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

export default (rootReducer, initialState) => {
  let middleware = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware, createLogger()];
  }

  return createStore(
    combineReducers(rootReducer),
    initialState,
    applyMiddleware(...middleware),
  );
};
