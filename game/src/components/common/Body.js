import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

import Icon from '../shared/Icon';

import heroStore from '../../stores/hero';
import appStore from '../../stores/app';

import { thingImageRequire, getThing } from '../../lib/utils';
import { getDrassedThings } from '../../lib/warrior-utils';

const OFFSET = 4;
const WIDTH = 76;
const WWIDTH = 324;
const WHEIGHT = 411;
const RIGHT = WWIDTH - WIDTH - OFFSET;

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
  sword: {
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
  shield: {
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
    case 'sword':
      return [styles.sword, styles.sideBlock, styles.block];
    case 'armor':
      return [styles.armor, styles.sideBlock, styles.block];
    case 'pants':
      return [styles.pants, styles.sideBlock, styles.block];
    case 'shield':
      return [styles.shield, styles.sideBlock, styles.block];
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

const Body = observer(({ warrior, undressEnabled, onThingPress }) => (
  <View style={styles.wrapper}>
    <Icon size={305} name="person" style={{ marginTop: 72, marginLeft: 10 }} />
    {[
      'gloves',
      'helmet',
      'amulet',
      'bracer',
      'sword',
      'arms',
      'armor',
      'shield',
      'pants',
      'belt',
      'boots',
    ].map((type) => {
      let thing;
      const warriorThing = getDrassedThings(warrior).find((item) => {
        thing = getThing(appStore.initData.things, item.thing);
        return thing.type === type;
      });

      return (
        <View key={type} style={getSlotStyles(type)}>
          <Icon size={16} name={type} style={styles.icon} />
          {warriorThing ? (
            <TouchableOpacity
              onPress={() =>
                onThingPressHandler(
                  warriorThing.id,
                  warriorThing.thing,
                  undressEnabled,
                  onThingPress,
                )}
              style={styles.slotThing}
            >
              <Image source={thingImageRequire(thing.image)} />
            </TouchableOpacity>
          ) : null}
        </View>
      );
    })}

    <View style={styles.rings}>
      <View style={[styles.ring, styles.block, { top: 0, left: 0 }]}>
        <Icon size={12} name="ring" style={{ marginLeft: 2 }} />
      </View>
      <View style={[styles.ring, styles.block, { top: 0, left: 40 }]}>
        <Icon size={12} name="ring" style={{ marginLeft: 2 }} />
      </View>
      <View style={[styles.ring, styles.block, { top: 40, left: 0 }]}>
        <Icon size={12} name="ring" style={{ marginLeft: 2 }} />
      </View>
      <View style={[styles.ring, styles.block, { top: 40, left: 40 }]}>
        <Icon size={12} name="ring" style={{ marginLeft: 2 }} />
      </View>
    </View>
    <View style={styles.elixirs}>
      <View style={[styles.elixir, styles.block, { left: 0 }]}>
        <Icon size={12} name="elixir" style={{ marginTop: 2 }} />
      </View>
      <View style={[styles.elixir, styles.block, { left: 40 }]}>
        <Icon size={12} name="elixir" style={{ marginTop: 2 }} />
      </View>
      <View style={[styles.elixir, styles.block, { left: 80 }]}>
        <Icon size={12} name="elixir" style={{ marginTop: 2 }} />
      </View>
      <View style={[styles.elixir, styles.block, { left: 120 }]}>
        <Icon size={12} name="elixir" style={{ marginTop: 2 }} />
      </View>
    </View>
  </View>
));

Body.propTypes = {
  warrior: PropTypes.shape({}),
  undressEnabled: PropTypes.bool,
  onThingPress: PropTypes.func,
};

export default Body;
