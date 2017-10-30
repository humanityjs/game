import PropTypes from 'prop-types';
import React from 'react';

import { View } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import iconsConfig from '../../icons.json';

const Icon = createIconSetFromIcoMoon(iconsConfig);

const IconWrapper = ({
  name, size, color = '#000', style,
}) => (
  <Icon name={name} size={size} color={color} style={style} />
);

IconWrapper.propTypes = {
  style: View.propTypes.style,
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default IconWrapper;
