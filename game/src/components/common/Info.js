import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { capitalize, camelCase } from 'lodash';

import IconButton from '../shared/IconButton';
import Text from '../shared/Text';

import { getFeatureParam } from '../../lib/hero-utils';

import heroStore from '../../stores/hero';
import appStore from '../../stores/app';

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

@observer
class SkillsInfo extends Component {
  @observer page = 0;
  render() {
    const { hero } = heroStore;
    const { skills } = appStore.initData;

    const perPage = 5;

    return (
      <View style={[styles.infoBlock, { height: 190 }]}>
        <Text style={styles.title}>Skills</Text>
        {skills.slice(this.page * perPage, this.page * perPage + perPage).map((skill) => {
          const heroSkill = hero.skills.find(item => item.skill === skill.id);
          return (
            <View key={`${skill.id}`} style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ width: 75 }}>
                {skill.name}
              </Text>
              <Text>
                {heroSkill ? heroSkill.level : 0}
              </Text>
              {hero.numberOfSkills
                ? <IconButton
                  onPress={() => heroStore.increaseSkill(skill.id)}
                  style={{ marginTop: 2, marginLeft: 8 }}
                >
                  <SvgUri
                    width="14"
                    height="14"
                    source={require('../../assets/images/plus.svg')}
                  />
                </IconButton>
                : null}
            </View>
          );
        })}
        {hero.numberOfSkills
          ? <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text>To increase</Text>
            <Text style={{ marginLeft: 10 }}>
              {hero.numberOfSkills}
            </Text>
          </View>
          : null}
        {this.page > 0 &&
          <IconButton
            onPress={() => {
              this.page += 1;
            }}
            style={{ position: 'absolute', top: 10, right: 25 }}
          >
            <SvgUri width="14" height="14" source={require('../../assets/images/left.svg')} />
          </IconButton>}
        {(this.page + 1) * perPage < skills.length &&
          <IconButton
            onPress={() => {
              this.page -= 1;
            }}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <SvgUri width="14" height="14" source={require('../../assets/images/right.svg')} />
          </IconButton>}
      </View>
    );
  }
}

export function ParametersInfo({ warrior, noActions }) {
  return (
    <View style={[styles.infoBlock, { height: 170 }]}>
      <Text style={styles.title}>Parameters</Text>
      {['strength', 'dexterity', 'intuition', 'health'].map(item =>
        <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={{ width: 75 }}>
            {capitalize(item)}
          </Text>
          <Text>
            {warrior[item]} {getFeatureParam(warrior[item], warrior.feature[item])}
          </Text>
          {!noActions && warrior.numberOfParameters &&
            <IconButton
              onPress={() => heroStore.increaseParameter(item)}
              style={{ marginTop: 2, marginLeft: 8 }}
            >
              <SvgUri width="14" height="14" source={require('../../assets/images/plus.svg')} />
            </IconButton>}
        </View>,
      )}
      {!noActions && warrior.numberOfParameters &&
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text>To increase</Text>
          <Text style={{ marginLeft: 10 }}>
            {warrior.numberOfParameters}
          </Text>
        </View>}
    </View>
  );
}

ParametersInfo.propTypes = {
  warrior: PropTypes.shape(),
  noActions: PropTypes.bool,
};

export function GeneralInfo({ warrior }) {
  const tableExperienceItem = appStore.initData.tableExperience.find(
    item => item.level > warrior.level,
  );

  return (
    <View style={[styles.infoBlock, { height: 145 }]}>
      <Text style={styles.title}>Info</Text>
      {['wins', 'losses', 'draws'].map(item =>
        <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={{ width: 75 }}>
            {capitalize(item)}
          </Text>
          <Text>
            {warrior[`numberOf${capitalize(item)}`]}
          </Text>
        </View>,
      )}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text>Experience</Text>
        <Text style={{ marginLeft: 10 }}>
          {warrior.experience} / {tableExperienceItem.experience}
        </Text>
      </View>
    </View>
  );
}

GeneralInfo.propTypes = {
  warrior: PropTypes.shape(),
};

export function ModifiersInfo({ warrior }) {
  return (
    <View style={[styles.infoBlock, { height: 160 }]}>
      <Text style={styles.title}>Modifiers</Text>
      {['dodge', 'accuracy', 'devastate', 'block break', 'armor break'].map(item =>
        <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={{ width: 95 }}>
            {capitalize(item)}
          </Text>
          <Text>
            {warrior.feature[camelCase(item)]}%
          </Text>
        </View>,
      )}
    </View>
  );
}

ModifiersInfo.propTypes = {
  warrior: PropTypes.shape(),
};

export default observer(() => {
  const { hero } = heroStore;

  return (
    <View style={{ flexDirection: 'row' }}>
      <View>
        <ParametersInfo warrior={hero} />
        <View style={{ marginTop: 20 }}>
          <GeneralInfo warrior={hero} />
        </View>
      </View>
      <View style={{ marginLeft: 20 }}>
        <ModifiersInfo warrior={hero} />
        <View style={[styles.infoBlock, { marginTop: 20, height: 205 }]}>
          <Text style={styles.title}>Damage & Protection</Text>
          <View style={{ flexDirection: 'row', marginTop: 2 }}>
            <Text style={{ width: 75 }}>Damage</Text>
            <Text>
              {hero.feature.damageMin} - {hero.feature.damageMax}
            </Text>
          </View>
          <Text style={{ fontWeight: '400', marginTop: 5 }}>Protection</Text>
          {['head', 'breast', 'belly', 'groin', 'legs'].map(item =>
            <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ width: 75 }}>
                {capitalize(item)}
              </Text>
              <Text>
                {hero.feature[`protection${capitalize(item)}`]}
              </Text>
            </View>,
          )}
        </View>
      </View>
      <View style={{ marginLeft: 20 }}>
        <SkillsInfo hero={hero} />
        <View style={[styles.infoBlock, { marginTop: 20, height: 190 }]}>
          <Text style={styles.title}>Abilities</Text>
          {['swords', 'axes', 'knives', 'clubs', 'shields'].map(item =>
            <View key={`${item}`} style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ width: 75 }}>
                {capitalize(item)}
              </Text>
              <Text>
                {hero[item]}
              </Text>
              {hero.numberOfAbilities &&
                <IconButton
                  onPress={() => heroStore.increaseAbility(item)}
                  style={{ marginTop: 2, marginLeft: 8 }}
                >
                  <SvgUri width="14" height="14" source={require('../../assets/images/plus.svg')} />
                </IconButton>}
            </View>,
          )}
          {hero.numberOfAbilities &&
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>To increase</Text>
              <Text style={{ marginLeft: 10 }}>
                {hero.numberOfAbilities}
              </Text>
            </View>}
        </View>
      </View>
    </View>
  );
});
