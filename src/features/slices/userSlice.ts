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
import { RootState } from '../../services/store';

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

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk<
  any,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('user/registerUser', async (userData, thunkAPI) => {
  try {
    const response = await registerUserApi(userData);
    if (response.accessToken && response.refreshToken) {
      saveTokens(response.accessToken, response.refreshToken);
    }
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
    if (response.accessToken && response.refreshToken) {
      saveTokens(response.accessToken, response.refreshToken);
    }
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Ошибка при авторизации');
  }
});

export const checkAuth = createAsyncThunk<any, void, { rejectValue: string }>(
  'user/checkAuth',
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return thunkAPI.rejectWithValue('Нет токена авторизации');
      }
      const response = await getUserApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка при получении данных пользователя'
      );
    }
  }
);

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
      removeTokens();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Ошибка при выходе из системы'
      );
    }
  }
);

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
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
      // Login
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
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.getUserLoading = true;
        state.getUserError = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<any>) => {
        state.getUserLoading = false;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.getUserLoading = false;
        state.getUserError = action.payload as string;
      })
      // Forgot Password
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
      // Reset Password
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
      // Get User
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
      // Update User
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
      // Logout
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

export const selectUser = (state: RootState) => state.user.user;
export const selectRegisterLoading = (state: RootState) =>
  state.user.registerLoading;
export const selectRegisterError = (state: RootState) =>
  state.user.registerError;
export const selectLoginLoading = (state: RootState) => state.user.loginLoading;
export const selectLoginError = (state: RootState) => state.user.loginError;
export const selectForgotLoading = (state: RootState) =>
  state.user.forgotLoading;
export const selectForgotError = (state: RootState) => state.user.forgotError;
export const selectResetLoading = (state: RootState) => state.user.resetLoading;
export const selectResetError = (state: RootState) => state.user.resetError;
export const selectGetUserLoading = (state: RootState) =>
  state.user.getUserLoading;
export const selectGetUserError = (state: RootState) => state.user.getUserError;
export const selectUpdateLoading = (state: RootState) =>
  state.user.updateLoading;
export const selectUpdateError = (state: RootState) => state.user.updateError;
export const selectLogoutLoading = (state: RootState) =>
  state.user.logoutLoading;
export const selectLogoutError = (state: RootState) => state.user.logoutError;
