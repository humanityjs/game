import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import autobind from 'autobind-decorator';

import Text from './shared/Text';
import TextInput from './shared/TextInput';
import Modal from './shared/Modal';

import heroStore from '../stores/hero';

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderStyle: 'solid',
    borderBottomColor: '#f3f3f4',
    borderBottomWidth: 1,
    height: 50,
  },
  container: {
    flex: 1,
    marginTop: 100,
    marginBottom: 100,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 'white',
  },
});

const FIELDS = [
  {
    key: 'name',
    type: 'TEXT',
    label: 'FULL NAME',
  },
  {
    key: 'email',
    type: 'EMAIL',
    label: 'EMAIL',
  },
  {
    key: 'about',
    type: 'TEXTAREA',
    label: 'ABOUT',
  },
];

@observer
@autobind
class FieldValue extends Component {
  @observable value;
  static propTypes = {
    value: PropTypes.string,
    type: PropTypes.oneOf(['EMAIL', 'TEXT', 'TEXTAREA']).isRequired,
    onChange: PropTypes.func.isRequired,
  };
  constructor(props) {
    super();

    this.value = props.value;
  }
  onChangeValue(value) {
    this.value = value;
    this.props.onChange(value);
  }
  render() {
    switch (this.props.type) {
      case 'EMAIL':
      case 'TEXT':
        return (
          <TextInput
            style={{ height: 50, width: 400, textAlign: 'right' }}
            onChangeText={this.onChangeValue}
            value={this.value}
          />
        );
      case 'TEXTAREA':
        return (
          <TextInput
            multiline
            style={{ height: 150, width: 400, textAlign: 'right' }}
            onChangeText={this.onChangeValue}
            value={this.value}
          />
        );
      default:
        return null;
    }
  }
}

export default observer(({ onHide }) => {
  const data = {};
  return (
    <Modal
      onHide={onHide}
      onOk={() => heroStore.saveGeneral(data)}
      okLabel="SAVE"
      title="Edit Profile"
    >
      {FIELDS.map(item =>
        <View key={item.key} style={[styles.line, item.type === 'TEXTAREA' && { height: 150 }]}>
          <Text style={{ paddingTop: 15 }}>
            {item.label}
          </Text>
          <FieldValue
            value={heroStore.hero[item.key]}
            type={item.type}
            onChange={value => (data[item.key] = value)}
          />
        </View>,
      )}
    </Modal>
  );
});
