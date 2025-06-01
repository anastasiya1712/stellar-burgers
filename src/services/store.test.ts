import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import { storeConfig } from './store';

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const testStore = configureStore(storeConfig);
    const initialState = testStore.getState();

    testStore.dispatch({ type: 'UNKNOWN_ACTION' } as UnknownAction);
    const stateAfterAction = testStore.getState();

    expect(stateAfterAction).toEqual(initialState);
  });
});
