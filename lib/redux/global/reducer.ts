import { createSlice } from '@reduxjs/toolkit';

export interface Global {
  search: string;
  refresh: number;
}

const initialState: Global = {
  search: '',
  refresh: 0,
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
    removeGlobal(state, action) {
      return action.payload;
    },
  },
});

export const { setSearch, setRefresh, removeGlobal } = GlobalSlice.actions;
export default GlobalSlice.reducer;
