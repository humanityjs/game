import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { StyleSheet, View, ScrollView } from 'react-native';
import { range } from 'lodash';

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

import Hp from './Hp';
import Body from './Body';

import { getDamage, getBlockItems, getBodyPart, getLogLine } from '../lib/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

@observer
export default class extends Component {
  @observable attacks;
  @observable block;
  constructor() {
    super();

    this.attacks = new Array(heroStore.hero.feature.strikeCount);

    this.onAttack = this.onAttack.bind(this);
    this.onQuit = this.onQuit.bind(this);
  }
  componentDidMount() {
    if (!combatStore.combat) combatStore.fetch();
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

    return (
      <ScrollView style={{ backgroundColor: '#EAEAEA', width: '100%', padding: 20 }}>
        {combat.logs.reverse().map(item =>
          <View key={item.created}>
            <Text>
              {getLogLine(combat, item)}
            </Text>
            <Text>------------</Text>
          </View>,
        )}
      </ScrollView>
    );
  }
  renderBody(warrior) {
    return (
      <View>
        <View>
          <Hp warrior={warrior} />
        </View>
        <View style={{ marginTop: 10 }}>
          <Body warrior={warrior} />
        </View>
      </View>
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

    const renderItem = item =>
      <View key={item.id} style={{ flexDirection: 'row' }}>
        <Text>
          {item.login}
        </Text>
        <Text>
          {' '}[{item.level}]
        </Text>
        <SvgUri width="14" height="14" source={require('../assets/images/info.svg')} />
      </View>;

    function renderWarriors(team) {
      return combat.warriors
        .filter(item => item.team === team)
        .map(item => renderItem(item._warrior));
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

    if (!combat) return null;
    const combatFinished = combat.status === 'afterfight' || combat.status === 'past';

    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center', height: 20 }}>
          <Text>
            Damage {getDamage(combat, heroStore.hero)}
          </Text>
        </View>
        {combatFinished &&
          <View style={{ alignItems: 'center', zIndex: 2 }}>
            <Button onPress={this.onQuit}>Quit</Button>
          </View>}
        <View style={{ marginTop: -20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              {this.renderBody(combat.warriors[0]._warrior)}
            </View>
            {!combatFinished && [
              <View style={{ marginTop: 60 }}>
                {this.renderActions()}
              </View>,
              <View>
                {this.renderBody(combat.warriors[1]._warrior)}
              </View>,
            ]}
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
