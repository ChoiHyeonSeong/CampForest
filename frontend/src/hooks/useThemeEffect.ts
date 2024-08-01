import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { lightMode, darkMode } from '@store/themeSlice';

export const useThemeEffect = () => {
  const dispatch = useDispatch();

  const save = (value: string) => {
    localStorage.setItem('theme', value);
  };

  useEffect(() => {
    const userTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userTheme === 'dark') {
      dispatch(darkMode());
    } else if (userTheme === 'light') {
      dispatch(lightMode());
    } else if (systemPrefersDark) {
      dispatch(darkMode());
      save('dark');
    } else {
      dispatch(lightMode());
      save('light');
    }

    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!userTheme) {
        if (e.matches) {
          dispatch(darkMode());
          save('dark');
        } else {
          dispatch(lightMode());
          save('light');
        }
      }
    };

    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, [dispatch]);
};