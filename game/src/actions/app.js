import { AsyncStorage } from 'react-native';
import * as types from '../constants/types';
import { loginAndFetchData } from '../lib/crud-utils';
import db from '../lib/db';

export const loggedIn = data => ({
  type: types.LOGGED_IN,
  data,
});

export const login = () => (dispatch) => {
  loginAndFetchData()
    .then((data) => {
      AsyncStorage.setItem('Id', data.id)
        .then(() => dispatch(loggedIn(data)));
    });
};

export const initDataFetched = data => ({
  type: types.INIT_DATA_FETCHED,
  data,
});

export const fetchInitData = () => (dispatch) => {
  const initData = {};
  Promise.all([

    db().child('skills').once('value')
      .then(data => (initData.skills = data.val())),
    db().child('tableExperience').once('value')
      .then(data => (initData.tableExperience = data.val())),

  ]).then(() => dispatch(initDataFetched(initData)));
};
