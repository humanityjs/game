// @flow

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import db from './db';

import type {
  HeroType,
  SkillType,
  ThingType,
  TableExperienceType,
  IslandType,
  BotType,
  CombatType,
} from './types';

import { mapObjToArray } from './utils';

import { mapCombat } from './mapper';

export function login() {
  return LoginManager.logInWithReadPermissions(['public_profile', 'email']);
}

export function fetchAccessToken() {
  return AccessToken.getCurrentAccessToken();
}

export function fetchMe(accessToken: string) {
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: {
          fields: {
            string: 'email,name,gender',
          },
        },
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      },
    );
    new GraphRequestManager()
      .addRequest(infoRequest)
      .start();
  });
}

export function loginAndFetchData() {
  return login()
    .then((result) => {
      if (result.isCancelled) return null;
      return fetchAccessToken()
        .then(rresult => fetchMe(rresult.accessToken));
    });
}

export function logout() {
  return LoginManager.logOut();
}

export async function getSkills(): Array<SkillType> {
  const skills = await db().child('skills').once('value');
  return skills.val();
}

export async function getThings(): Array<ThingType> {
  const things = await db().child('things').once('value');
  return things.val();
}

export async function getIslands(): Array<IslandType> {
  const islands = await db().child('islands').once('value');
  return islands.val();
}

export async function getTableExperience(): Array<TableExperienceType> {
  const tableExperience = await db().child('tableExperience').once('value');
  return tableExperience.val();
}

export async function getHero(id: string): HeroType {
  const hero = await db().child('heroes').child(id).once('value');
  return hero.val();
}

export async function saveHero(hero: HeroType) {
  await db()
    .child('heroes')
    .child(hero.id)
    .set(hero);
}

export async function getBotsOnIsland(x: number, y: number): Array<BotType> {
  const botsRef = await db()
    .child('bots')
    .orderByChild('location/coordinateX')
    .equalTo(x)
    .once('value');

  const bots = botsRef.val();
  if (!bots) return [];

  return mapObjToArray(bots).filter(item => item.location.coordinateY === y);
}

export async function newCombat(combat: CombatType) {
  await db()
    .child('combats')
    .push(Object.assign({
      injury: 'middle',
      timeout: 60,
      type: 'territorial',
      status: 'fight',
      created: new Date(),
    }, mapCombat(combat)));
}

export async function getActiveHeroCombat(id: string): CombatType {
  const combatsRef = await db()
    .child('combats')
    .orderByChild(`warriors/${id}`)
    .once('value');

  const combats = combatsRef.val();
  if (!combats) return null;

  return mapObjToArray(combats)
    .map(mapCombat)
    .find(item => item.status === 'fight');
}
