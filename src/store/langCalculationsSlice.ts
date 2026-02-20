import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generatedApi } from '../api/generatedClient';
import type { DsLangCalculation } from '../api/generated-api';
import { logout } from './authSlice';
import axios from 'axios'; 

// --- Хелпер для получения URL (для ручных запросов axios) ---
const getBaseUrl = () => {
  const ZEROTIER_IP = "10.111.255.45";
  const PORT = "8082";
  // @ts-ignore
  const isTauri = !!window.__TAURI_INTERNALS__;
  return isTauri 
    ? `http://${ZEROTIER_IP}:${PORT}/api` 
    : '/api';
};

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

// 3. Добавить язык в черновик
export const addLangToDraft = createAsyncThunk<void, { draftId: number, langId: number }>(
    'langCalculations/addLangToDraft',
    async ({ langId }, { rejectWithValue, dispatch }) => {
        try {
            await generatedApi.api.langCalculationLangsCreate(langId);
            dispatch(fetchLangCalculations()); 
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// 4. Удалить язык из заявки
export const removeLangFromDraft = createAsyncThunk<void, { draftId: number, langId: number }>(
    'langCalculations/removeLang',
    async ({ draftId, langId }, { rejectWithValue, dispatch }) => {
        try {
            await generatedApi.api.langCalculationLangsDelete(draftId, { language_id: langId });
            dispatch(fetchLangCalculationById(draftId)); 
            dispatch(fetchLangCalculations()); 
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



// 7. Установить базовый язык (Использует Axios + getBaseUrl)
export const setBaseLanguage = createAsyncThunk(
  'langCalculations/setBaseLanguage',
  async ({ calculationId, languageId }: { calculationId: number; languageId: number }, { rejectWithValue }) => {
    try {
      const baseURL = getBaseUrl();
      // baseURL уже содержит '/api', добавляем остальной путь
      const url = `${baseURL}/lang-calculation/${calculationId}/base/${languageId}`;
      
      console.log("Sending PUT request to:", url);

      await axios.put(
        url,
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      return { calculationId, languageId };
    } catch (error: any) {
      console.error("Set Base Language Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Обработка заявки модератором (Завершить / Отклонить)
export const processCalculationByModerator = createAsyncThunk<
  void, 
  { id: number; action: 'завершить' | 'отклонить' }
>(
  'langCalculations/processByModerator',
  async ({ id, action }, { rejectWithValue, dispatch }) => {
      try {
          const baseURL = getBaseUrl();
          const url = `${baseURL}/lang-calculation/${id}/complete`;
          
          await axios.put(
            url,
            { action }, // Отправляем тело { action: 'завершить' } или { action: 'отклонить' }
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
          );
          
          // После успешного выполнения обновляем список заявок
          dispatch(fetchLangCalculations()); 
      } catch (err: any) {
          return rejectWithValue(err.response?.data || err.message);
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
          state.status = 'idle';
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

    // --- ОБРАБОТКА setBaseLanguage (БЕЗ GLOBAL LOADING) ---
    builder.addCase(setBaseLanguage.fulfilled, (state, action) => {
        const { calculationId, languageId } = action.payload;

        // Хелпер для обновления флагов внутри массива языков
        const updateLanguagesFlags = (languages: any[]) => {
             languages.forEach(l => {
                 // isBase = true только для выбранного языка, остальным false
                 // Приводим к Number для надежности сравнения
                 l.isBase = (Number(l.language.id) === Number(languageId));
             });
        };

        // 1. Обновляем в общем списке items
        const listCalc = state.items.find(c => c.id === calculationId);
        if (listCalc) {
            listCalc.baseLanguageID = languageId;
            if (listCalc.languages) updateLanguagesFlags(listCalc.languages);
        }

        // 2. Обновляем в currentDetail (ОБЯЗАТЕЛЬНО для отображения галочки на странице)
        if (state.currentDetail && state.currentDetail.id === calculationId) {
            state.currentDetail.baseLanguageID = languageId;
            if (state.currentDetail.languages) updateLanguagesFlags(state.currentDetail.languages);
        }

        // 3. Обновляем в черновике (если он есть отдельно)
        if (state.draft && state.draft.id === calculationId) {
            state.draft.baseLanguageID = languageId;
            if (state.draft.languages) updateLanguagesFlags(state.draft.languages);
        }
    });

    // --- СТАНДАРТНЫЕ FETCH ЗАПРОСЫ ---

    builder
      .addCase(fetchLangCalculations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.draft = action.payload.find(req => req.status === 'черновик') || null;
      })
      .addCase(fetchLangCalculationById.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.currentDetail = action.payload;
      });

      // --- ГЛОБАЛЬНЫЙ МАТЧЕР СТАТУСОВ ---
      
      // 1. LOADING
      // ВАЖНО: Исключаем 'setBaseLanguage', чтобы не вешать спиннер на всю страницу при клике на галочку
      builder.addMatcher(
          (action) => action.type.endsWith('/pending') && !action.type.includes('setBaseLanguage'),
          (state) => { state.status = 'loading'; state.error = null; }
      );

      // 2. FAILED
      builder.addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: any) => { state.status = 'failed'; state.error = action.payload; }
      );
  },
});

export const { clearCurrentDetail } = langCalculationsSlice.actions;
export default langCalculationsSlice.reducer;
