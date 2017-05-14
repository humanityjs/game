/* flow */

type SkillType = {
  id: string,
};

export type ThingType = {
  id: string,
};

type TableExperienceType = {
  id: string,
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
};

export type IslandType = {
  id: string,
};

export type BotType = {
  id: string,
};
