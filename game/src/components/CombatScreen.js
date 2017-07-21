import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { StyleSheet, View, ScrollView } from 'react-native';
import { range } from 'lodash';
import moment from 'moment';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import SvgUri from 'react-native-svg-uri';

import Text from './shared/Text';
import Button from './shared/Button';

import appStore from '../stores/app';
import combatStore from '../stores/combat';
import heroStore from '../stores/hero';

import FullBody from './FullBody';

import {
  getDamage,
  getBlockItems,
  getBodyPart,
  getLogPart,
  getExperience,
  isWin,
  isDraw,
} from '../lib/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

@observer
export default class CombatScreen extends Component {
  @observable attacks;
  @observable block;
  constructor() {
    super();

    this.attacks = new Array(heroStore.hero.feature.strikeCount);

    this.onAttack = this.onAttack.bind(this);
    this.onQuit = this.onQuit.bind(this);
  }
  componentDidMount() {
    if (!combatStore.combat) combatStore.fetch(heroStore.hero.combat);
  }
  onAttack() {
    combatStore.attack(
      combatStore.combat.warriors[1]._warrior.id,
      this.attacks,
      getBlockItems(this.block, heroStore.hero.feature.blockCount),
    );
  }
  async onQuit() {
    await combatStore.quit();
    appStore.navigate('Inner', 'outer');
  }
  renderLog() {
    const { combat } = combatStore;

    function renderLine(line) {
      if (typeof line === 'string') {
        return (
          <Text>
            {line}
          </Text>
        );
      } else if (line.time) {
        return (
          <Text>
            [{moment(line.time).format('hh:mm')}]
          </Text>
        );
      } else if (line.warriorOne) {
        return (
          <Text style={{ color: '#1C57FF' }}>
            {line.warriorOne}
          </Text>
        );
      } else if (line.warriorTwo) {
        return (
          <Text style={{ color: '#E85349' }}>
            {line.warriorTwo}
          </Text>
        );
      } else if (line.damage) {
        return (
          <Text style={{ color: '#E0483E', fontWeight: 'bold' }}>
            -{line.damage}
          </Text>
        );
      }

      return (
        <Text>
          {Object.values(line).join(' ')}
        </Text>
      );
    }
    return (
      <ScrollView style={{ backgroundColor: '#EAEAEA', width: '100%', padding: 20 }}>
        {combat.logs.reverse().map((log) => {
          const part = getLogPart(combat, log);
          if (!Array.isArray(part[0])) {
            return (
              <View key={log.created} style={{ marginBottom: 10, flexDirection: 'row' }}>
                {part.map(renderLine)}
              </View>
            );
          }
          return (
            <View style={{ marginBottom: 10 }}>
              {part.map(item => (
                item.map(iitem => (
                  <View style={{ flexDirection: 'row' }}>{iitem.map(renderLine)}</View>
                ))
              ))}
            </View>
          );
        })}
      </ScrollView>
    );
  }
  renderActions() {
    const { hero } = heroStore;

    const bodyPartsLength = 5;

    const attackItems = range(bodyPartsLength).map(item => ({
      label: getBodyPart(item),
      value: item,
    }));
    const blockItems = range(bodyPartsLength).map((item, index) => {
      const label = range(hero.feature.blockCount)
        .map((iindex) => {
          let mergedIndex = index + iindex;
          mergedIndex =
            mergedIndex >= bodyPartsLength ? mergedIndex - bodyPartsLength : mergedIndex;
          return getBodyPart(mergedIndex);
        })
        .join(' & ');
      return { label, value: index };
    });

    const onSelectAttack = (strikeNumber, item) => {
      this.attacks[strikeNumber] = item;
    };

    return (
      <View style={{ backgroundColor: '#EAEAEA', height: 255, width: 280, padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Attack</Text>
            <RadioForm animation style={{ marginTop: 5 }}>
              {attackItems.map(item =>
                <RadioButton labelHorizontal key={item.value}>
                  {range(hero.feature.strikeCount).map(number =>
                    <RadioButtonInput
                      key={number}
                      obj={item}
                      index={item.value + number}
                      isSelected={this.attacks[number] === item.value}
                      onPress={() => onSelectAttack(number, item.value)}
                    />,
                  )}

                  <RadioButtonLabel obj={item} index={item.value} labelHorizontal />
                </RadioButton>,
              )}
            </RadioForm>
          </View>

          <View>
            <Text>Block</Text>
            <RadioForm
              initial={null}
              radio_props={blockItems}
              onPress={value => (this.block = value)}
              style={{ marginTop: 5 }}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 5 }}>
          <Button
            disabled={this.block === undefined || this.attacks.some(item => item === undefined)}
            onPress={this.onAttack}
          >
            GO
          </Button>
        </View>
      </View>
    );
  }
  renderWarriorsInfo() {
    const { combat } = combatStore;

    const renderItem = (item, team) =>
      <View key={item.id} style={{ flexDirection: 'row' }}>
        <Text style={{ color: team === 1 ? '#1C57FF' : '#E85349' }}>
          {item.login}
        </Text>
        <SvgUri width="14" height="14" source={require('../assets/images/info.svg')} />
        <Text>
          [{item.feature.hp.current} / {item.feature.hp.max}]
        </Text>
      </View>;

    function renderWarriors(team) {
      return combat.warriors
        .filter(item => item.team === team)
        .map(item => renderItem(item._warrior, team));
    }

    return (
      <View style={{ flexDirection: 'row' }}>
        {renderWarriors(1)}
        <Text> vs </Text>
        {renderWarriors(2)}
      </View>
    );
  }
  render() {
    const { combat } = combatStore;
    const { hero } = heroStore;

    if (!combat) return null;
    const combatFinished = combat.status === 'afterfight' || combat.status === 'past';

    return (
      <View style={styles.container}>
        <View style={{ position: 'absolute', width: '100%', top: 20, zIndex: 2 }}>
          <View style={{ alignItems: 'center' }}>
            {!combatFinished
              ? <Text>
                  Damage {getDamage(combat, hero)}
              </Text>
              : <Text>
                  Fight is finished.{' '}
                {isWin(combat, hero) ? 'You win.' : isDraw(combat) ? 'Draw.' : 'You loose.'}{' '}
                  Damage {getDamage(combat, hero)}. Expreince {getExperience(combat, hero)}.
                </Text>}
          </View>
          {combatFinished &&
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Button onPress={this.onQuit}>Quit</Button>
            </View>}
        </View>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <FullBody warrior={combat.warriors[0]._warrior} />
            </View>
            {!combatFinished
              ? [
                <View key="actions" style={{ marginTop: 50 }}>
                  {this.renderActions()}
                </View>,
                <View key="warrior-two-bod3y">
                  <FullBody warrior={combat.warriors[1]._warrior} />
                </View>,
              ]
              : <SvgUri
                style={{ marginTop: 60, marginRight: 40 }}
                width="400"
                height="400"
                source={require('../assets/images/dragon.svg')}
              />}
          </View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {this.renderWarriorsInfo()}
          </View>
          <View style={{ height: 226, marginTop: 10 }}>
            {this.renderLog()}
          </View>
        </View>
      </View>
    );
  }
}
