import React, { Component } from 'react';
import { connect } from 'react-redux';

import Select from '../shared/Select';
import Button from '../shared/Button';

import { newCombat } from '../../actions/combatActions';

class DuelForm extends Component {
  state = {
    timeout: null,
    injury: null,
  };
  onChangeAttr(name, val) {
    this.setState({ [name]: val });
  }
  newCombat() {
    const { injury, timeout } = this.state;
    const { dispatch } = this.props;
    dispatch(newCombat({
      injury,
      timeout: +timeout,
      // TODO: move this to constants
      type: 'duel',
      status: 'wait',
      created: new Date().getTime(),
    }));
  }
  render() {
    const { timeout, injury } = this.state;
    return (
      <div className="uk-flex uk-flex-center">
        <form className="uk-form">
          <Select
            className="uk-margin-right"
            label="Time out"
            onChange={this.onChangeAttr.bind(this, 'timeout')}
            items={[{
              key: 60,
              label: '60 sec',
            }, {
              key: 120,
              label: '120 sec',
            }, {
              key: 180,
              label: '180 sec',
            }]}
          />
          <Select
            className="uk-margin-right"
            label="Injury"
            onChange={this.onChangeAttr.bind(this, 'injury')}
            items={[{
              key: 'low',
              label: 'Low',
            }, {
              key: 'middle',
              label: 'Middle',
            }, {
              key: 'top',
              label: 'Top',
            }]}
          />
          <Button
            label="Create"
            onClick={::this.newCombat}
            disabled={!(timeout && injury)}
          />
        </form>
      </div>
    );
  }
}

export default connect()(DuelForm);
