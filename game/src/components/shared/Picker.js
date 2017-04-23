import React, { PropTypes, Component } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Picker from 'react-native-picker';
import SvgUri from 'react-native-svg-uri';

import Text from './Text';

const styles = StyleSheet.create({
  picker: {
    height: 30,
    width: 137,
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'relative',
  },
  text: {
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
  arrow: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
});

export default class extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    placeholder: PropTypes.string,
    titleText: PropTypes.string,
    value: PropTypes.string,
    style: View.propTypes.style,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();

    this.showPicker = this.showPicker.bind(this);
    this.onPickerConfirm = this.onPickerConfirm.bind(this);

    this.state = {
      value: props.value ? props.value : null,
    };
  }
  onPickerConfirm(value) {
    const key = this.props.data.find(item => item.label === value[0]).key;
    this.setState({ value: key });
    this.props.onChange(key);
  }

  getLebel() {
    const item = this.props.data.find(iitem => iitem.key === this.state.value);
    return item ? item.label : null;
  }
  showPicker() {
    const { data, titleText } = this.props;

    Picker.init({
      pickerConfirmBtnText: 'Apply',
      pickerCancelBtnText: 'Cancel',
      pickerTitleText: titleText,
      pickerData: data.map(item => item.label),
      selectedValue: [this.getLebel()],
      onPickerConfirm: this.onPickerConfirm,
    });
    Picker.show();
  }

  render() {
    const { placeholder, style } = this.props;

    return (
      <TouchableOpacity
        onPress={this.showPicker}
        style={[styles.picker, style]}
      >
        <Text style={styles.text}>{this.getLebel() || placeholder || ''}</Text>
        <SvgUri
          width="18"
          height="12"
          style={styles.arrow}
          source={require('../../assets/images/down.svg')}
        />
      </TouchableOpacity>
    );
  }
}
