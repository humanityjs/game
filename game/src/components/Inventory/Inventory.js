import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { StyleSheet, View, ScrollView, Image, AlertIOS } from 'react-native';
import { capitalize, startCase } from 'lodash';

import Button from '../shared/Button';
import Picker from '../shared/Picker';
import Text from '../shared/Text';

import appStore from '../../stores/app';
import heroStore from '../../stores/hero';

import { thingCanBeDressed, thingAttrValid } from '../../lib/warrior-utils';
import { thingImageRequire, getThing } from '../../lib/utils';

import { THING_NEED_ITEMS, THING_GIVE_ITEMS } from '../../lib/constants';

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

export function renderItem(warrior, warriorThingOrId, index = 0) {
  const isInfo = typeof warriorThingOrId === 'string';
  let warriorThing;
  let id;
  if (isInfo) {
    id = warriorThingOrId;
  } else {
    warriorThing = warriorThingOrId;
    id = warriorThing.thing;
  }
  const thing = getThing(appStore.initData.things, id);

  function rrenderItem(key, value, valid) {
    if (value === undefined || !value) return null;

    return (
      <Text key={key}>
        {key} {valid === false ? <Text style={{ color: '#E85349' }}>{value}</Text> : value}
      </Text>
    );
  }

  const needItems = THING_NEED_ITEMS.map((attr) => {
    const label = capitalize(attr.replace('Need', ''));
    return rrenderItem(label, thing[attr], thingAttrValid(attr, thing, warrior));
  });

  const infoItems = THING_GIVE_ITEMS.map((item) => {
    const label = startCase(item);
    return rrenderItem(label, thing[item] > 0 ? `+${thing[item]}` : null);
  });

  if (thing.isTwoHands) {
    infoItems.push(rrenderItem('Two Hands', 'Yes'));
  }

  return (
    <View key={index + id} style={[styles.itemWrapper, index > 0 && { marginTop: 20 }]}>
      <View>
        <Text style={{ fontSize: 18 }}>{thing.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text>Money {thing.price}</Text>
          <Text style={{ marginLeft: 10 }}>Weight {thing.weight}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ width: 80, alignItems: 'center', marginTop: 5 }}>
            <Image source={thingImageRequire(thing.image)} />
            {!isInfo && (
              <Text style={{ marginTop: 5 }}>
                {warriorThing.stabilityLeft} / {warriorThing.stabilityAll}
              </Text>
            )}
          </View>
          <View style={{ width: 170, marginLeft: 20 }}>
            <Text style={styles.itemTitle}>Requirments</Text>
            <ScrollView style={{ height: 100 }}>{needItems}</ScrollView>
          </View>
          <View>
            <Text style={styles.itemTitle}>Description</Text>
            <ScrollView style={{ height: 100 }}>{infoItems}</ScrollView>
          </View>
        </View>
      </View>
      {!isInfo && (
        <View style={{ top: 40, position: 'absolute', right: 20 }}>
          {thingCanBeDressed(warrior, thing) && (
            <Button
              onPress={() =>
                heroStore.dressUndressThing(true, warriorThing.id, appStore.initData.things)
              }
            >
              DRESS
            </Button>
          )}
          <Button
            onPress={() => {
              AlertIOS.alert('Remove Thing', 'Are you sure ?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => heroStore.removeThing(warriorThing.id) },
              ]);
            }}
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
  pickerRef = null;
  observerNavDisposer = null;
  overlayDisposer = null;
  componentDidMount() {
    const hidePicker = () => {
      this.pickerRef.hidePicker();
    };
    this.observerNavDisposer = observe(appStore.currentNavs, 'inner', hidePicker);
    this.overlayDisposer = observe(appStore, 'overlay', hidePicker);
  }
  componentWillUnmount() {
    this.observerNavDisposer();
    this.overlayDisposer();
  }
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
          ref={(ref) => {
            this.pickerRef = ref;
          }}
          style={{ marginLeft: 20 }}
          data={FILTERS}
          placeholder="FILTER"
          titleText="Select Filter"
          onChange={(value) => {
            this.filter = value;
          }}
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
