import React, { Component } from 'react';
import { connect } from 'react-redux';

import List from '../../combats/List';

import { fetchCombats } from '../../../actions/combatActions';

class Current extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCombats('fight'));
  }
  render() {
    return (
      <div>
        <List info />
      </div>
    );
  }
}

function select(state) {
  return {
    hero: state.hero,
  };
}

export default connect(select)(Current);
