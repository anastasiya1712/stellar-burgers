import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../services/store';
import { TOrder } from '../../../utils/types';

interface OrdersResponse {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
}

interface OrderResponse {
  success: boolean;
  name: string;
  order: TOrder;
}

interface OrdersState {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoadingOrders: boolean;
  isLoadingOrder: boolean;
  isPostingOrder: boolean;
  ordersError: string | null;
  orderError: string | null;
  postError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoadingOrders: false,
  isLoadingOrder: false,
  isPostingOrder: false,
  ordersError: null,
  orderError: null,
  postError: null
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, thunkAPI) => {
  try {
    const response = (await getOrdersApi()) as unknown as OrdersResponse;
    if (!response.success) {
      throw new Error('Ошибка при получении заказов');
    }
    return response.orders;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при получении заказов'
    );
  }
});

export const placeOrder = createAsyncThunk<
  TOrder,
  { ingredients: string[] },
  { rejectValue: string }
>('orders/placeOrder', async (orderData, thunkAPI) => {
  try {
    const response = (await orderBurgerApi(
      orderData.ingredients
    )) as unknown as OrderResponse;
    if (!response.success) {
      throw new Error('Ошибка при оформлении заказа');
    }
    return response.order;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при оформлении заказа'
    );
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (orderNumber, thunkAPI) => {
  try {
    const response = (await getOrderByNumberApi(
      orderNumber
    )) as unknown as OrdersResponse;
    if (!response.success || !response.orders.length) {
      throw new Error('Заказ не найден');
    }
    return response.orders[0];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при получении заказа'
    );
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    updateOrders: (state, action) => {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Получение списка заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.ordersError = action.payload || 'Произошла ошибка';
      })
      // Размещение заказа
      .addCase(placeOrder.pending, (state) => {
        state.isPostingOrder = true;
        state.postError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isPostingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isPostingOrder = false;
        state.postError = action.payload || 'Произошла ошибка';
      })
      // Получение заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrder = true;
        state.orderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.orderError = action.payload || 'Произошла ошибка';
      });
  }
});

export const { clearCurrentOrder, updateOrders } = ordersSlice.actions;

export default ordersSlice.reducer;

// Селекторы
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) =>
  state.orders.isLoadingOrders;
export const selectOrderLoading = (state: RootState) =>
  state.orders.isLoadingOrder;
export const selectPostOrderLoading = (state: RootState) =>
  state.orders.isPostingOrder;
export const selectOrdersError = (state: RootState) => state.orders.ordersError;
export const selectOrderError = (state: RootState) => state.orders.orderError;
export const selectPostOrderError = (state: RootState) =>
  state.orders.postError;
