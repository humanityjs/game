import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'green',
  },
});

export default () => (
  <View style={styles.container} />
);
