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
    <div className='bg-black w-16 h-5 rounded-3xl cursor-pointer' onClick={toggleDarkmode}>
      <div className={`bg-green-500 w-10 h-5 rounded-3xl transition-all duration-300
        ${isDark ? 'translate-x-6' : '-translate-x-0'}`}
      />
    </div>
  )
}

export default DarkmodeBtn