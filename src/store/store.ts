// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import languagesReducer from './languagesSlice';
import langCalculationsReducer from './langCalculationsSlice'; // <-- Обновленный импорт

export const store = configureStore({
  reducer: {
    auth: authReducer,
    languages: languagesReducer,
    langCalculations: langCalculationsReducer, // <-- Обновленное имя
  },
});
// ...


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
