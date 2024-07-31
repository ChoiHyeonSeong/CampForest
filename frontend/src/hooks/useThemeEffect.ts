import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { lightMode, darkMode } from '@store/themeSlice';

export const useThemeEffect = () => {
  const dispatch = useDispatch();

  const save = ( value: string ) => {
    localStorage.setItem( 'theme', value );
  }

  useEffect( () => {
    const theme = localStorage.getItem( 'theme' );

    if ( !theme || theme === 'light') {
      dispatch( lightMode() );
    } else {
      dispatch( darkMode() );
    }
    
    save( theme || 'light' );
    
    const mediaCheck = window.matchMedia( '(prefers-color-scheme: dark)' ).matches;

    if ( theme !== 'dark' && mediaCheck ) {
      dispatch( darkMode() );
      save( 'dark' );
    } else if (theme === 'dark' && !mediaCheck) {
      dispatch( lightMode() );
      save( 'light' );
    }

  }, [] );
}