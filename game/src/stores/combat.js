import { observable, action, toJS } from 'mobx';
import { random, range } from 'lodash';

import type { CombatType } from '../lib/types';

import appStore from './app';
import heroStore from './hero';

import { getActiveHeroCombat, saveCombat } from '../lib/crud-utils';

import config from '../lib/config';

import { isAllDead, getBlockItems, findCombatWarrior } from '../lib/utils';

class Combat {
  @observable combat: CombatType;

  @action
  async fetch() {
    this.combat = await getActiveHeroCombat(heroStore.hero.id);
  }

  @action
  async attack(warriorId: string, strikes: Array<number>, blocks: Array<number>) {
    const { hero } = heroStore;

    const warrior = findCombatWarrior(this.combat, warriorId)._warrior;

    const tableExperienceItem = appStore.initData.tableExperience
      .find(item => item.experience > hero.experience);

    // dodge уворот
    // accuracy точность
    // devastate крит
    // durability

    const deadWarriors = [];

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
        setBlocks = getBlockItems(random(0, 4), warrior.feature.blockCount);
        attackWarrior = hero;
        blockWarrior = warrior;
      } else {
        setStrikes = range(warrior.feature.strikeCount)
          .map(() => random(0, 4));
        setBlocks = blocks;

        attackWarrior = warrior;
        blockWarrior = hero;
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

        let protection;
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
          strikeDamage =
          damage - damage * (protection / config.combatRange.damage / 100.0);
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
            currentHp -= strikeDamage;

            if (currentHp <= 0) {
              currentHp = 0;
              const blockCombatWarrior = findCombatWarrior(this.combat, blockWarrior.id);
              blockCombatWarrior.isDead = true;
              deadWarriors.push(blockCombatWarrior);
            }

            blockWarrior.feature.hp.current = currentHp;
          }
        }

        damageBamp += strikeDamage;

        strikesLog.push({
          strike,
          block,
          armorBreak,
          blockBreak,
          dodge,
          devastate,
          damage: strikeDamage,
        });
      });

      log[`warrior${teamOne ? 'One' : 'Two'}`] = {
        warrior: attackWarrior.id,
        strikes: strikesLog,
        blocks,
        damage: damageBamp,
        experience: tableExperienceItem.coefficient * damageBamp,
      };
    });

    this.combat.logs.push(log);

    deadWarriors.forEach(({ team, warrior }) => {
      this.combat.logs.push({
        warrior,
        isDead: true,
        created: new Date().getTime(),
      });
    });

    let winTeam;
    if (isAllDead(this.combat, 1)) {
      winTeam = 1;
    } else if (isAllDead(this.combat, 2)) {
      winTeam = 2;
    }

    if (winTeam) {
      this.combat.winTeam = winTeam;
      this.combat.finished = new Date().getTime();

      this.combat.warriors.forEach((warrior) => {
        if (warrior.isBot) {
          warrior.isQuit = true;
          this.combat.logs.push({
            warrior: warrior.warrior,
            isQuit: true,
          });
        }
      });

      this.combat.status = 'afterfight';
    }

    await this.save();
  }

  async quit() {
    const { hero } = heroStore;
    this.combat.logs.push({
      warrior: hero.id,
      isQuit: true,
    });
    const combatWarrior = this.combat.warriors.find(item => item.warrior === hero.id);
    combatWarrior.isQuit = true;

    if (!this.combat.warriors.some(item => item.warrior.isOut)) {
      this.combat.status = 'past';
    }

    await this.save();
    this.combat = null;
  }

  async save() {
    await saveCombat(toJS(this.combat));
  }
}

export default new Combat();
