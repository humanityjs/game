import React, { Component } from 'react';
import { connect } from 'react-redux';

import Form from '../../combats/ChaoticForm';
import List from '../../combats/List';

import { fetchCombats } from '../../../actions/combatActions';

class Chaotic extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCombats('chaotic'));
  }
  render() {
    const { inCombat } = this.props.hero;

    return (
      <div>
        {!inCombat ? <Form /> : null}
        <div className="uk-margin-top">
          <List type="chaotic" />
        </div>
      </div>
    );
  }
}

function select(state) {
  return { hero: state.hero };
}

export default connect(select)(Chaotic);
