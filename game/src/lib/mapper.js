export function mapCombat(combat) {
  const ccombat = combat;
  const { warriors } = ccombat;

  if (Array.isArray(warriors)) {
    ccombat.warriors = {};

    warriors.forEach((item) => {
      delete item._warrior;
      ccombat.warriors[item.warrior] = item;
    });
  } else {
    ccombat.warriors = [];

    ccombat.warriors = Object.keys(warriors).map(key => warriors[key]);
  }

  return ccombat;
}
