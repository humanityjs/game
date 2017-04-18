import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';

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
    top: WIDTH + (OFFSET * 2),
    left: OFFSET,
    height: 100,
  },
  armor: {
    top: WIDTH + (OFFSET * 3) + 100,
    left: OFFSET,
    height: 105,
  },
  pents: {
    top: WIDTH + (OFFSET * 4) + 100 + 105,
    left: OFFSET,
    height: 110,
  },
  shield: {
    top: WIDTH + (OFFSET * 2),
    left: RIGHT,
    height: 100,
  },
  belt: {
    top: WIDTH + (OFFSET * 5) + 100 + (36 * 2),
    left: RIGHT,
    height: 45,
  },
  boots: {
    top: WIDTH + (OFFSET * 6) + 100 + (36 * 2) + 45,
    left: RIGHT,
    height: 90,
  },
  rings: {
    position: 'absolute',
    top: WIDTH + (OFFSET * 3) + 100,
    left: RIGHT,
  },
  ring: {
    height: 36,
    width: 36,
  },
  elixirs: {
    position: 'absolute',
    top: WHEIGHT - 36 - OFFSET,
    left: (OFFSET * 2) + WIDTH,
  },
  elixir: {
    height: 36,
    width: 36,
  },
  icon: {
    marginTop: 2,
    marginLeft: 2,
  },
});

export default () => (
  <View style={styles.wrapper}>

    <View style={[styles.topBlock, styles.block, { left: OFFSET }]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/gloves.svg')}
        style={styles.icon}
      />
    </View>
    <View style={[styles.topBlock, styles.block, { left: WIDTH + (OFFSET * 2) }]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/helmet.svg')}
        style={styles.icon}
      />
    </View>
    <View style={[styles.topBlock, styles.block, { left: (WIDTH * 2) + (OFFSET * 3) }]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/amulet.svg')}
        style={styles.icon}
      />
    </View>
    <View style={[styles.topBlock, styles.block, { left: (WIDTH * 3) + (OFFSET * 4) }]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/bracer.svg')}
        style={styles.icon}
      />
    </View>

    <View style={[styles.sword, styles.sideBlock, styles.block]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/sword.svg')}
        style={styles.icon}
      />
    </View>
    <View style={[styles.armor, styles.sideBlock, styles.block]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/armor.svg')}
        style={styles.icon}
      />
    </View>
    <View style={[styles.pents, styles.sideBlock, styles.block]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/pants.svg')}
        style={styles.icon}
      />
    </View>

    <View style={[styles.shield, styles.sideBlock, styles.block]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/shield.svg')}
        style={{ marginTop: 4, marginLeft: 2 }}
      />
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/sword.svg')}
        style={{ marginTop: -18 }}
      />
    </View>
    <View style={styles.rings}>
      <View style={[styles.ring, styles.block, { top: 0, left: 0 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/ring.svg')}
          style={{ marginLeft: 2 }}
        />
      </View>
      <View style={[styles.ring, styles.block, { top: 0, left: 40 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/ring.svg')}
          style={{ marginLeft: 2 }}
        />
      </View>
      <View style={[styles.ring, styles.block, { top: 40, left: 0 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/ring.svg')}
          style={{ marginLeft: 2 }}
        />
      </View>
      <View style={[styles.ring, styles.block, { top: 40, left: 40 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/ring.svg')}
          style={{ marginLeft: 2 }}
        />
      </View>
    </View>
    <View style={[styles.belt, styles.sideBlock, styles.block]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/belt.svg')}
        style={{ marginLeft: 2 }}
      />
    </View>
    <View style={[styles.boots, styles.sideBlock, styles.block]}>
      <SvgUri
        width="16"
        height="16"
        source={require('../assets/images/boots.svg')}
        style={styles.icon}
      />
    </View>

    <View style={styles.elixirs}>
      <View style={[styles.elixir, styles.block, { left: 0 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/elixir.svg')}
          style={{ marginTop: 2 }}
        />
      </View>
      <View style={[styles.elixir, styles.block, { left: 40 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/elixir.svg')}
          style={{ marginTop: 2 }}
        />
      </View>
      <View style={[styles.elixir, styles.block, { left: 80 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/elixir.svg')}
          style={{ marginTop: 2 }}
        />
      </View>
      <View style={[styles.elixir, styles.block, { left: 120 }]}>
        <SvgUri
          width="12"
          height="12"
          source={require('../assets/images/elixir.svg')}
          style={{ marginTop: 2 }}
        />
      </View>
    </View>
    <SvgUri
      width="305"
      height="305"
      source={require('../assets/images/person.svg')}
      style={{ marginTop: 72, marginLeft: 10 }}
    />
  </View>
);
