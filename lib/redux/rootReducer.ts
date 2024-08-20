import global from './global/reducer';

import { combineReducers } from 'redux';

export interface RootReducer {
  global?: any;
}

const rootReducer = combineReducers({
  global,
});

export default rootReducer;
