import React, { Component } from 'react';
import { connect } from 'react-redux';

import Form from '../../combats/DuelForm';
import List from '../../combats/List';

import { fetchCombats } from '../../../actions/combatActions';

class Duel extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCombats('duel'));
  }
  render() {
    const { inCombat } = this.props.hero;
    return (
      <div>
        {!inCombat ? <Form /> : null}
        <div className="uk-margin-top">
          <List type="duel" />
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    hero: state.hero,
  };
}

export default connect(select)(Duel);
