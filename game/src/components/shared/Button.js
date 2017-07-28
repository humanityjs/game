import React, { PropTypes, Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import autobind from 'autobind-decorator';

import Text from './Text';

const styles = StyleSheet.create({
  button: {
    height: 30,
    alignItems: 'center',
    paddingTop: 5,
    backgroundColor: '#1C57FF',
    width: 80,
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
  disabled: {
    backgroundColor: 'grey',
  },
});

@autobind
export default class extends Component {
  static propTypes = {
    style: View.propTypes.style,
    textStyle: Text.propTypes.style,
    children: PropTypes.node,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
  };

  onPress() {
    const { disabled, onPress } = this.props;

    if (disabled) return;

    onPress();
  }
  render() {
    const { style, disabled, textStyle, children } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[styles.button, style, disabled && styles.disabled]}
      >
        <Text style={[styles.text, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
}
