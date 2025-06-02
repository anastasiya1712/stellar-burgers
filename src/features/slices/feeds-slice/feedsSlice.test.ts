import reducer, { fetchFeeds } from './feedsSlice';
import { TOrder } from '@utils-types';

describe('feeds reducer', () => {
  const initialState = {
    feeds: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  const mockFeeds: TOrder[] = [
    {
      _id: 'order-1',
      number: 1234,
      name: 'Test Order',
      status: 'done',
      ingredients: ['ingredient-1', 'ingredient-2'],
      createdAt: '2024-03-20T12:00:00.000Z',
      updatedAt: '2024-03-20T12:00:00.000Z'
    }
  ];

  const mockResponse = {
    success: true,
    orders: mockFeeds,
    total: 100,
    totalToday: 10
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(initialState);
  });

  it('should handle fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockResponse
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      feeds: mockFeeds,
      total: mockResponse.total,
      totalToday: mockResponse.totalToday,
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchFeeds.rejected', () => {
    const errorMessage = 'Failed to fetch feeds';
    const action = {
      type: fetchFeeds.rejected.type,
      payload: errorMessage
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});
