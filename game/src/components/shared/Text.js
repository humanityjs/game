import React, { PropTypes } from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Open Sans',
    fontWeight: '100',
    color: '#333',
  },
});

const TextWrapper = ({ style, children }) => (
  <Text style={[styles.base, style]}>
    {children}
  </Text>
);

TextWrapper.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};

export default TextWrapper;
