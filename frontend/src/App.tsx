import '@styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import RouterTest from '@components/RouterTest';

import Navbar from '@components/Navbar/Navbar';

// 임시
import UserInformation from '@components/User/UserInformation';
// 임시

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className='flex'>
        {/* Desktop Navigation bar용 공간 */}
        <div className='hidden lg:block w-56'/>
        <div className='flex-grow'>

          {/* 여기서 부터 */}

          {/* 임시 */}
          <UserInformation></UserInformation>
          {/* 임시 */}

          {/* <div className='font-semibold'>Tailwind Test</div>
          <div className='h-96'>To scroll</div>
          <div className='h-96'>To scroll</div>
          <div className='h-96'>To scroll</div> */}

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RouterTest/>}/>
            </Routes>
          </BrowserRouter>
          {/* 여기까지 컨텐츠 */}

        </div> 
      </div>
    </div>
  );
}

export default App;
