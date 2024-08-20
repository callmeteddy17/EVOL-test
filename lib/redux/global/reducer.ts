import { createSlice } from '@reduxjs/toolkit';

export interface Global {
  search: string;
  refresh: number;
  filter: 'asc' | 'desc';
}

const initialState: Global = {
  search: '',
  refresh: 0,
  filter: 'desc',
};

const GlobalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setRefresh(state, action) {
      state.refresh = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    removeGlobal(state, action) {
      return action.payload;
    },
  },
});

export const { setFilter, setSearch, setRefresh, removeGlobal } =
  GlobalSlice.actions;
export default GlobalSlice.reducer;
