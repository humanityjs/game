// @flow

import config from './config';

import type {
  WarriorHpType,
  WarriorType,
  WarriorThingType,
  IslandType,
  InitDataType,
  TableExperienceType,
  ThingType,
} from './types';

import appStore from '../stores/app';

import { getIsland } from '../lib/utils';

const warriorConfig = config.warrior;

export function countHp(hp: WarriorHpType): WarriorHpType {
  const now = new Date().getTime();
  const delay = 100;

  let { current } = hp;
  const { time, max } = hp;

  if (current === max) {
    return hp;
  }

  current += (now - time) / 1000 / (delay / max);

  if (current > max) current = max;

  current = parseInt(current, 10);

  return { current, time: new Date().getTime(), max };
}

export function updateFeature(warrior: WarriorType, initData: InitDataType) {
  const { skills, things } = initData;
  const { feature } = warrior;

  feature.strength = warrior.strength;
  feature.dexterity = warrior.dexterity;
  feature.intuition = warrior.intuition;
  feature.health = warrior.health;

  feature.swords = warrior.swords;
  feature.axes = warrior.axes;
  feature.knives = warrior.knives;
  feature.clubs = warrior.clubs;
  feature.shields = warrior.shields;

  feature.protectionHead = 0;
  feature.protectionBreast = 0;
  feature.protectionBelly = 0;
  feature.protectionGroin = 0;
  feature.protectionLegs = 0;

  feature.damageMin = 0;
  feature.damageMax = 0;

  feature.accuracy = 0;
  feature.dodge = 0;
  feature.devastate = 0;
  feature.durability = 0;

  feature.blockBreak = 0;
  feature.armorBreak = 0;

  feature.strikeCount = warriorConfig.default.strikeCount;
  feature.blockCount = warriorConfig.default.blockCount;

  const hp = feature.hp
    ? countHp(feature.hp)
    : {
      current: 0,
      max: 0,
      time: new Date().getTime(),
    };
  const capacity = feature.capacity || {
    current: 0,
    max: 0,
  };

  feature.hp = 0;
  feature.capacity = 0;

  // Skills
  warrior.skills.forEach((warriorSkill) => {
    const skill = skills.find(item => item.id === warriorSkill.skill);
    skill.features.forEach((skillFeature) => {
      feature[skillFeature.name] += warriorSkill.level * skillFeature.plus;
    });
  });

  // Things
  warrior.things.filter(item => item.dressed).forEach((warriorThing) => {
    const thing = things.find(item => item.id === warriorThing.id);
    [
      'strengthGive',
      'dexterityGive',
      'intuitionGive',
      'healthGive',
      'swordsGive',
      'axesGive',
      'knivesGive',
      'clubsGive',
      'shieldsGive',

      'damageMin',
      'damageMax',

      'protectionHead',
      'protectionBreast',
      'protectionBelly',
      'protectionGroin',
      'protectionLegs',

      'accuracy',
      'dodge',
      'devastate',
      'durability',

      'blockBreak',
      'armorBreak',

      'hp',
      'capacity',

      'strikeCount',
      'blockCount',
    ].forEach((attr) => {
      if (!thing[attr]) return;
      feature[attr.replace('Give', '')] += thing[attr];
    });
  });

  // Strike count
  const count = warrior.things.filter(item => item.dressed).filter((warriorThing) => {
    const thing = things.find(item => item.id === warriorThing.id);
    return warriorThing.dressed && ['sword', 'axe', 'knive', 'clubs'].indexOf(thing.type) !== -1;
  }).length;

  if (count === 2) feature.strikeCount += 1;

  // Modifiers
  feature.damageMin += feature.strength * warriorConfig.coefficient.damageMin;
  feature.damageMax += feature.strength * warriorConfig.coefficient.damageMax;

  feature.accuracy += feature.dexterity * warriorConfig.coefficient.accuracy;
  feature.dodge += feature.dexterity * warriorConfig.coefficient.accuracy;
  feature.devastate += feature.intuition * warriorConfig.coefficient.devastate;
  feature.durability += feature.intuition * warriorConfig.coefficient.durability;

  feature.hp += feature.health * warriorConfig.coefficient.hp;
  feature.capacity += feature.strength * warriorConfig.coefficient.capacity;

  // Hp
  feature.hp = {
    current: hp.current,
    max: feature.hp,
    time: hp.time,
  };

  // Capacity
  feature.capacity = {
    current: capacity.current,
    max: feature.capacity,
  };
}

