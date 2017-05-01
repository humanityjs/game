import { observable, action } from 'mobx';
import { NavigationActions } from 'react-navigation'

import db from '../lib/db';
class App {
  @observable initData = {};
  @observable currentNavs = {
    outer: null,
    inner: null,
  };
  navigationRefs = {};
  menuRef = null;

  @action
  async fetchInitData() {
    const skills = await db().child('skills').once('value');
    const tableExperience = await db().child('tableExperience').once('value');
    const things = await db().child('things').once('value');
    this.initData = {
      skills: skills.val(),
      tableExperience: tableExperience.val(),
      things: things.val(),
    };
  }

  @action
  setNavigationRef(ref, type) {
    this.navigationRefs[type] = ref;
  }

  @action
  setMenuRef(ref) {
    this.menuRef = ref;
  }

  @action
  navigate(name, type = 'inner') {
    if (name === this.currentNavs[type]) return;

    const exists = this.navigationRefs[type]._navigation.state.routes
      .find(item => item.routeName === name);

    if (exists && name === 'Hero') {
      this.navigationRefs[type]._navigation.goBack();
    } else {
      this.navigationRefs[type]._navigation.navigate(name);
    }
    this.currentNavs[type] = name;
  }

  @action
  toggleMenu(value) {
    if (value) {
      this.menuRef.open();
    } else {
      this.menuRef.close();
    }
  }
}


export default new App();
