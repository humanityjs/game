import { observable, action, toJS } from 'mobx';

import type { CombatType } from '../lib/types';

import appStore from './app';
import heroStore from './hero';

import { getCombat, saveCombat } from '../lib/api-calls';

import { attack } from '../lib/combat-utils';

class Combat {
  @observable combat: CombatType;

  @action
  async fetch(id) {
    this.combat = await getCombat(id, heroStore.hero);
  }

  @action
  async attack(warriorId: string, strikes: Array<number>, blocks: Array<number>) {
    await attack(this.combat, heroStore.hero, appStore.initData, warriorId, strikes, blocks);
    await this.save();
  }

  async save() {
    await saveCombat(toJS(this.combat));
  }
}

export default new Combat();
