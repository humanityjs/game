import db from '../src/lib/db';

import { updateFeature } from '../src/lib/warrior-utils';

function mapIds(items) {
  const result = {};

  items.forEach((item) => {
    result[item.id] = item;
  });

  return result;
}

const items = {
  tableExperience: { data: require('./bundles/table-experiences.json') },
  islands: { data: require('./bundles/islands.json') },
  skills: { data: require('./bundles/skills.json') },
  things: { data: require('./bundles/things.json') },
  warriors: { data: require('./bundles/warriors.json') },
  combats: { data: require('./bundles/combats.json') },
};

const initData = {
  skills: items.skills.data,
  things: items.things.data,
};

items.warriors.data.forEach((item) => {
  updateFeature(item, initData);
});

Object.keys(items).forEach(async (key) => {
  const ref = db().child(key);
  await ref.remove();
  console.log('removed');
  await ref.set(mapIds(items[key].data));
  console.log('inserted');
});
