import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';
import moment from 'moment';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Modal from './shared/Modal';
import Button from './shared/Button';
import Text from './shared/Text';

import FullBody from './common/FullBody';
import { renderItem as renderThingItem } from './Inventory/Inventory';
import { overlay } from './App';

import appStore from '../stores/app';

import { ParametersInfo, GeneralInfo, ModifiersInfo } from './common/Info';

import { isOnline, getLocation } from '../lib/warrior-utils';

const styles = StyleSheet.create({
  overlay,
});

const ThingInfoModal = ({ id, warrior, onHide }) => (
  <Modal
    style={{
      flex: 0,
      width: 450,
      height: 190,
      left: 237,
      top: 100,
    }}
  >
    {renderThingItem(warrior, id)}
    <Button
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 10,
        right: 0,
        zIndex: 2,
      }}
      textStyle={{ color: '#333' }}
      onPress={onHide}
    >
      CLOSE
    </Button>
  </Modal>
);

ThingInfoModal.propTypes = {
  id: PropTypes.string,
  warrior: PropTypes.shape({}),
  onHide: PropTypes.func,
};

@observer
export default class WarriorInfoModal extends Component {
  @observable showThingInfoModal = false;
  thingId = null;
  static propTypes = {
    warrior: PropTypes.shape(),
  };
  render() {
    const { warrior } = this.props;
    const online = isOnline(warrior);
    const { isBot } = warrior;

    return (
      <Modal>
        <ScrollView style={{ zIndex: 2 }}>
          <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 60 }}>
            <View>
              <ParametersInfo warrior={warrior} noActions />
              <View style={{ marginTop: 20 }}>
                {!isBot ? <GeneralInfo warrior={warrior} /> : <View style={{ width: 200 }} />}
              </View>
            </View>
            <View style={{ marginLeft: 20, marginTop: -50 }}>
              <FullBody
                warrior={warrior}
                onThingPress={(id) => {
                  this.showThingInfoModal = true;
                  this.thingId = id;
                }}
              />
            </View>

            <View style={{ marginLeft: 20 }}>
              <ModifiersInfo warrior={warrior} />
            </View>
          </View>
          <View style={{ marginTop: 20, flexDirection: 'row', alignSelf: 'center' }}>
            <Text style={[{ color: online ? '#22C064' : '#E0483E' }]}>
              {online ? 'Online' : 'Offline'}
            </Text>
            <Text> | </Text>
            <Text>Place: {getLocation(warrior, appStore.initData.islands)}</Text>
          </View>
          {!isBot && (
            <View style={{ width: '100%' }}>
              <ScrollView
                style={{
                  backgroundColor: '#EAEAEA',
                  margin: 20,
                  height: 200,
                  padding: 10,
                }}
              >
                <Text>Date of registration: {moment(warrior.created).format('LL')}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text>Name: </Text>
                  <Text>{warrior.name}</Text>
                </View>
                {warrior.about ? <Text>About</Text> : null}
                <Text>{warrior.about}</Text>
              </ScrollView>
            </View>
          )}
        </ScrollView>
        <Button
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 10,
            right: 0,
            zIndex: 2,
          }}
          textStyle={{ color: '#333' }}
          onPress={() => appStore.toggleWarriorInfoModal()}
        >
          CLOSE
        </Button>
        {this.showThingInfoModal && [
          <ThingInfoModal
            key={1}
            warrior={warrior}
            id={this.thingId}
            onHide={() => {
              this.showThingInfoModal = false;
            }}
          />,
          <View key={2} style={styles.overlay} />,
        ]}
      </Modal>
    );
  }
}
