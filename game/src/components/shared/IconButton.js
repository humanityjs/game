import React, { PropTypes } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
});

const IconButton = ({ onPress, style, children }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[style]}
  >
    {children}
  </TouchableOpacity>
);

IconButton.propTypes = {
  style: View.propTypes.style,
  children: PropTypes.element,
  onPress: PropTypes.func,
};

export default IconButton;
