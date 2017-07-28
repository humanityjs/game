export default {
  base: {
    firebase: {
      databaseURL: 'https://game-dev-7995e.firebaseio.com',
      authDomain: 'butuzgol-game.firebaseio.com',
      apiKey: 'AIzaSyDxlqtfV70hd-tC6c7msqYzO1gbZ5jHIM0',
    },
  },
  hero: {
    default: {
      money: 0.0,
      moneyArt: 0.0,
      hp: 30,
      capacity: 30,
      strength: 3,
      dexterity: 3,
      intuition: 3,
      health: 3,
      swords: 0,
      axes: 0,
      knives: 0,
      clubs: 0,
      shields: 0,
      numberOfAbilities: 0,
      numberOfParameters: 0,
      strikeCount: 1,
      blockCount: 2,
    },
    coefficient: {
      damageMin: 2,
      damageMax: 3,

      accuracy: 2,
      dodge: 2.5,
      devastate: 2.5,
      durability: 2,

      hp: 10,

      capacity: 10,
    },
  },
  islandMoveTime: 5,
  combatRange: {
    accuracy: 500,
    devastate: 500,
    blockBreak: 500,
    armorBreak: 500,
    damage: 500,
  },
};
