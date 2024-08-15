import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false,
  isApp: false,
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
    },
    setDisplayAppMode: (state) => {
      state.isApp = true;
    },
    setDisplayBrowserMode: (state) => {
      state.isApp = false;
    }
  }
})

export const { lightMode, darkMode, setDisplayAppMode, setDisplayBrowserMode } = themeSlice.actions;
export default themeSlice.reducer;