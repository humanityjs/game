import { heroInit, updateFeature } from '../lib/hero-utils';
import * as types from '../constants/types';
import db from '../lib/db';
import { clone } from '../lib/utils';

export const heroFetched = data => ({
  type: types.HERO_FETCHED,
  data,
});

export const fetchHero = data => (dispatch) => {
  const ref = db().child('heroes').child(data.id);

  ref.once('value').then((ddata) => {
    let hero = ddata.val();

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

    dispatch(heroFetched(hero));
  });
};

function save(hero) {
  return db().child('heroes').child(hero.id).set(hero);
}

export const heroChanged = data => ({
  type: types.HERO_FETCHED,
  data,
});

export const increaseParameter = name => (dispatch, getState) => {
  const state = getState();
  const hero = clone(state.hero.hero);
  hero[name] += 1;
  hero.numberOfParameters -= 1;
  updateFeature(hero, state.app.initData);
  save(hero).then(() => dispatch(heroChanged(hero)));
};

export const increaseAbility = name => (dispatch, getState) => {
  const state = getState();
  const hero = clone(state.hero.hero);
  hero[name] += 1;
  hero.numberOfAbilities -= 1;
  updateFeature(hero, state.app.initData);
  save(hero).then(() => dispatch(heroChanged(hero)));
};

export const increaseSkill = id => (dispatch, getState) => {
  const state = getState();
  const hero = clone(state.hero.hero);

  let heroSkill = hero.skills.find(item => item.skill === id);

  if (!heroSkill) {
    hero.skills.push({
      skill: id,
      level: 0,
    });
    heroSkill = hero.skills[hero.skills.length - 1];
  }

  heroSkill.level += 1;

  hero.numberOfSkills -= 1;

  updateFeature(hero, state.app.initData);
  save(hero).then(() => dispatch(heroChanged(hero)));
};
