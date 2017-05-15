import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Text from './shared/Text';

import combatStore from '../stores/combat';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'green',
  },
});

@observer
export default class extends Component {
  componentDidMount() {
    if (!combatStore.combat) combatStore.fetch();
  }
  render() {
    const { combat } = combatStore;
    return (
      <View style={styles.container}>
        <View>
          {combat.warriors
            .filter(item => item.team === 1)
            .map(item => (
              <Text>{item.login} [{item.level}]</Text>
            ))
          }
          <Text>vs</Text>
          {combat.warriors
            .filter(item => item.team === 2)
            .map(item => (
              <Text>{item.login} [{item.level}]</Text>
            ))
          }
        </View>
      </View>
    );
  }
}
