export function countHp(hp) {
  const now = new Date().getTime();
  const delay = 100;

  let { current } = hp;
  const { time, max } = hp;

  if (current === max) {
    return hp;
  }

  current += ((now - time) / 1000) / (delay / max);

  if (current > max) current = max;

  current = parseInt(current, 10);

  return { current, time: new Date().getTime(), max };
}

export function getFeatureParam(orig, feature) {
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

export function thingImageRequire(name) {
  switch (name) {
    case 'gloves.png':
      return require('../assets/things/gloves.png');
    case 'armor.png':
      return require('../assets/things/armor.png');
    case 'helmet.png':
      return require('../assets/things/helmet.png');
    default: return null;
  }
}

export function thingSlotImageRequire(type) {
  switch (type) {
    case 'gloves':
      return require('../assets/images/gloves.svg');
    case 'helmet':
      return require('../assets/images/helmet.svg');
    case 'amulet':
      return require('../assets/images/amulet.svg');
    case 'bracer':
      return require('../assets/images/bracer.svg');
    case 'sword':
      return require('../assets/images/sword.svg');
    case 'armor':
      return require('../assets/images/armor.svg');
    case 'pants':
      return require('../assets/images/pants.svg');
    case 'shield':
      return require('../assets/images/shield.svg');
    case 'belt':
      return require('../assets/images/belt.svg');
    case 'boots':
      return require('../assets/images/boots.svg');
    default: return null;
  }
}

export function getThing(things, id) {
  return things.find(item => item.id === id);
}
