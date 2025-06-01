import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../services/store';
import { TOrder } from '@utils-types';

interface FeedsResponse {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
}

interface FeedsState {
  feeds: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  feeds: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  FeedsResponse,
  void,
  { rejectValue: string }
>('feeds/fetchFeeds', async (_, thunkAPI) => {
  try {
    const response = (await getFeedsApi()) as unknown as FeedsResponse;
    if (!response.success) {
      throw new Error('Ошибка при загрузке ленты заказов');
    }
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при загрузке фидов'
    );
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Произошла ошибка';
      });
  }
});

export default feedsSlice.reducer;

export const selectFeeds = (state: RootState) => state.feeds.feeds;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;
export const selectFeedsError = (state: RootState) => state.feeds.error;
export const selectFeedsTotal = (state: RootState) => state.feeds.total;
export const selectFeedsTotalToday = (state: RootState) =>
  state.feeds.totalToday;
