import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

const IconButton = ({ onPress, style, children }) => (
  <TouchableOpacity onPress={onPress} style={[style]}>
    {children}
  </TouchableOpacity>
);

IconButton.propTypes = {
  style: View.propTypes.style,
  children: PropTypes.element,
  onPress: PropTypes.func,
};

export default IconButton;