export function levelUp(warrior: WarriorType, tableExperience: Array<TableExperienceType>) {
  // eslint-disable-next-line
  const tableExperienceItems = tableExperience.filter(
    item => item.level > warrior.level && item.experience <= warrior.experience);

  if (!tableExperienceItems.length) return;

  tableExperienceItems.forEach((item) => {
    const wwarrior = warrior;
    wwarrior.numberOfAbilities += item.numberOfAbilities;
    wwarrior.numberOfSkills += item.numberOfSkills;
    wwarrior.numberOfParameters += item.numberOfParameters;

    wwarrior.money += item.money;
    wwarrior.level += 1;
  });
}

export function init(warrior: WarriorType) {
  Object.assign(warrior, {
    login: 'Empty',
    level: -1,
    experience: 0,
    money: warriorConfig.default.money,
    moneyArt: warriorConfig.default.moneyArt,
    hp: warriorConfig.default.hp,
    capacity: warriorConfig.default.capacity,

    numberOfWins: 0,
    numberOfLosses: 0,
    numberOfDraws: 0,
    numberOfParameters: 0,
    numberOfAbilities: 0,
    numberOfSkills: 0,

    strength: warriorConfig.default.strength,
    dexterity: warriorConfig.default.dexterity,
    intuition: warriorConfig.default.intuition,
    health: warriorConfig.default.health,

    swords: warriorConfig.default.swords,
    axes: warriorConfig.default.axes,
    knives: warriorConfig.default.knives,
    clubs: warriorConfig.default.clubs,
    shields: warriorConfig.default.shields,

    skills: [],
    things: [],
    complects: [],

    location: {
      island: '0',
      coordinateX: 30,
      coordinateY: 30,
      building: null,
    },

    created: new Date().getTime(),
  });

  levelUp(warrior, appStore.initData.tableExperience);
  updateFeature(warrior, appStore.initData);
}

export function thingCanBeDressed(warrior: WarriorType, thing: ThingType): boolean {
  return (
    (!thing.levelNeed || thing.levelNeed <= warrior.level) &&
    (!thing.strengthNeed || thing.strengthNeed <= warrior.strength) &&
    (!thing.dexterityNeed || thing.dexterityNeed <= warrior.dexterity) &&
    (!thing.intuitionNeed || thing.intuitionNeed <= warrior.intuition) &&
    (!thing.healthNeed || thing.healthNeed <= warrior.health) &&
    (!thing.swordsNeed || thing.swordsNeed <= warrior.swords) &&
    (!thing.axesNeed || thing.axesNeed <= warrior.axes) &&
    (!thing.knivesNeed || thing.knivesNeed <= warrior.knives) &&
    (!thing.clubsNeed || thing.clubsNeed <= warrior.clubs) &&
    (!thing.shieldsNeed || thing.shieldsNeed <= warrior.shields)
  );
}

export function getFeatureParam(orig: number, feature: number): string {
  let output = '';
  if (orig - feature === 0) {
    return output;
  }

  output += ' [';

  if (feature > orig) {
    output += '+';
  }

  output += feature - orig;

  output += ']';
  return output;
}

export function isOnline(): boolean {
  return true;
}

export function getLocation(warrior: WarriorType, islands: Array<IslandType>): string {
  const { location } = warrior;
  const island = getIsland(islands, location.island);
  return `${island.name} ${location.coordinateX}:${location.coordinateY}`;
}

export function getDrassedThings(warrior: WarriorType): Array<WarriorThingType> {
  return warrior.things.filter(item => item.dressed);
}
