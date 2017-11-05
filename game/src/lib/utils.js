// @flow
import type { ThingType, IslandType, TableExperienceType, WarriorType } from './types';

export function thingImageRequire(name: string) {
  switch (name) {
    case 'gloves.png':
      return require('../assets/things/gloves.png');
    case 'armor.png':
      return require('../assets/things/armor.png');
    case 'helmet.png':
      return require('../assets/things/helmet.png');
    default:
      return null;
  }
}

export function islandImageRequire(name: string) {
  switch (name) {
    case '1.png':
      return require('../assets/islands/1.png');
    default:
      return null;
  }
}

export function arrayContains(haystack: Array<Array<number>>, needle: Array<number>): boolean {
  for (let i = 0; i < haystack.length; i += 1) {
    if (needle.length === haystack[i].length) {
      const current = haystack[i];
      let j;
      for (j = 0; j < needle.length && needle[j] === current[j]; j += 1);
      if (j === needle.length) return true;
    }
  }
  return false;
}

export function getMapMargin(
  x: number,
  y: number,
  mapDimensions: { width: number, height: number },
  islandDimensions: { width: number, height: number },
): { left: number, top: number } {
  // 5, 3
  // [[],[],[],  [],[]]
  // [[],[],[], [],[]]
  // [[], [],[],[], []]
  // [[],[], [],[],[]]
  // [[],[],  [],[],[]]

  // 1 - 3 / 2 = -0.5
  // 2 - 3 / 2 = 0.5
  // 3 - 3 / 2 = 1.5 | 3.5 < 3 false
  // 4 - 3 / 2 = 2.5 | 2.5 < 3 true
  // 5 - 3 / 2 = 3.5 | 1.5 < 3 true

  // 6, 3
  // [[],[],[],  [],[],[]]
  // [[],[],[], [],[],[]]
  // [[], [],[],[], [],[]]
  // [[],[], [],[],[], []]
  // [[],[],[], [],[],[]]
  // [[],[],[], [],[],[]]

  // 1 - 3 / 2 = -0.5
  // 2 - 3 / 2 = 0.5
  // 3 - 3 / 2 = 1.5 | 4.5 < 3 false
  // 4 - 3 / 2 = 2.5 | 3.5 < 3 false
  // 5 - 3 / 2 = 3.5 | 2.5 < 3 true
  // 6 - 3 / 2 = 4.5 | 1.5 < 3 true

  // 6, 4
  // [[],[],[],[]  [],[]]
  // [[],[],[],[], [],[]]
  // [[], [],[],[],[], []]
  // [[],[], [],[],[],[]]
  // [[],[], [],[],[],[]]
  // [[],[], [],[],[],[]]

  // 1 - 4 / 2 = -1
  // 2 - 4 / 2 = 0
  // 3 - 4 / 2 = 1 | 5 < 4 false
  // 4 - 4 / 2 = 2 | 4 < 4 false
  // 5 - 4 / 2 = 3 | 3 < 4 true
  // 6 - 4 / 2 = 4 | 2 < 4 true

  const widthDivided = mapDimensions.width / 2;
  const heightDivided = mapDimensions.height / 2;
  const mapMargin = {
    left: x - widthDivided,
    top: y - heightDivided,
  };

  if (Math.floor(mapMargin.left) <= 0) {
    mapMargin.left = 0;
  } else if (islandDimensions.width - mapMargin.left <= mapDimensions.width) {
    mapMargin.left = islandDimensions.width - mapDimensions.width;
  }

  if (Math.floor(mapMargin.top) <= 0) {
    mapMargin.top = 0;
  } else if (islandDimensions.height - mapMargin.top <= mapDimensions.height) {
    mapMargin.top = islandDimensions.height - mapDimensions.height;
  }

  return mapMargin;
}

export function getThing(things: Array<ThingType>, id: string): ThingType {
  return things.find(item => item.id === id);
}

export function getIsland(islands: Array<IslandType>, id: string): IslandType {
  return islands.find(item => item.id === id);
}

export function mapObjToArray(obj: {}): Array<any> {
  return Object.keys(obj).map(key => ({ id: key, ...obj[key] }));
}

export function getTableExperienceItem(
  tableExperience: Array<TableExperienceType>,
  warrior: WarriorType,
): TableExperienceType {
  return tableExperience.find(item => item.level > warrior.level);
}
