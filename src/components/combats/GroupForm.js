import React, { Component } from 'react';
import { connect } from 'react-redux';

import Select from '../shared/Select';
import Button from '../shared/Button';
import Input from '../shared/Input';

import { newCombat } from '../../actions/combatActions';

class GroupForm extends Component {
  state = {
    timeout: null,
    injury: null,
    level: null,
  };
  onChangeAttr(name, val) {
    this.setState({ [name]: val });
  }
  newCombat() {
    const {
      injury, timeout, timewait,
      firstTeamCount, secondTeamCount,
      firstTeamLevelMin, firstTeamLevelMax,
      secondTeamLevelMin, secondTeamLevelMax,
    } = this.state;
    const { dispatch } = this.props;
    dispatch(newCombat({
      injury,
      timeout: +timeout,
      timewait: +timewait,
      firstTeamCount: +firstTeamCount,
      secondTeamCount: +secondTeamCount,
      firstTeamLevelMin: +firstTeamLevelMin,
      firstTeamLevelMax: +firstTeamLevelMax,
      secondTeamLevelMin: +secondTeamLevelMin,
      secondTeamLevelMax: +secondTeamLevelMax,
      type: 'group',
      status: 'wait',
      created: new Date().getTime(),
    }));
  }
  render() {
    const {
      timeout, injury, timewait,
      firstTeamCount, firstTeamLevelMin, firstTeamLevelMax,
      secondTeamCount, secondTeamLevelMin, secondTeamLevelMax,
    } = this.state;
    return (
      <div className="uk-flex uk-flex-center">
        <form className="uk-form">
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
          <br /><br />
          <label>Team 1</label>
          {' '}
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Max players"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'firstTeamCount')}
          />
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Min level"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'firstTeamLevelMin')}
          />
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Max level"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'firstTeamLevelMax')}
          />
          <br /><br />
          <label>Team 2</label>
          {' '}
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Max players"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'secondTeamCount')}
          />
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Min level"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'secondTeamLevelMin')}
          />
          <Input
            className="uk-margin-right uk-form-width-small"
            placeholder="Max level"
            type="number"
            onChange={this.onChangeAttr.bind(this, 'secondTeamLevelMax')}
          />
          <Button
            label="Create"
            onClick={::this.newCombat}
            disabled={!(timeout && injury && timewait &&
              firstTeamCount && firstTeamLevelMin && firstTeamLevelMax &&
              secondTeamCount && secondTeamLevelMin && secondTeamLevelMax)}
          />
        </form>
      </div>
    );
  }
}

function select(state) {
  return { hero: state.hero };
}

export default connect(select)(GroupForm);
