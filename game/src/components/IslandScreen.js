import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';

import Text from './shared/Text';
import IconButton from './shared/IconButton';

import appStore from '../stores/app';
import heroStore from '../stores/hero';

import { arrayContains, islandImageRequire, getMapMargin, getIsland } from '../lib/utils';

import config from '../lib/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  positionInfo: {
    width: 250,
    backgroundColor: '#EAEAEA',
    height: 42,
    position: 'absolute',
    left: '50%',
    marginLeft: -(250 / 2),
    alignItems: 'center',
  },
  heroesInfo: {
    backgroundColor: '#EAEAEA',
    width: 218,
    height: 40,
    position: 'absolute',
    right: 2,
  },
});

const SQUARE_WIDTH = 20;

const ISLAND_DIMENSIONS = {
  width: 1980 / SQUARE_WIDTH,
  height: 1280 / SQUARE_WIDTH,
};

const MAP_DIMENSIONS = {
  width: 980 / SQUARE_WIDTH, // 1024 // 984
  height: 680 / SQUARE_WIDTH, // 698 // 678
};

@observer
export default class extends Component {
  @observable moveTime = 0;
  moveInterval = null;
  constructor() {
    super();

    this.onCancelMove = this.onCancelMove.bind(this);
  }
  onMove(x, y) {
    const island = getIsland(appStore.initData.islands, heroStore.hero.location.island);
    if (arrayContains(island.disabledCoordinates, [x, y])) return;

    let counter = config.islandMoveTime;

    this.moveTime = counter;

    this.moveInterval = setInterval(() => {
      counter -= 1;

      this.moveTime = counter;

      if (counter === 0) {
        clearInterval(this.moveInterval);
        heroStore.moveOnIsland(x, y);
      }
    }, 1000);
  }
  onCancelMove() {
    clearInterval(this.moveInterval);
    this.moveTime = 0;
  }
  render() {
    const { hero } = heroStore;
    const { coordinateX, coordinateY } = hero.location;
    const island = getIsland(appStore.initData.islands, hero.location.island);

    const mapMargin = getMapMargin(coordinateX, coordinateY, MAP_DIMENSIONS, ISLAND_DIMENSIONS);

    const mapOffset = {
      top: Math.floor(mapMargin.top) * SQUARE_WIDTH,
      left: Math.floor(mapMargin.left) * SQUARE_WIDTH,
    };

    const squares = [];

    /* eslint-disable no-continue */
    for (let x = coordinateX - 1; x < (coordinateX - 1) + 3; x += 1) {
      if (x < 0 || x > ISLAND_DIMENSIONS.width) continue;
      for (let y = coordinateY - 1; y < (coordinateY - 1) + 3; y += 1) {
        if (y < 0 || y > ISLAND_DIMENSIONS.height) continue;
        if (x === coordinateX && y === coordinateY) continue;

        squares.push(
          <TouchableOpacity
            key={`${x}-${y}`}
            style={{
              backgroundColor: 'white',
              opacity: 0.2,
              position: 'absolute',
              top: (y * SQUARE_WIDTH) - mapOffset.top,
              left: (x * SQUARE_WIDTH) - mapOffset.left,
              width: SQUARE_WIDTH,
              height: SQUARE_WIDTH,
            }}
            onPress={() => this.onMove(x, y)}
            title={`X: ${x} Y: ${y}`}
          />,
        );
      }
    }
    /* eslint-enable no-continue */

    return (
      <View style={styles.container}>
        <View
          style={{
            height: MAP_DIMENSIONS.height * SQUARE_WIDTH,
            width: MAP_DIMENSIONS.width * SQUARE_WIDTH,
            overflow: 'hidden',
            marginLeft: 2,
          }}
        >
          <Image
            style={{
              marginTop: -mapOffset.top,
              marginLeft: -mapOffset.left,
            }}
            source={islandImageRequire(island.image)}
          />
          {squares}
          <SvgUri
            width="24"
            height="24"
            source={require('../assets/images/person.svg')}
            style={{
              position: 'absolute',
              top: (coordinateY * SQUARE_WIDTH) - mapOffset.top - 8,
              left: (coordinateX * SQUARE_WIDTH) - mapOffset.left - 2,
            }}
          />
        </View>
        <View style={styles.positionInfo}>
          <Text>Position {coordinateX}:{coordinateY}</Text>
          {this.moveTime ?
            <View style={{ flexDirection: 'row' }}>
              <Text>Left: {this.moveTime}</Text>
              <IconButton style={{ marginTop: 4, marginLeft: 5 }} onPress={this.onCancelMove}>
                <SvgUri
                  width="12"
                  height="12"
                  source={require('../assets/images/cross.svg')}
                />
              </IconButton>
            </View> : null}
        </View>
        <View style={styles.heroesInfo} />
      </View>
    );
  }
}
