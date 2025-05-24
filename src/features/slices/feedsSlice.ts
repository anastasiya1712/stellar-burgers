import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeedsState {
  feeds: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  feeds: [],
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<any, void, { rejectValue: string }>(
  'feeds/fetchFeeds',
  async (_, thunkAPI) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка при загрузке фидов'
      );
    }
  }
);

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
      .addCase(fetchFeeds.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedsSlice.reducer;

export const selectFeeds = (state: any) => state.feeds.feeds;
export const selectFeedsLoading = (state: any) => state.feeds.isLoading;
export const selectFeedsError = (state: any) => state.feeds.error;
