import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  // Определите поля заказа по необходимости
  number: number;
  // ...
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
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
  any,
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, thunkAPI) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при получении заказов'
    );
  }
});

export const placeOrder = createAsyncThunk<
  any,
  { ingredients: string[] },
  { rejectValue: string }
>('orders/placeOrder', async (orderData, thunkAPI) => {
  try {
    const response = await orderBurgerApi(orderData.ingredients);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при оформлении заказа'
    );
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  any,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (orderNumber, thunkAPI) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при получении заказа'
    );
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.ordersError = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoadingOrders = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.ordersError = action.payload as string;
      })
      .addCase(placeOrder.pending, (state) => {
        state.isPostingOrder = true;
        state.postError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.isPostingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isPostingOrder = false;
        state.postError = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrder = true;
        state.orderError = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoadingOrder = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.orderError = action.payload as string;
      });
  }
});

export default ordersSlice.reducer;

export const selectOrders = (state: any) => state.orders.orders;
export const selectCurrentOrder = (state: any) => state.orders.currentOrder;
export const selectOrdersLoading = (state: any) => state.orders.isLoadingOrders;
export const selectOrderLoading = (state: any) => state.orders.isLoadingOrder;
export const selectPostOrderLoading = (state: any) =>
  state.orders.isPostingOrder;
export const selectOrdersError = (state: any) => state.orders.ordersError;
export const selectOrderError = (state: any) => state.orders.orderError;
export const selectPostOrderError = (state: any) => state.orders.postError;
