/* flow */

type TableExperienceType = {
  id: string,
  level: number,
  experience: number,
  coefficient: number,
  numberOfParameters: number,
  numberOfAbilities: number,
  numberOfSkills: number,
  money: number,
};

type SkillFeature = {
  // eslint-disable-next-line
  feature: string, // strength|dexterity|intuition|health|swords|axes|knives|clubs|shields|protectionHead|protectionBreast|protectionBelly|protectionGroin|protectionLegs|damageMin|damageMax|accuracy|dodge|devastate|durability|blockBreak|armorBreak|hp|capacity|strikeCount|blockCount
  plus: number,
};

type SkillType = {
  id: string,
  name: string,
  features: Array<SkillFeature>,
};

export type ThingType = {
  id: string,
  name: string,
  // eslint-disable-next-line
  type: string, // sword|axe|knive|clubs|shield|helmet|armor|belt|pants|bracer|gloves|boots|ring|amulet|elixir
  price: number,
  isArt: boolean,
  isBot: boolean,
  stability: number,
  weight: number,
  image: string,

  levelNeed: number,

  strengthNeed: number,
  dexterityNeed: number,
  intuitionNeed: number,
  healthNeed: number,

  swordsNeed: number,
  axesNeed: number,
  knivesNeed: number,
  clubsNeed: number,
  shieldsNeed: number,

  accuracy: number,
  dodge: number,
  devastate: number,
  durability: number,

  strength: number,
  dexterity: number,
  intuition: number,
  health: number,

  swords: number,
  axes: number,
  knives: number,
  clubs: number,
  shields: number,

  armorBreak: number,
  blockBreak: number,

  damageMin: number,
  damageMax: number,

  protectionBelly: number,
  protectionBreast: number,
  protectionGroin: number,
  protectionHead: number,
  protectionLegs: number,

  hp: number,
  capacity: number,

  strikeCount: number,
  blockCount: number,

  isTwoHands: boolean,
};

export type InitDataType = {
  skills: Array<SkillType>,
  things: Array<ThingType>,
  tableExperience: Array<TableExperienceType>,
};

export type UserType = {
  id: string,
  email: string,
  name: string,
  gender: string, // male|female
};

export type WarriorThingType = {
  id: string,
  thing: string,
  dressed: boolean,
  stabilityAll: number,
  stabilityLeft: number,
};

type WarriorSkillType = {
  level: number,
  skill: string,
};

export type WarriorHpType = {
  current: number,
  time: number,
  max: number,
};

export type WarriorType = {
  id: string,
  login: string,
  things: Array<WarriorThingType>,
  isBot: boolean,
  location: {
    island: string,
    coordinateX: number,
    coordinateY: number,
  },
  experience: number,
  money: number,
  level: number,
  image: string,

  numberOfWins: number,
  numberOfLosses: number,
  numberOfDraws: number,

  strength: number,
  dexterity: number,
  intuition: number,
  health: number,

  swords: number,
  axes: number,
  knives: number,
  clubs: number,
  shields: number,

  numberOfAbilities: number,
  numberOfSkills: number,
  numberOfParameters: number,

  skills: Array<WarriorSkillType>,

  feature: {
    strength: number,
    dexterity: number,
    intuition: number,
    health: number,

    accuracy: number,
    devastate: number,
    dodge: number,
    durability: number,

    swords: number,
    axes: number,
    knives: number,
    clubs: number,
    shields: number,

    protectionBelly: number,
    protectionBreast: number,
    protectionGroin: number,
    protectionHead: number,
    protectionLegs: number,

    damageMax: number,
    damageMin: number,

    blockBreak: number,
    armorBreak: number,

    blockCount: number,
    strikeCount: number,

    hp: WarriorHpType,
    capacity: {
      current: number,
      max: number,
    },
  },
};

export type IslandType = {
  id: string,
  name: string,
  image: string,
  disabledCoordinates: Array<Array<number>>,
};

type CombatWarriorType = {
  warrior: string,
  team: number,
  isDead: boolean,
  isQuit: boolean,
};

export type CombatLogWarriorStrikeType = {
  strike: number,
  block: boolean,
  armorBreak: boolean,
  blockBreak: boolean,
  dodge: boolean,
  devastate: boolean,
  damage: number,
  hp: {
    current: number,
    max: number,
  },
};

type CombatLogWarrior = {
  warrior: string,
  strikes: Array<CombatLogWarriorStrikeType>,
  blocks: Array<number>,
  experience: number,
};

type CombatLogType = {
  warriorOne: CombatLogWarrior,
  warriorTwo: CombatLogWarrior,
  isDead: boolean,
  isQuit: boolean,
  isStarted: boolean,
  isFinished: boolean,
  created: Date,
};

export type CombatType = {
  id: string,
  warriors: Array<CombatWarriorType>,
  logs: Array<CombatLogType>,
  winTeam: number,
  status: string, // wait|fight|afterfight|past
  type: string, // duel|group|chaotic|territorial
  timeOut: number, // 60|120|180
  injury: string, // low|middle|top
  location: WarriorType.location,
  created: Date,
  finished: Date,
};
