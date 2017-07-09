// @flow

import { observable, computed, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { loginAndFetchData, logout } from '../lib/crud-utils';
import appStore from './app';
import heroStore from './hero';
import combatStore from './combat';

import type { UserType } from '../lib/types';

class Auth {
  @observable user: UserType = null;

  constructor() {
    AsyncStorage.getItem('Id')
      .then((id) => {
        if (!id) return;
        this.user = { id };
        this.prepare();
      });
  }
  @computed get isLoggedIn(): boolean {
    return Boolean(this.user);
  }

  @action
  async login() {
    const data = await loginAndFetchData();
    await AsyncStorage.setItem('Id', data.id);
    this.user = data;
    await this.prepare();
  }

  @action
  async logout() {
    logout();
    await AsyncStorage.removeItem('Id');
    this.user = null;
  }

  async prepare() {
    await appStore.fetchInitData();
    await heroStore.fetch(this.user);
    await combatStore.fetch(this.user.id);
  }

}

export default new Auth();
