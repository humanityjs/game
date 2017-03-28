import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { capitalize } from 'lodash';

import IconButton from './shared/IconButton';
import Text from './shared/Text';

const styles = StyleSheet.create({
  infoBlock: {
    width: 200,
    height: 200,
    padding: 10,
    backgroundColor: '#EAEAEA',
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
  },
});

export default class extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          <View style={[styles.infoBlock, { height: 170 }]}>
            <Text style={styles.title}>Parameters</Text>
            {['strength',
              'dexterity',
              'intuition',
              'health',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>5</Text>
                <IconButton style={{ marginTop: 2, marginLeft: 8 }}>
                  <SvgUri
                    width="14"
                    height="14"
                    source={require('../assets/images/plus.svg')}
                  />
                </IconButton>
              </View>
            ))}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>To increase</Text>
              <Text style={{ marginLeft: 10 }}>5</Text>
            </View>
          </View>
          <View style={[styles.infoBlock, { marginTop: 20, height: 145 }]}>
            <Text style={styles.title}>Info</Text>
            {['wins',
              'losses',
              'draws',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>5</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>Experience</Text>
              <Text style={{ marginLeft: 10 }}>0/2000</Text>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 20 }}>
          <View style={[styles.infoBlock, { height: 160 }]}>
            <Text style={styles.title}>Modifiers</Text>
            {['dodge',
              'accuracy',
              'devastate',
              'block break',
              'armor break',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 95 }}>{capitalize(item)}</Text>
                <Text>5</Text>
              </View>
            ))}
          </View>
          <View style={[styles.infoBlock, { marginTop: 20, height: 205 }]}>
            <Text style={styles.title}>Damage & Protection</Text>
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ width: 75 }}>Damage</Text>
              <Text>50 - 90</Text>
            </View>
            <Text style={{ fontWeight: '400', marginTop: 5 }}>Protection</Text>
            {['head',
              'breast',
              'belly',
              'groin',
              'legs',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>5</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ marginLeft: 20 }}>
          <View style={[styles.infoBlock, { height: 190 }]}>
            <Text style={styles.title}>Skills</Text>
            {['swords',
              'axes',
              'knives',
              'clubs',
              'shields',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>5</Text>
                <IconButton style={{ marginTop: 2, marginLeft: 8 }}>
                  <SvgUri
                    width="14"
                    height="14"
                    source={require('../assets/images/plus.svg')}
                  />
                </IconButton>
              </View>
            ))}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>To increase</Text>
              <Text style={{ marginLeft: 10 }}>5</Text>
            </View>
            <IconButton style={{ position: 'absolute', top: 10, right: 25 }}>
              <SvgUri
                width="14"
                height="14"
                source={require('../assets/images/left.svg')}
              />
            </IconButton>
            <IconButton style={{ position: 'absolute', top: 10, right: 10 }}>
              <SvgUri
                width="14"
                height="14"
                source={require('../assets/images/right.svg')}
              />
            </IconButton>
          </View>
          <View style={[styles.infoBlock, { marginTop: 20, height: 190 }]}>
            <Text style={styles.title}>Abilities</Text>
            {['swords',
              'axes',
              'knives',
              'clubs',
              'shields',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>5</Text>
                <IconButton style={{ marginTop: 2, marginLeft: 8 }}>
                  <SvgUri
                    width="14"
                    height="14"
                    source={require('../assets/images/plus.svg')}
                  />
                </IconButton>
              </View>
            ))}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>To increase</Text>
              <Text style={{ marginLeft: 10 }}>5</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
