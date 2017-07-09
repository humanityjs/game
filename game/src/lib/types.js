/* flow */

type SkillType = {
  id: string,
};

export type ThingType = {
  id: string,
};

type TableExperienceType = {
  id: string,
  level: number,
  experience: number,
  coefficient: number,
  numberOfParameters: number,
  numberOfAbilities: number,
  numberOfSkills: number,
  money: number,
}

export type InitDataType = {
  skills: Array<SkillType>,
  things: Array<ThingType>,
  tableExperience: Array<TableExperienceType>,
};

export type UserType = {
  id: string,
};

export type HeroThingType = {
  id: string,
  thing: string,
  dressed: boolean,
  stabilityAll: number,
  stabilityLeft: number,
};

export type HpType = {
  current: number,
  time: number,
  max: number,
}

export type HeroType = {
  id: string,
  name: string,
  things: Array<HeroThingType>,
  hp: HpType,
  location: {
    island: string,
    coordinateX: number,
    coordinateY: number,
    building: string,
  },
};

export type IslandType = {
  id: string,
};

export type BotType = {
  id: string,
};

type CombatWarriorType = {
  warrior: string,
  team: number,
  isBot: boolean,
  isDead: boolean,
  isQuit: boolean,
};

type CombatLogWarrior = {
  id: string,
  strikes: Array<{
    strike: number,
    block: boolean,
    armorBreak: boolean,
    blockBreak: boolean,
    dodge: boolean,
    devastate: boolean,
    damage: number,
  }>,
  blocks: Array<number>,
  experience: number,
}

type CombatLogType = {
  warriorOne: CombatLogWarrior,
  warriorTwo: CombatLogWarrior,
  isDead: boolean,
  isQuit: boolean,
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
  location: HeroType.location,
  created: Date,
  finished: Date,
};
