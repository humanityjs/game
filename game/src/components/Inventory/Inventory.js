import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { capitalize } from 'lodash';

import Button from '../shared/Button';
import Picker from '../shared/Picker';
import Text from '../shared/Text';

import appStore from '../../stores/app';
import heroStore from '../../stores/hero';

import { thingCanBeDressed } from '../../lib/hero-utils';
import { thingImageRequire, getThing } from '../../lib/utils';

const styles = StyleSheet.create({
  itemWrapper: {
    width: '100%',
    backgroundColor: '#eaeaea',
    padding: 10,
    flexDirection: 'row',
  },
  itemTitle: {
    fontWeight: '400',
    marginBottom: 5,
  },
});

const FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'sword', label: 'SWORD' },
  { key: 'axe', label: 'AXE' },
  { key: 'knive', label: 'KNIVE' },
  { key: 'clubs', label: 'CLUBS' },
  { key: 'shield', label: 'SHIELD' },
  { key: 'helmet', label: 'HELMET' },
  { key: 'kolchuga', label: 'KOLCHUGA' },
  { key: 'armor', label: 'ARMOR' },
  { key: 'belt', label: 'BELT' },
  { key: 'pants', label: 'PANTS' },
  { key: 'treetops', label: 'TREETOPS' },
  { key: 'gloves', label: 'GLOVES' },
  { key: 'boot', label: 'BOOT' },
  { key: 'ring', label: 'RING' },
  { key: 'amulet', label: 'AMULET' },
  { key: 'potion', label: 'POTION' },
  { key: 'elixir', label: 'ELIXIR' },
];

export function renderItem(warrior, heroThingOrId, index = 0) {
  const isInfo = typeof heroThingOrId === 'string';
  let heroThing;
  let id;
  if (isInfo) {
    id = heroThingOrId;
  } else {
    heroThing = heroThingOrId;
    id = heroThing.id;
  }
  const thing = getThing(appStore.initData.things, id);

  function rrenderItem(key, value, safe) {
    if (value === undefined || !value) return null;

    return (
      <Text key={key}>
        {key} {safe === false ? <Text style={{ color: '#E85349' }}>{value}</Text> : value}
      </Text>
    );
  }

  const needItems = [
    'levelNeed',
    'strengthNeed',
    'dexterityNeed',
    'intuitionNeed',
    'healthNeed',
    'swordsNeed',
    'axesNeed',
    'knivesNeed',
    'clubsNeed',
    'shieldsNeed',
  ].map((item) => {
    const key = item.replace('Need', '');
    const label = capitalize(key);

    return rrenderItem(label, thing[item], warrior[key] >= thing[item]);
  });

  const giveItems = [
    'strengthGive',
    'dexterityGive',
    'intuitionGive',
    'healthGive',
    'swordsGive',
    'axesGive',
    'knivesGive',
    'clubsGive',
    'shieldsGive',
    'damageMin',
    'damageMax',
    'protectionHead',
    'protectionBreast',
    'protectionBelly',
    'protectionGroin',
    'protectionLegs',
    'accuracy',
    'dodge',
    'devastate',
    'durability',
    'blockBreak',
    'armorBreak',
    'hp',
    'strikeCount',
    'blockCount',
    'capacity',
    'isTwoHands',
    'timeDuration',
  ].map((item) => {
    const label = capitalize(item.replace('Give', ''));
    return rrenderItem(label, thing[item] > 0 ? `+${thing[item]}` : null);
  });

  return (
    <View key={id} style={[styles.itemWrapper, index > 0 && { marginTop: 20 }]}>
      <View>
        <Text style={{ fontSize: 18 }}>{thing.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text>Money {thing.price}</Text>
          <Text style={{ marginLeft: 10 }}>Capacity {thing.capacity}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ width: 80, alignItems: 'center', marginTop: 5 }}>
            <Image source={thingImageRequire(thing.image)} />
            {!isInfo && (
              <Text style={{ marginTop: 5 }}>
                {heroThing.stabilityLeft} / {heroThing.stabilityAll}
              </Text>
            )}
          </View>
          <View style={{ width: 170, marginLeft: 20 }}>
            <Text style={styles.itemTitle}>Requirments</Text>
            <ScrollView style={{ height: 100 }}>{needItems}</ScrollView>
          </View>
          <View>
            <Text style={styles.itemTitle}>Description</Text>
            <ScrollView style={{ height: 100 }}>{giveItems}</ScrollView>
          </View>
        </View>
      </View>
      {!isInfo && (
        <View style={{ top: 40, position: 'absolute', right: 20 }}>
          {thingCanBeDressed(warrior, thing) && (
            <Button onPress={() => heroStore.dressUndressThing(true, heroThing.id)}>DRESS</Button>
          )}
          <Button
            onPress={() => heroStore.removeThing(heroThing.id)}
            style={{ backgroundColor: '#E85349', marginTop: 10 }}
          >
            REMOVE
          </Button>
        </View>
      )}
    </View>
  );
}

@observer
export default class Inventory extends Component {
  @observable filter = null;
  renderActions() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Button
          disabled={!heroStore.dressedThings.length}
          onPress={() => heroStore.undressThings()}
        >
          UNDRESS
        </Button>
        <Picker
          style={{ marginLeft: 20 }}
          data={FILTERS}
          placeholder="FILTER"
          titleText="Select Filter"
          onChange={value => (this.filter = value)}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderActions()}
        <ScrollView style={{ marginTop: 20 }}>
          {heroStore.undressedThings
            .filter((heroThing) => {
              if (this.filter === null || this.filter === 'all') return true;
              const thing = getThing(appStore.initData.things, heroThing.thing);
              return thing.type === this.filter;
            })
            .map((heroThing, index) => renderItem(heroStore.hero, heroThing, index))}
        </ScrollView>
      </View>
    );
  }
}
