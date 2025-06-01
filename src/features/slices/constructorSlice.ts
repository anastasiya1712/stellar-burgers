import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../../services/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid4 } from 'uuid';

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
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uniqueId: uuid4()
        }
      }),
      reducer: (
        state,
        action: PayloadAction<TIngredient & { uniqueId: string }>
      ) => {
        const ingredient = action.payload;
        const currentState = state || initialState;

        if (ingredient.type === 'bun') {
          return {
            ...currentState,
            bun: ingredient
          };
        }
        return {
          ...currentState,
          ingredients: [...(currentState.ingredients || []), ingredient]
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const currentState = state || initialState;
      return {
        ...currentState,
        ingredients: currentState.ingredients.filter(
          (item) => item.uniqueId !== action.payload
        )
      };
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const currentState = state || initialState;
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = [...currentState.ingredients];
      const dragItem = ingredients[dragIndex];
      ingredients.splice(dragIndex, 1);
      ingredients.splice(hoverIndex, 0, dragItem);
      return {
        ...currentState,
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

export const selectConstructorState = (state: RootState) =>
  state.constructor || initialState;
export const selectConstructorBun = (state: RootState) =>
  (state.constructor || initialState).bun;
export const selectConstructorIngredients = (state: RootState) =>
  (state.constructor || initialState).ingredients;
