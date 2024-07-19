import '@styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";


import Navbar from '@components/Navbar/Navbar';

import Login from '@pages/Login';
import Regist from '@pages/Regist';
import MyPage from '@pages/MyPage';
import ProfileEdit from '@pages/ProfileEdit';

function App() {
  return (
    <div className="App scrollbar-hide">
      <Navbar />
      <div className='flex'>
        {/* Desktop Navigation bar용 공간 */}
        <div className='hidden lg:block w-[15rem]'/>
        <div className='flex-grow'>

          {/* 여기서 부터 */}
          <BrowserRouter>
            <Routes>
              <Route path='/user/login' element={<Login/>}/>
              <Route path="/user/regist/*" element={<Regist/>}/>
              <Route path="/user/mypage" element={<MyPage/>}/>
              <Route path="/user/profile/edit" element={<ProfileEdit/>}/>
            </Routes>
          </BrowserRouter>
          {/* 여기까지 컨텐츠 */}
        </div> 
      </div>
    </div>
  );
}

export default App;