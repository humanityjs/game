import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: 320,
    height: 60,
    backgroundColor: '#3B5998',
  },
  text: {
    marginTop: 15,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Avenir',
  },
});

const Button = () => (
  <TouchableOpacity style={styles.button}>
    <Text style={styles.text}>Sign In With FaceBook</Text>
  </TouchableOpacity>
);

export default Button;
