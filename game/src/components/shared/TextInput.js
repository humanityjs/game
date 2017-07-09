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

const TextInputWrapper = ({ style, ...props }) =>
  <TextInput style={[styles.base, style]} {...props} />;

TextInputWrapper.propTypes = {
  style: TextInput.propTypes.style,
};

export default TextInputWrapper;
