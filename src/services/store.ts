import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from '../features/slices/ingredientsSlice';
import feedsReducer from '../features/slices/feedsSlice';
import ordersReducer from '../features/slices/ordersSlice';
import userReducer from '../features/slices/userSlice';

const rootReducer = combineSlices({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  user: userReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
