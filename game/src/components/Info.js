import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleSheet, View } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { capitalize, camelCase } from 'lodash';

import IconButton from './shared/IconButton';
import Text from './shared/Text';

import { getFeatureParam } from '../lib/utils';

import heroStore from '../stores/hero';
import appStore from '../stores/app';

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
  render() {
    const { hero } = heroStore;
    const { skills } = appStore.initData;
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
                    onPress={() => heroStore.increaseSkill(skill.id)}
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
          })
        }
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

export default observer(() => {
  const { hero } = heroStore;

  const tableExperienceItem = appStore.initData.tableExperience
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
                  onPress={() => heroStore.increaseParameter(item)}
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
        <SkillsInfo hero={hero} />
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
                  onPress={() => heroStore.increaseAbility(item)}
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
});
