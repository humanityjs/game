import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../shared/Button';

import mediator from '../../mediator';

import { fetchCombats, removeCombat, joinCombat, leaveCombat } from '../../actions/combatActions';

import moment from 'moment';

class List extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['duel', 'chaotic', 'group']),
  };

  renderHero(warrior) {
    const hero = mediator.storage.heroes[warrior.warrior];
    return (
      <span>
        <a className="uk-icon-hover uk-icon-info-circle" />
        {' '}
        <span className="uk-text-bold">{hero.login} [{hero.level}]</span>
      </span>
    );
  }
  renderItem(combat, index) {
    const { hero, dispatch, type } = this.props;
    const { created, timeout, injury, timewait, warriors } = combat;
    const {
      firstTeamCount, firstTeamLevelMin, firstTeamLevelMax,
      secondTeamCount, secondTeamLevelMin, secondTeamLevelMax,
    } = combat;

    const owner = warriors[0];
    const isOwner = owner.warrior === hero.id;
    const { inCombat } = hero;
    const firstTeam = warriors.filter(item => item.team === 1);
    const secondTeam = warriors.filter(item => item.team === 2);

    return (
      <li key={index}>
        <span>
          <b>{moment(created).format('MMMM Do, hh:mm:ss')}</b>
          {' '}
          <i>
            <span>Timeout: {timeout} sec</span>
            {' '}
            <span>Injury: {injury}</span>
            {' '}
            {timewait && <span>Timewait: {timewait} sec</span>}
            {' '}
            {firstTeamCount &&
              <span>
                [
                  {`${firstTeamCount} (${firstTeamLevelMin === -1 ? 0 : firstTeamLevelMin} -
                    ${firstTeamLevelMax === -1 ? 'Max' : firstTeamLevelMax})`}
                  {secondTeamCount &&
                    ` vs ${secondTeamCount} (${secondTeamLevelMin} - ${secondTeamLevelMax})`}
                ]
              </span>}
          </i>
        </span>

        {' '}

        {firstTeam.map(::this.renderHero)}
        {
          !isOwner && !inCombat && !warriors.find(item => item.warrior === hero.id) &&
          ((firstTeamLevelMin === -1 || hero.level >= firstTeamLevelMin) &&
          (firstTeamLevelMax === -1 || hero.level <= firstTeamLevelMax)) &&
          firstTeamCount > firstTeam.length ?
          <Button
            type="link"
            className="uk-icon-hover"
            size="mini"
            icon="plus"
            onClick={() => dispatch(joinCombat(combat, 1, hero))}
          /> : null}

        {type !== 'chaotic' && ' vs '}

        {secondTeam.length > 0 && secondTeam.map(::this.renderHero)}

        {type === 'duel' && isOwner && warriors.length > 1 ?
          <Button
            type="link"
            className="uk-icon-hover"
            size="mini"
            icon="check"
            title="Start"
          /> : null}

        {isOwner && warriors.length === 1 ?
          <Button
            type="link"
            className="uk-icon-hover"
            size="mini"
            icon="close"
            onClick={() => dispatch(removeCombat(combat))}
          /> : null}

        {
          !isOwner && !inCombat && !warriors.find(item => item.warrior === hero.id) &&
          (type === 'duel' ||
          ((secondTeamLevelMin === -1 || hero.level >= secondTeamLevelMin) &&
          (secondTeamLevelMax === -1 || hero.level <= secondTeamLevelMax)) &&
          secondTeamCount > secondTeam.length) ?
          <Button
            type="link"
            className="uk-icon-hover"
            size="mini"
            icon="plus"
            onClick={() => dispatch(joinCombat(combat, 2, hero))}
          /> : null}

        {type === 'duel' && !isOwner && warriors.find(item => item.warrior === hero.id) ?
          <Button
            type="link"
            className="uk-icon-hover"
            size="mini"
            icon="minus"
            onClick={() => dispatch(leaveCombat(combat, hero))}
          /> : null}

        {timewait && `${Math.round(timewait - (new Date().getTime() - created) / 1000)} sec`}
      </li>
    );
  }
  render() {
    const { combats, type, dispatch } = this.props;

    return (
      <div>
        <Button
          className="uk-align-center"
          icon="refresh"
          onClick={() => dispatch(fetchCombats())}
        />
        {combats && combats.length ?
          <div className="uk-panel uk-panel-box uk-margin-top">
            <ul className="uk-list">
              {combats
                .sort((a, b) => a.created > b.created)
                .filter(item => item.type === type).map(::this.renderItem)}
            </ul>
          </div> : null}
      </div>
    );
  }
}

function select(state) {
  return {
    hero: state.hero,
    combats: state.combats,
  };
}

export default connect(select)(List);
