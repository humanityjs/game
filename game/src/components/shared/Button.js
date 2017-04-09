import React, { PropTypes } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from './Text';

const styles = StyleSheet.create({
  button: {
    height: 56,
    alignItems: 'center',
    paddingTop: 18,
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
});

const Button = ({ onPress, style, children, textStyle }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style]}
  >
    <Text style={[styles.text, textStyle]}>
      {children}
    </Text>
  </TouchableOpacity>
);

Button.propTypes = {
  style: View.propTypes.style,
  textStyle: Text.propTypes.style,
  children: PropTypes.node,
  onPress: PropTypes.func,
};

export default Button;
