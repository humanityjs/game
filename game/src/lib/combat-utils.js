// @flow

import { random, range } from 'lodash';

import type {
  CombatType,
  WarriorType,
  CombatLogType,
  CombatWarriorType,
  CombatLogWarriorStrikeType,
  InitDataType,
} from './types';

import { BODY_PARTS, COMBAT_STATUS_AFTER_FIGHT, COMBAT_STATUS_PAST } from './constants';
import { getTableExperienceItem } from './utils';

import { saveWarrior } from '../lib/api-calls';

import config from '../lib/config';

export function getCombatWarrior(combat: CombatType, id: string): CombatWarriorType {
  return combat.warriors.find(item => item.warrior === id);
}

export function isWin(combat: CombatType, warrior: WarriorType): boolean {
  return combat.winTeam === getCombatWarrior(combat, warrior.id).team;
}

export function isDraw(combat: CombatType): boolean {
  return combat.winTeam === -1;
}

export function getBodyPart(index: number): string {
  return BODY_PARTS[index];
}

export function getLogPart(combat: CombatType, logItem: CombatLogType): Array<any> {
  // armorBreak block blockBreak devastate dodge

  // WarriorOne[lvl] text WarriorOne[lvl] (strike) (block)

  // ButuzGOL[0] struck Fog[0] on -5 (all false)

  // break armor (armorBreak)
  // but blocked (block)
  // break block (blockBreak)
  // critical strike (devastate)
  // but dodged (dodge)

  function getWarrior(ccombat: CombatType, id: string): WarriorType {
    return getCombatWarrior(ccombat, id)._warrior;
  }

  function buildWarriorName(warrior: WarriorType): string {
    return warrior.login;
  }

  function build(
    team: number,
    strike: CombatLogWarriorStrikeType,
    llogItem: CombatLogType,
  ): Array<any> {
    const content = [];
    if (strike.armorBreak) content.push('break armor');
    if (strike.block) content.push('but blocked');
    if (strike.blockBreak) content.push('break block');
    if (strike.devastate) content.push('critical strike');
    if (strike.dodge) content.push('but dodged');
    if (!content.length) content.push('strike');

    const attackWarriorKey = team === 1 ? 'warriorOne' : 'warriorTwo';
    const blockWarriorKey = team === 2 ? 'warriorOne' : 'warriorTwo';
    const attackWarrior = getWarrior(combat, llogItem[attackWarriorKey].warrior);
    const blockWarrior = getWarrior(combat, llogItem[blockWarriorKey].warrior);

    const { blocks } = llogItem[blockWarriorKey];

    return [
      { time: logItem.created },
      ' ',
      { [attackWarriorKey]: buildWarriorName(attackWarrior) },
      ' ',
      content.join(', '),
      ' ',
      { [blockWarriorKey]: buildWarriorName(blockWarrior) },
      ' on ',
      { damage: strike.damage },
      ` [${strike.hp.current}/${strike.hp.max}]`,
      ' (',
      { blocks: blocks.map(getBodyPart).join(' ') },
      ', ',
      { strikes: getBodyPart(strike.strike) },
      ')',
    ];
  }

  if (logItem.isDead) {
    const warrior = getWarrior(combat, logItem.warrior);
    return [{ time: logItem.created }, ' ', { warriorOne: buildWarriorName(warrior) }, ' is dead'];
  } else if (logItem.isQuit) {
    const warrior = getWarrior(combat, logItem.warrior);
    return [{ time: logItem.created }, ' ', { warriorTwo: buildWarriorName(warrior) }, ' is quit'];
  }

  return [
    logItem.warriorOne.strikes.map(strike => build(1, strike, logItem)),
    logItem.warriorTwo.strikes.map(strike => build(2, strike, logItem)),
  ];
}

export function isAllDead(combat: CombatType, team: number): boolean {
  return combat.warriors.filter(warrior => warrior.team === team).every(warrior => warrior.isDead);
}

export function getBlockItems(startIndex: number, blockCount: number): Array<number> {
  const amount = BODY_PARTS.length;

  return range(blockCount).map((item) => {
    const mergedIndex = startIndex + item;
    return mergedIndex >= amount ? mergedIndex - amount : mergedIndex;
  });
}

export function getDamage(combat: CombatType, warrior: WarriorType): number {
  let damage = 0;

  combat.logs.filter(item => item.warriorOne).forEach(({ warriorOne, warriorTwo }) => {
    let warriorItem;
    if (warriorOne.warrior === warrior.id) {
      warriorItem = warriorOne;
    } else if (warriorTwo.warrior === warrior.id) {
      warriorItem = warriorTwo;
    }
    if (warriorItem) {
      damage += warriorItem.strikes.reduce((prev, item) => prev + item.damage, 0);
    }
  });

  return damage;
}

export function getExperience(combat: CombatType, warrior: WarriorType): number {
  let experience = 0;

  if (!isWin(combat, warrior) || isDraw(combat)) return experience;

  combat.logs.filter(item => item.warriorOne).forEach(({ warriorOne, warriorTwo }) => {
    let warriorItem;
    if (warriorOne.warrior === warrior.id) {
      warriorItem = warriorOne;
    } else if (warriorTwo.warrior === warrior.id) {
      warriorItem = warriorTwo;
    }
    if (warriorItem) experience += warriorItem.experience;
  });

  return experience;
}

