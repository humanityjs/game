import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import Text from './shared/Text';

import Hp from './Hp';
import Body from './Body';
import Info from './Info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
  },
});

export default class extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 324 }}>
            <Hp />
            <View style={{ marginTop: 10 }}>
              <Body />
            </View>
          </View>
          <View style={{ marginLeft: 20, width: 640 }}>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{
                width: 220, 
                height: 40,
                backgroundColor: '#EAEAEA',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text>Money</Text>
                <Text style={{ marginLeft: 5 }}>22.34</Text>
                <Text style={{ marginLeft: 10 }}>Capacity</Text>
                <Text style={{ marginLeft: 5 }}>34/100</Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Info />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

