import '@styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";


import Navbar from '@components/Navbar/Navbar';

import Push from '@components/Navbar/Push';

import Login from '@pages/Login';
import Regist from '@pages/Regist';
import Main from '@pages/Main';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Push />
      <div className='flex'>
        {/* Desktop Navigation bar용 공간 */}
        <div className='hidden lg:block w-[15rem]'/>
        <div className='flex-grow'>

          {/* 여기서 부터 */}
          <BrowserRouter>
            <Routes>
              <Route path='/user/login' element={<Login/>}/>
              <Route path="/user/regist/*" element={<Regist/>}/>
              <Route path='/' element={<Main />}/>
            </Routes>
          </BrowserRouter>
          {/* 여기까지 컨텐츠 */}
        </div> 
      </div>
    </div>
  );
}

export default App;