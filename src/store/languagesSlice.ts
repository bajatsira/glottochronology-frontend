import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'; // Используем axios напрямую
import type { IFilterParams } from '../api/languagesApi'; // Импортируем только интерфейс
import { mockLanguages, type ILanguage } from '../data/mockLanguages';
import { logout } from './authSlice';

// --- Хелпер для получения URL (тот же, что и в langCalculationsSlice) ---
const getBaseUrl = () => {
  const ZEROTIER_IP = "10.111.255.45";
  const PORT = "8082";
  // @ts-ignore
  const isTauri = !!window.__TAURI_INTERNALS__;
  
  return isTauri 
    ? `http://${ZEROTIER_IP}:${PORT}/api` 
    : '/api';
};

export const fetchLanguages = createAsyncThunk<
  ILanguage[],      
  IFilterParams,    
  { rejectValue: string } 
>(
  'languages/fetchLanguages', 
  async (filters, { rejectWithValue }) => {
    try {
      const baseURL = getBaseUrl();
      
      // Формируем параметры запроса
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.family) params.append('family', filters.family);
      if (filters.writingFamily) params.append('writingFamily', filters.writingFamily);

      const url = `${baseURL}/langs?${params.toString()}`;
      
      console.log("[fetchLanguages] Requesting:", url);

      // Делаем запрос
      const response = await axios.get<ILanguage[]>(url);
      const data = response.data;
      
      // Защита: если API вернул что-то странное
      if (!Array.isArray(data)) {
          console.warn("API returned non-array data:", data);
          return mockLanguages;
      }

      return data;
    } catch (err: any) {
      console.error("[fetchLanguages] Error:", err);
      // Если запрос упал, возвращаем ошибку, чтобы UI знал об этом.
      // (Можно раскомментировать строку ниже, если хотите показывать моки при ошибке сети)
      // return mockLanguages; 
      return rejectWithValue(err.message || 'Failed to fetch languages');
    }
  }
);

interface LanguagesState {
  items: ILanguage[];
  filters: IFilterParams;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LanguagesState = {
  items: [],
  filters: {
    name: '',
    family: '',
    writingFamily: '',
  },
  status: 'idle',
  error: null,
};

export const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    setLanguageFilters: (state, action: PayloadAction<IFilterParams>) => {
      state.filters = action.payload;
    },
    resetLanguageFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
        state.filters = { name: '', family: '', writingFamily: '' };
        state.items = [];
    });
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action: PayloadAction<ILanguage[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
        // state.items = mockLanguages; 
      });
  },
});

export const { setLanguageFilters, resetLanguageFilters } = languagesSlice.actions;

export default languagesSlice.reducer;
