import { combineReducers } from 'redux';

import heroReducer from './heroReducer';
import combatReducer from './combatReducer';

const rootReducer = combineReducers({
  hero: heroReducer,
  combats: combatReducer,
});

export default rootReducer;
