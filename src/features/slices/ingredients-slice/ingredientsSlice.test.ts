import reducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredients reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: 'ingredient-1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 5,
      price: 50,
      image: 'ingredient1.jpg',
      image_mobile: 'ingredient1-mobile.jpg',
      image_large: 'ingredient1-large.jpg'
    }
  ];

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: fetchIngredients.rejected.type,
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
