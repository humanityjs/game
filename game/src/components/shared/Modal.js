import React, { PropTypes } from 'react';
import { View, Modal, StyleSheet } from 'react-native';

import Text from './Text';
import Button from './Button';

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

const ModalWrapper = ({ onHide, children, onOk, okLabel, title, style }) => (
  <Modal animationType="slide" transparent visible>
    <View style={[styles.container, style]}>
      {onHide || title || onOk ? (
        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          {onHide ? (
            <Button
              style={{ backgroundColor: 'transparent' }}
              textStyle={{ color: '#333' }}
              onPress={onHide}
            >
              CLOSE
            </Button>
          ) : null}
          {title ? <Text style={{ fontSize: 17 }}>{title}</Text> : <Text />}
          {onOk ? (
            <Button
              style={{ backgroundColor: 'transparent' }}
              textStyle={{ color: '#333' }}
              onPress={onOk}
            >
              {okLabel}
            </Button>
          ) : null}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  </Modal>
);

ModalWrapper.propTypes = {
  onHide: PropTypes.func,
  children: PropTypes.node,
  onOk: PropTypes.func,
  okLabel: PropTypes.string,
  title: PropTypes.string,
  style: View.propTypes.style,
};

export default ModalWrapper;
