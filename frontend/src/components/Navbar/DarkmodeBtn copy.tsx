import { RootState } from '@store/store'
import { darkMode, lightMode } from '@store/themeSlice';
import { useDispatch, useSelector } from 'react-redux'

const DarkmodeBtn = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.themeStore).isDark;

  const save = (value: string) => {
    localStorage.setItem('theme', value);
  }

  const toggleDarkmode = (): void => {
    if (isDark) {
      dispatch(lightMode());
      save('light');
    } else {
      dispatch(darkMode());
      save('dark');
    }
  }

  return (    
    <div 
      onClick={toggleDarkmode}
      className={`
        w-[4rem] h-[1.25rem]
        bg-light-black
        dark:bg-dark-black
        rounded-3xl cursor-pointer
      `}
    >
      <div 
        className={`
          ${isDark ? 'translate-x-6' : '-translate-x-0'}
          w-[2.5rem] h-[1.25rem]
          bg-light-signature
          dark:bg-dark-signature
          rounded-3xl transition-all duration-300
        `}
      />
    </div>
  )
}

export default DarkmodeBtn