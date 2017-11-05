// @flow

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import db from './db';

import type {
  WarriorType,
  SkillType,
  ThingType,
  TableExperienceType,
  IslandType,
  CombatType,
} from './types';

import { mapObjToArray } from './utils';
import { countHp } from './warrior-utils';

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
  // $FlowFixMe
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
  const skills = await db()
    .child('skills')
    .once('value');
  // $FlowFixMe
  return skills.val();
}

export async function getThings(): Array<ThingType> {
  const things = await db()
    .child('things')
    .once('value');
  // $FlowFixMe
  return things.val();
}

export async function getIslands(): Array<IslandType> {
  const islands = await db()
    .child('islands')
    .once('value');
  // $FlowFixMe
  return islands.val();
}

export async function getTableExperience(): Array<TableExperienceType> {
  const tableExperience = await db()
    .child('tableExperience')
    .once('value');
  // $FlowFixMe
  return tableExperience.val();
}

export async function getWarrior(id: string): WarriorType {
  const warrior = await db()
    .child('warriors')
    .child(id)
    .once('value');
  return warrior.val();
}

export async function saveWarrior(warrior: WarriorType) {
  await db()
    .child('warriors')
    .child(warrior.id)
    .update(warrior);
}

export async function getBotsOnIsland(x: number, y: number): Array<WarriorType> {
  const warriorsRef = await db()
    .child('warriors')
    .orderByChild('location/coordinateX')
    .equalTo(x)
    .once('value');

  const warriors = warriorsRef.val();

  // $FlowFixMe
  return !warriors
    ? []
    : mapObjToArray(warriors).filter(item => item.isBot && item.location.coordinateY === y);
}

export async function newCombat(combat: CombatType, warrior: WarriorType) {
  const combatRef = await db()
    .child('combats')
    .push({
      injury: COMBAT_INJURY_MIDDLE,
      timeout: COMBAT_TIMEOUT_LOW,
      type: COMBAT_TYPE_TERRITORIAL,
      status: COMBAT_STATUS_FIGHT,
      created: new Date().getTime(),
      ...combat,
    });

  // eslint-disable-next-line
  for (const item of combat.warriors) {
    let itemWarrior;
    if (warrior.id === item.warrior) {
      itemWarrior = warrior;
    } else {
      itemWarrior = await getWarrior(item.warrior);
    }
    itemWarrior.combat = combatRef.key;
    itemWarrior.feature.hp = countHp(itemWarrior.feature.hp);
    await saveWarrior(itemWarrior);
  }
}

export async function saveCombat(combat: CombatType) {
  await db()
    .child('combats')
    .child(combat.id)
    .update(combat);
}

export async function getCombat(id: string, warrior: WarriorType): CombatType {
  let combat = await db()
    .child('combats')
    .child(id)
    .once('value');
  combat = combat.val();

  if (!combat.logs) combat.logs = [];

  combat.id = id;

  // eslint-disable-next-line
  for (const item of combat.warriors) {
    if (item.warrior === warrior.id) {
      item._warrior = warrior;
    } else {
      item._warrior = await getWarrior(item.warrior);
    }
  }

  return combat;
}
