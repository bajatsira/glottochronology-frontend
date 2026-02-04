import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// Импортируем гибридную функцию, а не прямой axios instance
import { getLanguages, type IFilterParams } from '../api/languagesApi';
import { mockLanguages, type ILanguage } from '../data/mockLanguages';
import { logout } from './authSlice';

export const fetchLanguages = createAsyncThunk<
  ILanguage[],      
  IFilterParams,    
  { rejectValue: string } 
>(
  'languages/fetchLanguages', 
  async (filters, { rejectWithValue }) => {
    try {
      // Используем функцию, которая сама решит, как делать запрос (Tauri fetch или Axios)
      const data = await getLanguages(filters, mockLanguages);
      
      // Защита: если API вернул что-то странное (не массив), возвращаем моки, чтобы не сломать .map()
      if (!Array.isArray(data)) {
          console.warn("API returned non-array data:", data);
          return mockLanguages;
      }

      return data;
    } catch (err: any) {
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
      })
      .addCase(fetchLanguages.fulfilled, (state, action: PayloadAction<ILanguage[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
        // При ошибке можно загружать моки, чтобы не показывать пустоту
        state.items = mockLanguages; 
      });
  },
});

export const { setLanguageFilters, resetLanguageFilters } = languagesSlice.actions;
export default languagesSlice.reducer;
