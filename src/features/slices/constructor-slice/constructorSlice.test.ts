import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '@utils-types';

describe('constructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: 'bun-id',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 10,
    price: 100,
    image: 'bun.jpg',
    image_mobile: 'bun-mobile.jpg',
    image_large: 'bun-large.jpg'
  };

  const mockIngredient: TIngredient = {
    _id: 'ingredient-id',
    name: 'Ингредиент',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 5,
    price: 50,
    image: 'ingredient.jpg',
    image_mobile: 'ingredient-mobile.jpg',
    image_large: 'ingredient-large.jpg'
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(initialState);
  });

  it('should handle adding a bun', () => {
    const action = addIngredient(mockBun);
    const newState = reducer(initialState, action);

    expect(newState.bun).toEqual({
      ...mockBun,
      uniqueId: expect.any(String)
    });
    expect(newState.ingredients).toEqual([]);
  });

  it('should handle adding an ingredient', () => {
    const action = addIngredient(mockIngredient);
    const newState = reducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mockIngredient,
      uniqueId: expect.any(String)
    });
  });

  it('should handle removing an ingredient', () => {
    const addAction = addIngredient(mockIngredient);
    const stateWithIngredient = reducer(initialState, addAction);
    const ingredientId = stateWithIngredient.ingredients[0].uniqueId;

    const removeAction = removeIngredient(ingredientId);
    const newState = reducer(stateWithIngredient, removeAction);

    expect(newState.ingredients).toHaveLength(0);
  });

  it('should handle moving ingredients', () => {
    const state = reducer(initialState, addIngredient(mockIngredient));
    const state2 = reducer(
      state,
      addIngredient({
        ...mockIngredient,
        _id: 'ingredient-id-2'
      })
    );

    const moveAction = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
    const newState = reducer(state2, moveAction);

    expect(newState.ingredients[0]._id).toBe('ingredient-id-2');
    expect(newState.ingredients[1]._id).toBe('ingredient-id');
  });

  it('should handle clearing the constructor', () => {
    let state = reducer(initialState, addIngredient(mockBun));
    state = reducer(state, addIngredient(mockIngredient));

    const newState = reducer(state, clearConstructor());

    expect(newState).toEqual(initialState);
  });

  it('should not remove any ingredient when constructor is empty', () => {
    const action = removeIngredient('non-existing-id');
    const newState = reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });

  it('should not move ingredients with out-of-bound indices', () => {
    let state = reducer(initialState, addIngredient(mockIngredient));
    state = reducer(
      state,
      addIngredient({
        ...mockIngredient,
        _id: 'ingredient-id-2'
      })
    );

    const originalState = { ...state };
    const action = moveIngredient({ dragIndex: 5, hoverIndex: 10 });
    const newState = reducer(state, action);

    expect(newState).toEqual(originalState);
  });

  it('should not move ingredients with identical indices', () => {
    let state = reducer(initialState, addIngredient(mockIngredient));
    state = reducer(
      state,
      addIngredient({
        ...mockIngredient,
        _id: 'ingredient-id-2'
      })
    );

    const originalState = { ...state };
    const action = moveIngredient({ dragIndex: 1, hoverIndex: 1 });
    const newState = reducer(state, action);

    expect(newState).toEqual(originalState);
  });

  it('should not move ingredients in empty constructor', () => {
    const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
    const newState = reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