export async function outFromCombat(ccombat: CombatType, wwarrior: CombatWarriorType) {
  const combat = ccombat;
  const warrior = wwarrior;

  warrior.isQuit = true;
  combat.logs.push({
    warrior: warrior.warrior,
    isQuit: true,
    created: new Date().getTime(),
  });

  const warriorPatch = {
    combat: null,
    feature: {
      ...warrior._warrior.feature,
      hp: { ...warrior._warrior.feature.hp, time: new Date().getTime() },
    },
  };

  Object.assign(warrior._warrior, warriorPatch);

  await saveWarrior({
    id: warrior.warrior,
    ...warriorPatch,
  });

  if (!combat.warriors.some(item => item.warrior.isOut)) {
    combat.status = COMBAT_STATUS_PAST;
  }
}

export async function attack(
  ccombat: CombatType,
  warrior: WarriorType,
  initData: InitDataType,
  warriorId: string,
  strikes: Array<number>,
  blocks: Array<number>,
) {
  const combat = ccombat;
  const combatWarrior = getCombatWarrior(combat, warriorId)._warrior;

  const tableExperienceItem = getTableExperienceItem(initData.tableExperience, warrior);

  // dodge уворот
  // accuracy точность
  // devastate крит
  // durability

  const deadWarriors = [];
  const updateHpWarriors = [];

  const log = {
    created: new Date().getTime(),
  };

  range(1, 3).forEach((team) => {
    const teamOne = team === 1;

    let setStrikes;
    let setBlocks;
    let attackWarrior;
    let blockWarrior;
    if (teamOne) {
      setStrikes = strikes;
      setBlocks = getBlockItems(random(0, 4), combatWarrior.feature.blockCount);
      attackWarrior = warrior;
      blockWarrior = combatWarrior;
    } else {
      setStrikes = range(combatWarrior.feature.strikeCount).map(() => random(0, 4));
      setBlocks = blocks;

      attackWarrior = combatWarrior;
      blockWarrior = warrior;
    }

    const strikesLog = [];
    let damageBamp = 0;

    setStrikes.forEach((strike) => {
      const block = setBlocks.includes(strike);

      const dodge = range(attackWarrior.feature.accuracy - blockWarrior.feature.dodge)
        .includes(random(config.combatRange.accuracy));
      const devastate = range(attackWarrior.feature.devastate - blockWarrior.feature.durability)
        .includes(random(config.combatRange.devastate));
      const blockBreak = range(attackWarrior.feature.blockBreak)
        .includes(random(config.combatRange.blockBreak));
      const armorBreak = range(attackWarrior.feature.armorBreak)
        .includes(random(config.combatRange.armorBreak));

      const damage = random(attackWarrior.feature.damageMin, attackWarrior.feature.damageMax);

      let protection = 0;
      switch (strike) {
        case 0:
          protection = blockWarrior.feature.protectionHead;
          break;
        case 1:
          protection = blockWarrior.feature.protectionBreast;
          break;
        case 2:
          protection = blockWarrior.feature.protectionBelly;
          break;
        case 3:
          protection = blockWarrior.feature.protectionGroin;
          break;
        case 4:
          protection = blockWarrior.feature.protectionLegs;
          break;
        default:
      }

      let strikeDamage;
      if (!armorBreak) {
        strikeDamage = damage - damage * (protection / config.combatRange.damage / 100.0);
      } else {
        strikeDamage = damage;
      }

      if (devastate) {
        strikeDamage *= 2;
      }

      if (block && !blockBreak) {
        strikeDamage = 0;
      }

      if (dodge) {
        strikeDamage = 0;
      }

      if (strikeDamage > 0) {
        let currentHp = blockWarrior.feature.hp.current;

        if (currentHp) {
          const blockCombatWarrior = getCombatWarrior(combat, blockWarrior.id);
          currentHp -= strikeDamage;

          if (currentHp <= 0) {
            currentHp = 0;
            blockCombatWarrior.isDead = true;
            deadWarriors.push(blockCombatWarrior);
          }

          blockWarrior.feature.hp.current = currentHp;

          updateHpWarriors.push(blockCombatWarrior);
        }
      }

      damageBamp += strikeDamage;

      const { current, max } = blockWarrior.feature.hp;
      strikesLog.push({
        strike,
        block,
        armorBreak,
        blockBreak,
        dodge,
        devastate,
        damage: strikeDamage,
        hp: {
          current,
          max,
        },
      });
    });

    log[`warrior${teamOne ? 'One' : 'Two'}`] = {
      warrior: attackWarrior.id,
      strikes: strikesLog,
      blocks,
      experience: tableExperienceItem.coefficient * damageBamp,
    };
  });

  combat.logs.push(log);

  // eslint-disable-next-line
  for (const item of updateHpWarriors) {
    await saveWarrior(item.isBot, {
      id: item.warrior,
      feature: { ...item._warrior.feature, hp: item._warrior.feature.hp },
    });
  }

  deadWarriors.forEach((wwarrior) => {
    combat.logs.push({
      warrior: wwarrior.warrior,
      isDead: true,
      created: new Date().getTime(),
    });
  });

  let winTeam;
  const isAllDeadFirstTeam = isAllDead(combat, 1);
  const isAllDeadSecondTeam = isAllDead(combat, 2);
  if (isAllDeadFirstTeam && isAllDeadSecondTeam) {
    winTeam = -1;
  } else if (isAllDeadFirstTeam) {
    winTeam = 2;
  } else if (isAllDeadSecondTeam) {
    winTeam = 1;
  }

  if (winTeam) {
    combat.winTeam = winTeam;
    combat.finished = new Date().getTime();

    // eslint-disable-next-line
    for (const wwarrior of updateHpWarriors) {
      if (wwarrior.isBot) {
        await outFromCombat(combat, wwarrior);
      }
    }

    combat.status = COMBAT_STATUS_AFTER_FIGHT;
  }
}

export function isCombatFinished(combat: CombatType): boolean {
  return combat.status === COMBAT_STATUS_AFTER_FIGHT || combat.status === COMBAT_STATUS_PAST;
}
