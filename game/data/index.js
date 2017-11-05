import db from '../src/lib/db';

const data = [
  { ref: db().child('tableExperience'), data: require('./bundles/table-experiences.json') },
  { ref: db().child('heroImages'), data: require('./bundles/hero-images.json') },
  { ref: db().child('islands'), data: require('./bundles/islands.json') },
  { ref: db().child('skills'), data: require('./bundles/skills.json') },
  { ref: db().child('things'), data: require('./bundles/things.json') },
  { ref: db().child('warriors'), data: require('./bundles/warriors.json') },
  { ref: db().child('combats'), data: require('./bundles/combats.json') },
];

data.forEach(async (item) => {
  await item.ref.remove();
  console.log('removed');
  await item.ref.set(item.data);
  console.log('inserted');
});
