// @flow
import { observable, action } from 'mobx';

import { getSkills, getTableExperience, getThings, getIslands } from '../lib/crud-utils';

import type { InitDataType, HeroType, BotType } from '../lib/types';

class App {
  @observable initData: InitDataType = {};
  @observable overlay: boolean = false;
  @observable showHeroInfoModal: boolean = false;
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
    this.navigationRefs[type] = ref;
  }

  @action
  setMenuRef(ref: any) {
    this.menuRef = ref;
  }

  @action
  navigate(name: string, type: string = 'inner') {
    if (name === this.currentNavs[type]) return;

    // eslint-disable-next-line
    const exists = this.navigationRefs[type]._navigation.state.routes.find(
      item => item.routeName === name);

    if (exists && name === 'Hero') {
      this.navigationRefs[type]._navigation.goBack('Hero');
    } else {
      this.navigationRefs[type]._navigation.navigate(name);
    }
    this.currentNavs[type] = name;
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
  toggleWarriorInfoModal(warrior: HeroType | BotType, isBot: boolean) {
    this.toggleOverlay(Boolean(warrior));
    if (warrior) {
      this.showHeroInfoModal = {
        warrior,
        isBot,
      };
    } else {
      this.showHeroInfoModal = null;
    }
  }
}

export default new App();
