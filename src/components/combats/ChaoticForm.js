import React, { Component } from 'react';
import { connect } from 'react-redux';

import Select from '../shared/Select';
import Button from '../shared/Button';
import Input from '../shared/Input';

import { newCombat } from '../../actions/combatActions';

class ChaoticForm extends Component {
  state = {
    timeout: null,
    timewait: null,
    count: null,
    injury: null,
    level: null,
  };
  onChangeAttr(name, val) {
    this.setState({ [name]: val });
  }
  newCombat() {
    const { injury, timeout, timewait, level, count } = this.state;
    const { dispatch } = this.props;
    dispatch(newCombat({
      injury,
      timeout: +timeout,
      timewait: +timewait,
      firstTeamCount: +count,
      firstTeamLevelMin: +level,
      firstTeamLevelMax: +level,
      type: 'chaotic',
      status: 'wait',
      created: new Date().getTime(),
    }));
  }
  render() {
    const { hero } = this.props;
    const { timeout, injury, level, timewait } = this.state;
    return (
      <div className="uk-flex uk-flex-center">
        <form className="uk-form">
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Max players"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'count')}
          />
          <Select
            className="uk-margin-right"
            label="Time wait"
            onChange={this.onChangeAttr.bind(this, 'timewait')}
            items={[{
              key: 360,
              label: '5 min',
            }, {
              key: 720,
              label: '10 min',
            }, {
              key: 1080,
              label: '15 min',
            }]}
          />
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
          <Select
            className="uk-margin-right"
            label="Level"
            onChange={this.onChangeAttr.bind(this, 'level')}
            items={[{
              key: hero.level,
              label: 'My',
            }, {
              key: -1,
              label: 'All',
            }]}
          />
          <Button
            label="Create"
            onClick={::this.newCombat}
            disabled={!(timeout && timewait && injury && level)}
          />
        </form>
      </div>
    );
  }
}

function select(state) {
  return { hero: state.hero };
}

export default connect(select)(ChaoticForm);
