import { observable, computed, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import { loginAndFetchData } from '../lib/crud-utils';

import appStore from './app';
import heroStore from './hero';

class Auth {
  @observable user = null;

  constructor() {
    this.login = this.login.bind(this);

    AsyncStorage.getItem('Id')
      .then((id) => {
        if (!id) return;
        this.user = { id };
        this.prepare();
      });
  }
  @computed get isLoggedIn() {
    return Boolean(this.user);
  }

  @action
  async login() {
    const data = await loginAndFetchData();
    await AsyncStorage.setItem('Id', data.id);
    this.user = data;
    await this.prepare();
  }

  async prepare() {
    await appStore.fetchInitData();
    await heroStore.fetch(this.user);
  }

}

export default new Auth();
