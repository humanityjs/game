// @flow

import { observable, action, computed, toJS } from 'mobx';

import { getHero, saveHero, newCombat } from '../lib/crud-utils';
import { updateFeature, levelUp } from '../lib/hero-utils';

import appStore from './app';

import type { UserType, HeroType, HeroThingType } from '../lib/types';

class Hero {
  @observable hero: HeroType = null;

  @computed
  get undressedThings(): Array<HeroThingType> {
    return this.hero.things.filter(item => !item.dressed);
  }

  @computed
  get dressedThings(): Array<HeroThingType> {
    return this.hero.things.filter(item => item.dressed);
  }

  @action
  async fetch(data: UserType) {
    const hero = await getHero(data.id);

    if (!hero) {
      // hero = data;
      // heroInit(hero);
      // ref.set(hero);
    } else {
      // TODO: firebase is [] ignores so we should add
      if (!hero.things) hero.things = [];
      if (!hero.skills) hero.skills = [];
      if (!hero.complects) hero.complects = [];
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
  async saveGeneral(data: HeroType) {
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

  async addExperience(experience: number, save: boolean = true) {
    this.hero.experience += experience;
    levelUp(this.hero, appStore.initData);
    if (save) await this.save();
  }

  async save() {
    await saveHero(toJS(this.hero));
  }
}

export default new Hero();
