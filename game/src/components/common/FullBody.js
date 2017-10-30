import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Hp from './Hp';
import Body from './Body';

const FullBody = ({ warrior, showInfo, onThingPress }) => (
  <View>
    <View>
      <Hp warrior={warrior} showInfo={showInfo} />
    </View>
    <View style={{ marginTop: 10 }}>
      <Body warrior={warrior} onThingPress={onThingPress} />
    </View>
  </View>
);

FullBody.propTypes = {
  warrior: PropTypes.shape({}),
  showInfo: PropTypes.bool,
  onThingPress: PropTypes.func,
};

export default FullBody;
