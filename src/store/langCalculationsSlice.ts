// src/store/langCalculationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generatedApi } from '../api/generatedClient';
import type { DsLangCalculation } from '../api/generated-api';
import { logout } from './authSlice';

// 1. Получить список всех заявок
export const fetchLangCalculations = createAsyncThunk<DsLangCalculation[]>(
  'langCalculations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await generatedApi.api.langCalculationList();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error fetching list');
    }
  }
);

// 2. Получить детали конкретной заявки
export const fetchLangCalculationById = createAsyncThunk<DsLangCalculation, number>(
  'langCalculations/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await generatedApi.api.langCalculationDetail(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error fetching details');
    }
  }
);

// 3. Добавить язык в черновик (М-М)
// ИСПРАВЛЕНО: Бэкенд ожидает ID языка в URL (POST /api/lang-calculation/{LanguageID}/langs)
export const addLangToDraft = createAsyncThunk<void, { draftId: number, langId: number }>(
    'langCalculations/addLangToDraft',
    async ({ langId }, { rejectWithValue, dispatch }) => {
        try {
            // Передаем langId как первый аргумент, он попадет в URL: .../{langId}/langs
            // Второй аргумент (params) оставляем пустым или не передаем вовсе.
            await generatedApi.api.langCalculationLangsCreate(langId);
            
            // Обновляем список, чтобы пересчитать счетчик корзины
            dispatch(fetchLangCalculations()); 
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// 4. Удалить язык из заявки (М-М)
// Бэкенд: DELETE /api/lang-calculation/{DraftID}/langs?language_id={LanguageID}
export const removeLangFromDraft = createAsyncThunk<void, { draftId: number, langId: number }>(
    'langCalculations/removeLang',
    async ({ draftId, langId }, { rejectWithValue, dispatch }) => {
        try {
            // generated-api принимает (id, query, params)
            await generatedApi.api.langCalculationLangsDelete(draftId, { language_id: langId });
            
            dispatch(fetchLangCalculationById(draftId)); // Обновляем текущую заявку
            dispatch(fetchLangCalculations()); // Обновляем счетчик
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// 5. Подтвердить (сформировать) заявку
export const confirmCalculation = createAsyncThunk<void, number>(
    'langCalculations/confirm',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await generatedApi.api.langCalculationFormUpdate(id);
            dispatch(fetchLangCalculations());
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// 6. Удалить заявку
export const deleteCalculation = createAsyncThunk<void, number>(
    'langCalculations/delete',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await generatedApi.api.langCalculationDelete(id);
            dispatch(fetchLangCalculations());
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

interface LangCalculationsState {
  items: DsLangCalculation[];
  draft: DsLangCalculation | null;
  currentDetail: DsLangCalculation | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LangCalculationsState = {
  items: [],
  draft: null,
  currentDetail: null,
  status: 'idle',
  error: null,
};

export const langCalculationsSlice = createSlice({
  name: 'langCalculations',
  initialState,
  reducers: {
      clearCurrentDetail: (state) => {
          state.currentDetail = null;
      }
  },
  extraReducers: (builder) => {
    // Реакция на Logout
    builder.addCase(logout, (state) => {
        state.items = [];
        state.draft = null;
        state.currentDetail = null;
        state.status = 'idle';
    });

    builder
      // Fetch All
      .addCase(fetchLangCalculations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // Ищем заявку со статусом 'черновик'
        state.draft = action.payload.find(req => req.status === 'черновик') || null;
      })
      // Fetch Detail
      .addCase(fetchLangCalculationById.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLangCalculationById.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.currentDetail = action.payload;
      })
      // Обработка статусов загрузки и ошибок для всех thunk-ов
      .addMatcher(
          (action) => action.type.endsWith('/pending'),
          (state) => { state.status = 'loading'; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: any) => { state.status = 'failed'; state.error = action.payload; }
      );
  },
});

export const { clearCurrentDetail } = langCalculationsSlice.actions;
export default langCalculationsSlice.reducer;
