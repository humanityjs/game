import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Open Sans',
    fontWeight: '100',
    height: 25,
    width: 200,
    color: '#333',
  },
});

export default ({ style, ...props }) => (
  <TextInput style={[styles.base, style]} {...props} />
);
