// @flow
import { observable, action } from 'mobx';
import { NavigationActions } from 'react-navigation';

import { getSkills, getTableExperience, getThings, getIslands } from '../lib/api-calls';

import type { InitDataType, WarriorType } from '../lib/types';

class App {
  @observable initData: InitDataType = {};
  @observable overlay: boolean = false;
  @observable loading: boolean = false;
  @observable showWarriorInfoModal: WarriorType = null;
  @observable
  currentNavs = {
    outer: null,
    inner: null,
  };
  navigationRefs = {};
  menuRef: any = null;

  @action
  async fetchInitData() {
    this.initData = {
      skills: await getSkills(),
      tableExperience: await getTableExperience(),
      things: await getThings(),
      islands: await getIslands(),
    };
  }

  @action
  setNavigationRef(ref: any, type: string) {
    if (!ref) return;
    this.navigationRefs[type] = ref;
  }

  @action
  setMenuRef(ref: any) {
    this.menuRef = ref;
  }

  @action
  navigate(name: string, type: string = 'inner', navAction: string = 'navigate') {
    if (name === this.currentNavs[type]) return;

    this.currentNavs[type] = name;

    if (navAction === 'navigate') {
      this.navigationRefs[type]._navigation.navigate(name);
    } else if (navAction === 'reset') {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: name })],
      });
      this.navigationRefs[type]._navigation.dispatch(resetAction);
    }

    if (type === 'outer') {
      this.currentNavs.inner = null;
    }
  }

  @action
  toggleMenu(value: boolean) {
    if (value) {
      this.menuRef.open();
    } else {
      this.menuRef.close();
    }
  }

  @action
  toggleOverlay(value: boolean) {
    this.overlay = value;
  }

  @action
  toggleLoading(value: boolean) {
    this.toggleOverlay(value);
    this.loading = value;
  }

  @action
  toggleWarriorInfoModal(warrior: WarriorType) {
    this.toggleOverlay(Boolean(warrior));
    if (warrior) {
      this.showWarriorInfoModal = warrior;
    } else {
      this.showWarriorInfoModal = null;
    }
  }
}

export default new App();
