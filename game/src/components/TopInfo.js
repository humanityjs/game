import React, { Component } from 'react';

import {
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Text from './shared/Text';

class TopInfo extends Component {
  render() {
    const { hero } = this.props;
    return (
      <View
        style={{
          width: 220,
          height: 40,
          backgroundColor: '#EAEAEA',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Money</Text>
        <Text style={{ marginLeft: 5 }}>{hero.money}</Text>
        <Text style={{ marginLeft: 10 }}>Capacity</Text>
        <Text style={{ marginLeft: 5 }}>{`${hero.feature.capacity.current}/${hero.feature.capacity.max}`}</Text>
      </View>
    );
  }
}

export default connect(state => ({ hero: state.hero.hero }))(TopInfo);
