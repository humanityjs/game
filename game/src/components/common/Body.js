import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { range } from 'lodash';

import Icon from '../shared/Icon';

import heroStore from '../../stores/hero';
import appStore from '../../stores/app';

import { thingImageRequire, getThing, isArm } from '../../lib/utils';
import { getDressedThings, getThingsByType } from '../../lib/warrior-utils';
import { THING_TYPES } from '../../lib/constants';

const OFFSET = 4;
const WIDTH = 76;
const WWIDTH = 324;
const WHEIGHT = 411;
const RIGHT = WWIDTH - WIDTH - OFFSET;

const ARMS = 'arms';
const ARMS_SHIELD = 'arms-shield';

const styles = StyleSheet.create({
  wrapper: {
    width: WWIDTH,
    height: WHEIGHT,
    backgroundColor: '#EAEAEA',
  },
  block: {
    position: 'absolute',
    backgroundColor: '#F3F3F3',
  },
  topBlock: {
    height: WIDTH,
    width: WIDTH,
    top: OFFSET,
  },
  sideBlock: {
    width: WIDTH,
  },
  [ARMS]: {
    top: WIDTH + OFFSET * 2,
    left: OFFSET,
    height: 100,
  },
  armor: {
    top: WIDTH + OFFSET * 3 + 100,
    left: OFFSET,
    height: 105,
  },
  pants: {
    top: WIDTH + OFFSET * 4 + 100 + 105,
    left: OFFSET,
    height: 110,
  },
  [ARMS_SHIELD]: {
    top: WIDTH + OFFSET * 2,
    left: RIGHT,
    height: 100,
  },
  belt: {
    top: WIDTH + OFFSET * 5 + 100 + 36 * 2,
    left: RIGHT,
    height: 45,
  },
  boots: {
    top: WIDTH + OFFSET * 6 + 100 + 36 * 2 + 45,
    left: RIGHT,
    height: 90,
  },
  rings: {
    position: 'absolute',
    top: WIDTH + OFFSET * 3 + 100,
    left: RIGHT,
  },
  ring: {
    height: 36,
    width: 36,
  },
  elixirs: {
    position: 'absolute',
    top: WHEIGHT - 36 - OFFSET,
    left: OFFSET * 2 + WIDTH,
  },
  elixir: {
    height: 36,
    width: 36,
  },
  icon: {
    marginTop: 2,
    marginLeft: 2,
  },
  slotThing: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function getSlotStyles(type) {
  switch (type) {
    case 'gloves':
      return [styles.topBlock, styles.block, { left: OFFSET }];
    case 'helmet':
      return [styles.topBlock, styles.block, { left: WIDTH + OFFSET * 2 }];
    case 'amulet':
      return [styles.topBlock, styles.block, { left: WIDTH * 2 + OFFSET * 3 }];
    case 'bracer':
      return [styles.topBlock, styles.block, { left: WIDTH * 3 + OFFSET * 4 }];
    case ARMS:
      return [styles.arms, styles.sideBlock, styles.block];
    case 'armor':
      return [styles.armor, styles.sideBlock, styles.block];
    case 'pants':
      return [styles.pants, styles.sideBlock, styles.block];
    case ARMS_SHIELD:
      return [styles[ARMS_SHIELD], styles.sideBlock, styles.block];
    case 'belt':
      return [styles.belt, styles.sideBlock, styles.block];
    case 'boots':
      return [styles.boots, styles.sideBlock, styles.block];
    default:
      return null;
  }
}

function onThingPressHandler(id, thingId, undressEnabled, onThingPress) {
  if (undressEnabled) heroStore.dressUndressThing(false, id);
  if (onThingPress) onThingPress(thingId);
}

function thingImage(warriorThing, thing, onThingPress, undressEnabled) {
  if (warriorThing) {
    const thingImageComp = <Image source={thingImageRequire(thing.image)} />;
    return onThingPress || undressEnabled ? (
      <TouchableOpacity
        onPress={() =>
          onThingPressHandler(warriorThing.id, warriorThing.thing, undressEnabled, onThingPress)
        }
        style={styles.slotThing}
      >
        {thingImageComp}
      </TouchableOpacity>
    ) : (
      <View style={styles.slotThing}>{thingImageComp}</View>
    );
  }

  return null;
}

const Body = observer(({ warrior, undressEnabled, onThingPress }) => {
  const { things } = appStore.initData;
  const dressedThings = getDressedThings(warrior);
  let alreadyArmDressed;

  const rings = getThingsByType(THING_TYPES.RING, warrior, things);
  const elixirs = getThingsByType(THING_TYPES.ELIXIR, warrior, things);
  return (
    <View style={styles.wrapper}>
      <Icon size={305} name="person" style={{ marginTop: 72, marginLeft: 10 }} />
      {[
        'gloves',
        'helmet',
        'amulet',
        'bracer',
        ARMS,
        'armor',
        ARMS_SHIELD,
        'pants',
        'belt',
        'boots',
      ].map((type) => {
        let thing;
        const warriorThing = dressedThings.find((item) => {
          thing = getThing(things, item.thing);
          const isArmResult = isArm(thing.type);
          if (isArmResult && !alreadyArmDressed) alreadyArmDressed = item.id;
          return (
            thing.type === type ||
            (type === ARMS && isArmResult) ||
            (type === ARMS_SHIELD && thing.type === THING_TYPES.SHIELD) ||
            (type === ARMS_SHIELD &&
              isArmResult &&
              alreadyArmDressed &&
              alreadyArmDressed !== item.id)
          );
        });

        return (
          <View key={type} style={getSlotStyles(type)}>
            <Icon size={16} name={type} style={styles.icon} />
            {thingImage(warriorThing, thing, onThingPress, undressEnabled)}
          </View>
        );
      })}

      <View style={styles.rings}>
        {range(4).map((item) => {
          const position = [
            { top: 0, left: 0 },
            { top: 0, left: 40 },
            { top: 40, left: 0 },
            { top: 40, left: 40 },
          ][item];

          const { warriorThing, thing } = rings[item] || {};
          return (
            <View key={item} style={[styles.ring, styles.block, position]}>
              <Icon size={12} name="ring" style={{ marginLeft: 2 }} />
              {thingImage(warriorThing, thing, onThingPress, undressEnabled)}
            </View>
          );
        })}
      </View>
      <View style={styles.elixirs}>
        {range(4).map((item) => {
          const position = [{ left: 0 }, { left: 40 }, { left: 80 }, { left: 120 }][item];

          const { warriorThing, thing } = elixirs[item] || {};
          return (
            <View key={item} style={[styles.elixir, styles.block, position]}>
              <Icon size={12} name="elixir" style={{ marginTop: 2 }} />
              {thingImage(warriorThing, thing, onThingPress, undressEnabled)}
            </View>
          );
        })}
      </View>
    </View>
  );
});

Body.propTypes = {
  warrior: PropTypes.shape({}),
  undressEnabled: PropTypes.bool,
  onThingPress: PropTypes.func,
};

export default Body;
