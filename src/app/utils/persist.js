import {
  RECEIVE_ORG_INFO,
  ERROR_INIT_ORG
} from '../constants/actionTypes';

export const persistState = reducer => (state, action) => {
  const newState = reducer(state, action);
  persistTeamReducerState(newState.team, action.type);

  return newState;
};

// Persist logic per reducer below this

function persistTeamReducerState(state, action_type) {
  const actionsToPersist = [RECEIVE_ORG_INFO, ERROR_INIT_ORG];

  if (actionsToPersist.includes(action_type)) {
    try {
      localStorage.setItem('team', JSON.stringify(state.toJS()));
    } catch (error) {
      console.error(`Org details response persist failed with error ${error}`);
    }
  }
}
