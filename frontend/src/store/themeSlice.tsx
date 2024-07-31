import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false,
}

const themeSlice = createSlice({
  name: 'themeStore',
  initialState,
  reducers: {
    lightMode: (state) => {
      state.isDark = false;
      document.documentElement.classList.remove('dark');
    },
    darkMode: (state) => {
      state.isDark = true;
      document.documentElement.classList.add('dark');
    }
  }
})

export const { lightMode, darkMode } = themeSlice.actions;
export default themeSlice.reducer;