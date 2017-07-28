// @flow

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

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
import { countHp } from './hero-utils';

import {
  COMBAT_INJURY_MIDDLE,
  COMBAT_STATUS_FIGHT,
  COMBAT_TYPE_TERRITORIAL,
  COMBAT_TIMEOUT_LOW,
} from './constants';

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
    new GraphRequestManager().addRequest(infoRequest).start();
  });
}

export function loginAndFetchData() {
  return login().then((result) => {
    if (result.isCancelled) return null;
    // $FlowFixMe
    return fetchAccessToken().then(rresult => fetchMe(rresult.accessToken));
  });
}

export function logout() {
  return LoginManager.logOut();
}

export async function getSkills(): Array<SkillType> {
  const skills = await db().child('skills').once('value');
  // $FlowFixMe
  return skills.val();
}

export async function getThings(): Array<ThingType> {
  const things = await db().child('things').once('value');
  // $FlowFixMe
  return things.val();
}

export async function getIslands(): Array<IslandType> {
  const islands = await db().child('islands').once('value');
  // $FlowFixMe
  return islands.val();
}

export async function getTableExperience(): Array<TableExperienceType> {
  const tableExperience = await db().child('tableExperience').once('value');
  // $FlowFixMe
  return tableExperience.val();
}

export async function getHero(id: string): HeroType {
  const hero = await db().child('heroes').child(id).once('value');
  return hero.val();
}

export async function getBot(id: string): BotType {
  const hero = await db().child('bots').child(id).once('value');
  return hero.val();
}

async function saveBot(bot: BotType) {
  await db().child('bots').child(bot.id).update(bot);
}

export async function saveHero(hero: HeroType) {
  await db().child('heroes').child(hero.id).update(hero);
}

async function getWarrior(isBot: boolean, id: string): HeroType | BotType {
  const warrior = isBot ? await getBot(id) : await getHero(id);
  return warrior;
}

export async function saveWarrior(isBot: boolean, warrior: HeroType | BotType) {
  if (isBot) {
    await saveBot(warrior);
  } else {
    await saveHero(warrior);
  }
}

export async function getBotsOnIsland(x: number, y: number): Array<BotType> {
  const botsRef = await db()
    .child('bots')
    .orderByChild('location/coordinateX')
    .equalTo(x)
    .once('value');

  const bots = botsRef.val();

  // $FlowFixMe
  return !bots ? [] : mapObjToArray(bots).filter(item => item.location.coordinateY === y);
}

export async function newCombat(combat: CombatType, hero: HeroType) {
  const combatRef = await db().child('combats').push({
    injury: COMBAT_INJURY_MIDDLE,
    timeout: COMBAT_TIMEOUT_LOW,
    type: COMBAT_TYPE_TERRITORIAL,
    status: COMBAT_STATUS_FIGHT,
    created: new Date().getTime(),
    ...combat,
  });

  // eslint-disable-next-line
  for (const item of combat.warriors) {
    let warrior;
    if (hero.id === item.warrior) {
      warrior = hero;
    } else {
      warrior = await getWarrior(item.isBot, item.warrior);
    }
    warrior.combat = combatRef.key;
    warrior.feature.hp = countHp(warrior.feature.hp);
    await saveWarrior(item.isBot, warrior);
  }
}

export async function saveCombat(combat: CombatType) {
  await db().child('combats').child(combat.id).update(combat);
}

export async function getCombat(id: string, hero: HeroType): CombatType {
  let combat = await db().child('combats').child(id).once('value');
  combat = combat.val();

  if (!combat.logs) combat.logs = [];

  combat.id = id;

  // eslint-disable-next-line
  for (const item of combat.warriors) {
    if (item.warrior === hero.id) {
      item._warrior = hero;
    } else {
      item._warrior = await getWarrior(item.isBot, item.warrior);
    }
  }

  return combat;
}
