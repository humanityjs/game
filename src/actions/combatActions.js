import {
  RECEIVE_COMBATS,
  NEW_COMBAT,
  REMOVE_COMBAT,
  JOIN_COMBAT,
  LEAVE_COMBAT,
} from '../constants/AppConstants';

import { db } from '../mediator';

import { objectsToArray } from '../lib/utils';

import { toggleInCombat } from './heroActions';

// TODO: think of get hero from state or from parameter

function save(combat) {
  return db().child('combats').child(combat.id).set(combat);
}

function fetch(combat) {
  return db().child('combats').child(combat.id).once('value');
}

export function fetchCombats() {
  return (dispatch) => {
    db().child('combats').once('value')
      .then(data => {
        const val = data.val();
        dispatch({ type: RECEIVE_COMBATS, combats: val !== null ? objectsToArray(val) : [] });
      });
  };
}

export function newCombat(combat) {
  return (dispatch, getState) => {
    const { hero } = getState();
    combat.warriors = [{
      warrior: hero.id,
      team: 1,
    }];

    db().child('combats').push(combat)
      .then(ref => {
        combat.id = ref.key();
        dispatch(toggleInCombat(true));
        dispatch({ type: NEW_COMBAT, combat });
      });
  };
}

export function removeCombat(combat) {
  const { id } = combat;
  return (dispatch) => {
    db().child('combats').child(id).remove()
      .then(() => {
        dispatch(toggleInCombat(false));
        dispatch({ type: REMOVE_COMBAT, combat });
      });
  };
}

export function joinCombat(combat, team, hero) {
  const { id } = combat;
  return (dispatch) => {
    fetch(combat).then(data => {
      combat = data.val();
      combat.id = id;
      combat.warriors.push({
        warrior: hero.id,
        team,
      });
      save(combat).then(() => {
        dispatch(toggleInCombat(true));
        dispatch({ type: JOIN_COMBAT, combat });
      });
    });
  };
}

export function leaveCombat(combat, hero) {
  const { id } = combat;
  return (dispatch) => {
    fetch(combat).then(data => {
      combat = data.val();
      combat.id = id;
      combat.warriors = combat.warriors.filter(item => item.warrior !== hero.id);
      save(combat).then(() => {
        dispatch(toggleInCombat(false));
        dispatch({ type: LEAVE_COMBAT, combat });
      });
    });
  };
}
