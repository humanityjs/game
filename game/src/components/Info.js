import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { capitalize, camelCase } from 'lodash';
import { connect } from 'react-redux';

import IconButton from './shared/IconButton';
import Text from './shared/Text';

import { getFeatureParam } from '../lib/utils';
import { increaseParameter, increaseAbility, increaseSkill } from '../actions/hero';

const styles = StyleSheet.create({
  infoBlock: {
    width: 200,
    height: 200,
    padding: 10,
    backgroundColor: '#EAEAEA',
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
  },
});

class SkillsInfo extends Component {
  static propTypes = {
    hero: PropTypes.shape(),
    skills: PropTypes.arrayOf(PropTypes.shape()),
  }
  static contextTypes = {
    store: PropTypes.shape(),
  }
  constructor() {
    super();

    this.onNextPage = this.onNextPage.bind(this);
    this.onPreviousPage = this.onPreviousPage.bind(this);
  }
  state = {
    page: 0,
  }
  onNextPage() {
    this.setState({ page: this.state.page + 1 });
  }
  onPreviousPage() {
    this.setState({ page: this.state.page - 1 });
  }
  onIncrease(id) {
    const { dispatch } = this.context.store;
    dispatch(increaseSkill(id));
  }
  render() {
    const { hero, skills } = this.props;
    const { page } = this.state;

    const perPage = 5;

    return (
      <View style={[styles.infoBlock, { height: 190 }]}>
        <Text style={styles.title}>Skills</Text>
        {skills
          .slice(page * perPage, (page * perPage) + perPage)
          .map((skill) => {
            const heroSkill = hero.skills.find(item => item.skill === skill.id);
            return (
              <View key={`${skill.id}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{skill.name}</Text>
                <Text>{heroSkill ? heroSkill.level : 0}</Text>
                {hero.numberOfSkills ?
                  <IconButton
                    onPress={() => this.onIncrease(skill.id)}
                    style={{ marginTop: 2, marginLeft: 8 }}
                  >
                    <SvgUri
                      width="14"
                      height="14"
                      source={require('../assets/images/plus.svg')}
                    />
                  </IconButton> : null}
              </View>
            );
        })}
        {hero.numberOfSkills ?
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text>To increase</Text>
            <Text style={{ marginLeft: 10 }}>{hero.numberOfSkills}</Text>
          </View> : null}
        {this.state.page > 0 &&
          <IconButton
            onPress={this.onPreviousPage}
            style={{ position: 'absolute', top: 10, right: 25 }}
          >
            <SvgUri
              width="14"
              height="14"
              source={require('../assets/images/left.svg')}
            />
          </IconButton>}
        {(page + 1) * perPage < skills.length &&
          <IconButton
            onPress={this.onNextPage}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <SvgUri
              width="14"
              height="14"
              source={require('../assets/images/right.svg')}
            />
          </IconButton>}
      </View>
    );
  }
}

class Info extends Component {
  static propTypes = {
    hero: PropTypes.shape(),
    initData: PropTypes.shape(),
  }
  static contextTypes = {
    store: PropTypes.shape(),
  }
  onIncreaseParameter(name) {
    const { dispatch } = this.context.store;
    dispatch(increaseParameter(name));
  }
  onIncreaseAbility(name) {
    const { dispatch } = this.context.store;
    dispatch(increaseAbility(name));
  }
  render() {
    const { hero, initData } = this.props;

    const tableExperienceItem = initData.tableExperience
      .find(item => item.experience > hero.experience);

    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          <View style={[styles.infoBlock, { height: 170 }]}>
            <Text style={styles.title}>Parameters</Text>
            {['strength',
              'dexterity',
              'intuition',
              'health',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>{hero[item]} {getFeatureParam(hero[item], hero.feature[item])}</Text>
                {hero.numberOfParameters &&
                  <IconButton
                    onPress={() => this.onIncreaseParameter(item)}
                    style={{ marginTop: 2, marginLeft: 8 }}
                  >
                    <SvgUri
                      width="14"
                      height="14"
                      source={require('../assets/images/plus.svg')}
                    />
                  </IconButton>}
              </View>
            ))}
            {hero.numberOfParameters &&
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text>To increase</Text>
                <Text style={{ marginLeft: 10 }}>{hero.numberOfParameters}</Text>
              </View>}
          </View>
          <View style={[styles.infoBlock, { marginTop: 20, height: 145 }]}>
            <Text style={styles.title}>Info</Text>
            {['wins',
              'losses',
              'draws',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>{hero[`numberOf${capitalize(item)}`]}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>Experience</Text>
              <Text style={{ marginLeft: 10 }}>
                {hero.experience} / {tableExperienceItem.experience}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 20 }}>
          <View style={[styles.infoBlock, { height: 160 }]}>
            <Text style={styles.title}>Modifiers</Text>
            {['dodge',
              'accuracy',
              'devastate',
              'block break',
              'armor break',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 95 }}>{capitalize(item)}</Text>
                <Text>{hero.feature[camelCase(item)]}%</Text>
              </View>
            ))}
          </View>
          <View style={[styles.infoBlock, { marginTop: 20, height: 205 }]}>
            <Text style={styles.title}>Damage & Protection</Text>
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ width: 75 }}>Damage</Text>
              <Text>{hero.feature.damageMin} - {hero.feature.damageMax}</Text>
            </View>
            <Text style={{ fontWeight: '400', marginTop: 5 }}>Protection</Text>
            {['head',
              'breast',
              'belly',
              'groin',
              'legs',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>{hero.feature[`protection${capitalize(item)}`]}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ marginLeft: 20 }}>
          <SkillsInfo hero={hero} skills={initData.skills} />
          <View style={[styles.infoBlock, { marginTop: 20, height: 190 }]}>
            <Text style={styles.title}>Abilities</Text>
            {['swords',
              'axes',
              'knives',
              'clubs',
              'shields',
            ].map(item => (
              <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
                <Text style={{ width: 75 }}>{capitalize(item)}</Text>
                <Text>{hero[item]}</Text>
                {hero.numberOfAbilities &&
                  <IconButton
                    onPress={() => this.onIncreaseAbility(item)}
                    style={{ marginTop: 2, marginLeft: 8 }}
                  >
                    <SvgUri
                      width="14"
                      height="14"
                      source={require('../assets/images/plus.svg')}
                    />
                  </IconButton>}
              </View>
            ))}
            {hero.numberOfAbilities &&
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text>To increase</Text>
                <Text style={{ marginLeft: 10 }}>{hero.numberOfAbilities}</Text>
              </View>}
          </View>
        </View>
      </View>
    );
  }
}

export default connect(state => ({ hero: state.hero.hero, initData: state.app.initData }))(Info);
