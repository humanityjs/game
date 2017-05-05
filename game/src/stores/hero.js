import { observable, action, computed, toJS } from 'mobx';
import db from '../lib/db';

import { init as heroInit, updateFeature } from '../lib/hero-utils';

import appStore from './app';

class Hero {
  @observable hero = null;

  @computed get undressedThings() {
    return this.hero.things.filter(item => !item.dressed);
  }

  @computed get dressedThings() {
    return this.hero.things.filter(item => item.dressed);
  }

  @action
  async fetch(data) {
    const ref = db().child('heroes').child(data.id);
    let hero = await ref.once('value');
    hero = hero.val();

    if (!hero) {
      hero = data;
      heroInit(hero);
      ref.set(hero);
    } else {
      // TODO: firebase is [] ignores so we should add
      if (!hero.things) hero.things = [];
      if (!hero.skills) hero.skills = [];
      if (!hero.complects) hero.complects = [];
    }

    this.hero = hero;
  }

  @action
  async increaseParameter(name) {
    this.hero[name] += 1;
    this.hero.numberOfParameters -= 1;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async increaseAbility(name) {
    this.hero[name] += 1;
    this.hero.numberOfAbilities -= 1;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async increaseSkill(id) {
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
  async removeThing(id) {
    const index = this.hero.things.findIndex(item => item.id === id);
    this.hero.things.splice(index, 1);
    await this.save();
  }

  @action
  async dressUndressThing(dress, id) {
    const heroThing = this.hero.things.find(item => item.id === id);
    heroThing.dressed = dress;
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action
  async undressThings() {
    this.hero.things.forEach(item => (item.dressed = false));
    updateFeature(this.hero, appStore.initData);
    await this.save();
  }

  @action 
  async saveGeneral(data) {
    Object.assign(this.hero, data);
    await this.save();
  }

  async save() {
    await db().child('heroes').child(this.hero.id).set(toJS(this.hero));
  }
}


export default new Hero();
