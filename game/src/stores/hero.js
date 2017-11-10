// @flow

import { observable, action, computed, toJS } from 'mobx';

import { getWarrior, saveWarrior, newCombat } from '../lib/api-calls';
import { updateFeature, levelUp, getDrassedThings } from '../lib/warrior-utils';
import { getExperience, outFromCombat } from '../lib/combat-utils';

import appStore from './app';
import combatStore from './combat';

import type { UserType, WarriorType, HeroThingType } from '../lib/types';

class Hero {
  @observable hero: WarriorType = null;

  @computed
  get undressedThings(): Array<HeroThingType> {
    return this.hero.things.filter(item => !item.dressed);
  }

  @computed
  get dressedThings(): Array<HeroThingType> {
    return getDrassedThings(this.hero);
  }

  @action
  async fetch(data: UserType) {
    const hero = await getWarrior(data.id);

    if (!hero) {
      // hero = data;
      // heroInit(hero);
      // ref.set(hero);
    } else {
      // TODO: firebase is [] ignores so we should add
      if (!hero.things) hero.things = [];
      if (!hero.skills) hero.skills = [];
    }

    this.hero = hero;
  }

  @action
  async increaseParameter(name: string) {
    this.hero[name] += 1;
    this.hero.numberOfParameters -= 1;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async increaseAbility(name: string) {
    this.hero[name] += 1;
    this.hero.numberOfAbilities -= 1;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async increaseSkill(id: string) {
    let heroSkill = this.hero.skills.find(item => item.skill === id);

    if (!heroSkill) {
      this.hero.skills.push({
        skill: id,
        level: 0,
      });
      heroSkill = this.hero.skills[this.hero.skills.length - 1];
    }

    heroSkill.level += 1;
    this.hero.numberOfSkills -= 1;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async removeThing(id: string) {
    const index = this.hero.things.findIndex(item => item.id === id);
    this.hero.things.splice(index, 1);
    await this.save();
  }

  @action
  async dressUndressThing(dress: boolean, id: string) {
    const heroThing = this.hero.things.find(item => item.id === id);
    heroThing.dressed = dress;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async undressThings() {
    this.hero.things.forEach((item) => {
      const iitem = item;
      iitem.dressed = false;
    });
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async saveGeneral(data: WarriorType) {
    Object.assign(this.hero, data);
    await this.save();
  }

  @action
  async moveOnIsland(x: number, y: number) {
    this.hero.location.coordinateX = x;
    this.hero.location.coordinateY = y;
    await this.save();
  }

  @action
  async putInCombat(id: string) {
    const combatData = {
      location: this.hero.location,
      warriors: [
        {
          warrior: this.hero.id,
          team: 1,
        },
        {
          warrior: id,
          isBot: true,
          team: 2,
        },
      ],
    };

    await newCombat(combatData, this.hero);
  }

  @action
  async quit() {
    const { combat } = combatStore;

    const combatWarrior = combat.warriors.find(item => item.warrior === this.hero.id);

    await this.addExperience(getExperience(combat, this.hero), false);
    await outFromCombat(combat, combatWarrior);

    await this.save();

    combatStore.combat = null;
  }

  async addExperience(experience: number, save: boolean = true) {
    this.hero.experience += experience;
    levelUp(this.hero, appStore.initData.tableExperience);
    if (save) await this.save();
  }

  async save() {
    await saveWarrior(toJS(this.hero));
  }
}

export default new Hero();
