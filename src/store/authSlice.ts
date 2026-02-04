import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { $api } from '../api/axiosInstance';

// Типы (вручную, как в методичке)
interface User {
  id: number;
  login: string;
  is_linguist: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Thunk для входа (Ручной запрос)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      // Прямой вызов axios без кодогенерации
      const response = await $api.post('/auth/login', credentials);
      // Сохраняем токен сразу
      localStorage.setItem('token', response.data.jwt);
      return response.data; // { jwt, user }
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await $api.post('/users/register', credentials);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'), // При F5 токен остается, но user сбрасывается (по ТЗ)
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.jwt;
      })
      .addCase(loginUser.rejected, (state, _action) => {
        state.status = 'failed';
        // state.error = action.payload; // Типизацию надо уточнить
      });
      // Аналогично для registerUser
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
