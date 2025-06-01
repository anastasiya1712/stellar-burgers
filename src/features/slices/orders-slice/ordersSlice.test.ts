import reducer, {
  fetchUserOrders,
  placeOrder,
  fetchOrderByNumber,
  clearCurrentOrder
} from './ordersSlice';
import { TOrder } from '@utils-types';

describe('orders reducer', () => {
  const initialState = {
    orders: [],
    currentOrder: null,
    isLoadingOrders: false,
    isLoadingOrder: false,
    isPostingOrder: false,
    ordersError: null,
    orderError: null,
    postError: null
  };

  const mockOrder: TOrder = {
    _id: 'order-1',
    number: 1234,
    name: 'Test Order',
    status: 'done',
    ingredients: ['ingredient-1', 'ingredient-2'],
    createdAt: '2024-03-20T12:00:00.000Z',
    updatedAt: '2024-03-20T12:00:00.000Z'
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(initialState);
  });

  describe('fetchUserOrders', () => {
    it('should handle fetchUserOrders.pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoadingOrders: true,
        ordersError: null
      });
    });

    it('should handle fetchUserOrders.fulfilled', () => {
      const mockOrders = [mockOrder];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orders: mockOrders,
        isLoadingOrders: false
      });
    });

    it('should handle fetchUserOrders.rejected', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoadingOrders: false,
        ordersError: errorMessage
      });
    });
  });

  describe('placeOrder', () => {
    it('should handle placeOrder.pending', () => {
      const action = { type: placeOrder.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isPostingOrder: true,
        postError: null
      });
    });

    it('should handle placeOrder.fulfilled', () => {
      const action = {
        type: placeOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        currentOrder: mockOrder,
        isPostingOrder: false
      });
    });

    it('should handle placeOrder.rejected', () => {
      const errorMessage = 'Failed to place order';
      const action = {
        type: placeOrder.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isPostingOrder: false,
        postError: errorMessage
      });
    });
  });

  describe('fetchOrderByNumber', () => {
    it('should handle fetchOrderByNumber.pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoadingOrder: true,
        orderError: null
      });
    });

    it('should handle fetchOrderByNumber.fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        currentOrder: mockOrder,
        isLoadingOrder: false
      });
    });

    it('should handle fetchOrderByNumber.rejected', () => {
      const errorMessage = 'Failed to fetch order';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoadingOrder: false,
        orderError: errorMessage
      });
    });
  });

  it('should handle clearCurrentOrder', () => {
    const stateWithOrder = {
      ...initialState,
      currentOrder: mockOrder
    };

    const action = { type: clearCurrentOrder.type };
    const state = reducer(stateWithOrder, action);

    expect(state).toEqual({
      ...initialState,
      currentOrder: null
    });
  });
});
