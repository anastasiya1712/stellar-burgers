import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from '../features/slices/ingredients-slice/ingredientsSlice';
import constructorReducer from '../features/slices/constructor-slice/constructorSlice';
import ordersReducer from '../features/slices/orders-slice/ordersSlice';
import userReducer from '../features/slices/user-slice/userSlice';
import feedsReducer from '../features/slices/feeds-slice/feedsSlice';
import { GetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';

export const storeConfig = {
  reducer: {
    ingredients: ingredientsReducer,
    constructor: constructorReducer,
    orders: ordersReducer,
    user: userReducer,
    feeds: feedsReducer
  },
  middleware: (getDefaultMiddleware: GetDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['constructor/addIngredient'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates']
      }
    })
};

export const store = configureStore(storeConfig);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
