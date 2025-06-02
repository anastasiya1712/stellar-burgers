import { getIngredientsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IngredientsState {
  ingredients: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, thunkAPI) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при загрузке ингредиентов'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default ingredientsSlice.reducer;

export const selectIngredients = (state: any) => state.ingredients.ingredients;
export const selectIngredientsLoading = (state: any) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: any) => state.ingredients.error;
