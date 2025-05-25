import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../../services/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        return {
          ...state,
          bun: ingredient
        };
      }
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          { ...ingredient, uniqueId: Date.now().toString() }
        ]
      };
    },
    removeIngredient: (state, action: PayloadAction<string>) => ({
      ...state,
      ingredients: state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      )
    }),
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const dragItem = ingredients[dragIndex];
      ingredients.splice(dragIndex, 1);
      ingredients.splice(hoverIndex, 0, dragItem);
      return {
        ...state,
        ingredients
      };
    },
    clearConstructor: () => initialState
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

export const selectConstructorState = (state: RootState) => state.constructor;
export const selectConstructorBun = (state: RootState) =>
  state.constructor?.bun || null;
export const selectConstructorIngredients = (state: RootState) =>
  state.constructor?.ingredients || [];
