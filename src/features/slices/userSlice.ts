import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  name: string;
  // Добавьте другие поля при необходимости
}

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: string | null;
  loginLoading: boolean;
  loginError: string | null;
  forgotLoading: boolean;
  forgotError: string | null;
  resetLoading: boolean;
  resetError: string | null;
  getUserLoading: boolean;
  getUserError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  logoutLoading: boolean;
  logoutError: string | null;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  forgotLoading: false,
  forgotError: null,
  resetLoading: false,
  resetError: null,
  getUserLoading: false,
  getUserError: null,
  updateLoading: false,
  updateError: null,
  logoutLoading: false,
  logoutError: null
};

export const registerUser = createAsyncThunk<
  any,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('user/registerUser', async (userData, thunkAPI) => {
  try {
    const response = await registerUserApi(userData);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Ошибка при регистрации');
  }
});

export const loginUser = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: string }
>('user/loginUser', async (credentials, thunkAPI) => {
  try {
    const response = await loginUserApi(credentials);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Ошибка при авторизации');
  }
});

export const forgotPassword = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, thunkAPI) => {
  try {
    const response = await forgotPasswordApi(data);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при запросе на восстановление пароля'
    );
  }
});

export const resetPassword = createAsyncThunk<
  any,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, thunkAPI) => {
  try {
    const response = await resetPasswordApi(data);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при сбросе пароля'
    );
  }
});

export const fetchUser = createAsyncThunk<any, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, thunkAPI) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка при получении данных пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  any,
  { email?: string; name?: string; password?: string },
  { rejectValue: string }
>('user/updateUser', async (userData, thunkAPI) => {
  try {
    const response = await updateUserApi(userData);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || 'Ошибка при обновлении данных пользователя'
    );
  }
});

export const logout = createAsyncThunk<any, void, { rejectValue: string }>(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      const response = await logoutApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка при выходе из системы'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loginLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotLoading = true;
        state.forgotError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotLoading = false;
        state.forgotError = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.getUserLoading = true;
        state.getUserError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.getUserLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.getUserLoading = false;
        state.getUserError = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.updateLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload as string;
      });
  }
});

export default userSlice.reducer;

export const selectUser = (state: any) => state.user.user;
export const selectRegisterLoading = (state: any) => state.user.registerLoading;
export const selectRegisterError = (state: any) => state.user.registerError;
export const selectLoginLoading = (state: any) => state.user.loginLoading;
export const selectLoginError = (state: any) => state.user.loginError;
export const selectForgotLoading = (state: any) => state.user.forgotLoading;
export const selectForgotError = (state: any) => state.user.forgotError;
export const selectResetLoading = (state: any) => state.user.resetLoading;
export const selectResetError = (state: any) => state.user.resetError;
export const selectGetUserLoading = (state: any) => state.user.getUserLoading;
export const selectGetUserError = (state: any) => state.user.getUserError;
export const selectUpdateLoading = (state: any) => state.user.updateLoading;
export const selectUpdateError = (state: any) => state.user.updateError;
export const selectLogoutLoading = (state: any) => state.user.logoutLoading;
export const selectLogoutError = (state: any) => state.user.logoutError;
