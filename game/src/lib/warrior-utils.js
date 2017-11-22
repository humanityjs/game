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

import { getIsland, getThing, getSkill, isArm } from './utils';

import { THING_TYPES, THING_NEED_ITEMS, THING_GIVE_ITEMS } from './constants';

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

export function getDressedThings(warrior: WarriorType): Array<WarriorThingType> {
  return warrior.things.filter(item => item.dressed);
}

export function updateFeature(warrior: WarriorType, initData: InitDataType) {
  const { skills, things } = initData;
  const wwarrior = warrior;
  if (!warrior.feature) wwarrior.feature = {};
  const { feature } = warrior;

  feature.strength = warrior.strength;
  feature.dexterity = warrior.dexterity;
  feature.intuition = warrior.intuition;
  feature.health = warrior.health;

  feature.accuracy = 0;
  feature.dodge = 0;
  feature.devastate = 0;
  feature.durability = 0;

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

  feature.blockBreak = 0;
  feature.armorBreak = 0;

  feature.blockCount = warriorConfig.default.blockCount;
  feature.strikeCount = warriorConfig.default.strikeCount;

  const hp = feature.hp
    ? countHp(feature.hp)
    : {
      current: 0,
      max: 0,
      time: new Date().getTime(),
    };

  const capacity = {
    current: 0,
    max: 0,
  };

  feature.hp = 0;
  feature.capacity = 0;

  // Skills
  warrior.skills.forEach((warriorSkill) => {
    getSkill(skills, warriorSkill.skill).features.forEach((skillFeature) => {
      feature[skillFeature.name] += warriorSkill.level * skillFeature.plus;
    });
  });

  // Things
  getDressedThings(warrior).forEach((warriorThing) => {
    const thing = getThing(things, warriorThing.thing);
    THING_GIVE_ITEMS.forEach((attr) => {
      if (!thing[attr]) return;
      feature[attr] += thing[attr];
    });
  });

  warrior.things.forEach((warriorThing) => {
    const thing = getThing(things, warriorThing.thing);
    if (thing.weight) capacity.current += thing.weight;
  });

  // Strike count
  const count = getDressedThings(warrior).filter(warriorThing =>
    isArm(getThing(things, warriorThing.thing).type)).length;

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

    location: {
      island: '0',
      coordinateX: 30,
      coordinateY: 30,
    },

    created: new Date().getTime(),
  });

  levelUp(warrior, appStore.initData.tableExperience);
  updateFeature(warrior, appStore.initData);
}

export function thingAttrValid(attr: string, thing: ThingType, warrior: WarriorType): boolean {
  const key = attr.replace('Need', '');
  const warriorPropValue = key === 'level' ? warrior[key] : warrior.feature[key];
  return thing[attr] === undefined || thing[attr] <= warriorPropValue;
}

export function thingCanBeDressed(warrior: WarriorType, thing: ThingType): boolean {
  return THING_NEED_ITEMS.every(attr => thingAttrValid(attr, thing, warrior));
}

export function getFeatureParam(orig: number, feature: number): string {
  let output = feature;
  if (orig === feature) {
    return output;
  }

  output += ` (${orig}`;

  if (feature > orig) {
    output += '+';
  }

  output += feature - orig;

  output += ')';
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

export function dressUndressThing(
  dress: boolean,
  warriorThingId: string,
  warrior: WarriorType,
  things: Array<ThingType>,
) {
  const warriorThing = warrior.things.find(item => item.id === warriorThingId);

  if (dress) {
    const arms = [];
    const rings = [];
    const elixirs = [];

    const thing = getThing(things, warriorThing.thing);
    getDressedThings(warrior).forEach((item) => {
      const dressedThing = getThing(things, item.thing);
      if (isArm(dressedThing.type, true)) {
        arms.push({
          warriorThing: item,
          thing: dressedThing,
        });
      } else if (dressedThing.type === THING_TYPES.RING) {
        rings.push(item);
      } else if (dressedThing.type === THING_TYPES.ELIXIR) {
        elixirs.push(item);
      }
    });

    if (isArm(thing.type, true)) {
      if (thing.isTwoHands) {
        arms.forEach((item) => {
          item.warriorThing.dressed = false;
        });
      } else if (arms.length === 2 || (arms.length === 1 && arms[0].thing.isTwoHands)) {
        arms[0].warriorThing.dressed = false;
      }
    }
    if (thing.type === THING_TYPES.RING && rings.length === 4) {
      rings[0].dressed = false;
    }
    if (thing.type === THING_TYPES.ELIXIR && elixirs.length === 4) {
      elixirs[0].dressed = false;
    }
  }

  warriorThing.dressed = dress;
}

export function getThingsByType(
  type: string,
  warrior: WarriorType,
  things: Array<ThingType>,
): Array<{ warriorThing: WarrionThingType, thing: ThingType }> {
  const result = [];

  getDressedThings(warrior).forEach((item) => {
    const thing = getThing(things, item.thing);
    if (thing.type === type) {
      result.push({
        warriorThing: item,
        thing,
      });
    }
  });

  return result;
}
