import React, { PropTypes } from 'react';
import { View } from 'react-native';

import Hp from './Hp';
import Body from './Body';

const FullBody = ({ warrior }) =>
  <View>
    <View>
      <Hp warrior={warrior} />
    </View>
    <View style={{ marginTop: 10 }}>
      <Body warrior={warrior} />
    </View>
  </View>;

FullBody.propTypes = {
  warrior: PropTypes.shape(),
};

export default FullBody;
