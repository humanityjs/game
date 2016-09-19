import {
  RECEIVE_COMBATS,
  NEW_COMBAT,
  REMOVE_COMBAT,
  JOIN_COMBAT,
  LEAVE_COMBAT,
} from '../constants/AppConstants';
import { assignToEmpty } from '../lib/utils';

export default (state = [], action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_COMBATS:
      return action.combats;
    case NEW_COMBAT:
      return [
        ...state,
        assignToEmpty(action.combat),
      ];
    case REMOVE_COMBAT:
      return state.filter(item => item.id !== action.combat.id);
    case JOIN_COMBAT:
    case LEAVE_COMBAT:
      return [
        ...state.filter(item => item.id !== action.combat.id),
        action.combat,
      ];
    default:
      return state;
  }
};
