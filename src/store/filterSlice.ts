// src/store/filterSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { IFilterParams } from '../api/languagesApi';

import type { PayloadAction } from '@reduxjs/toolkit';

// Начальное состояние фильтров (все пустые)
const initialState: IFilterParams = {
  name: '',
  family: '',
  writingFamily: '',
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Действие (Action) для обновления фильтров
    setFilters: (state, action: PayloadAction<IFilterParams>) => {
      // Redux Toolkit позволяет писать "мутирующий" код, 
      // но под капотом он делает иммутабельное обновление.
      state.name = action.payload.name;
      state.family = action.payload.family;
      state.writingFamily = action.payload.writingFamily;
    },
    // Действие для сброса фильтров (опционально)
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
