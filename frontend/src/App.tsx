import '@styles/App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from '@components/Navbar/Navbar';

import Login from '@pages/Login';
import Regist from '@pages/Regist';
import Main from '@pages/Main';
import MyPage from '@pages/MyPage';
import ProfileEdit from '@pages/ProfileEdit';
import CampingSearch from '@pages/CampingSearch';
import Transaction from '@pages/Transaction';
import FindPassword from '@pages/FindPassword';

import Write from '@components/Board/Write';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

function App() {
  const isAnyModalOpen = useSelector((state: RootState) => state.modalStore.isAnyModalOpen)

  useEffect(() => {
    if (isAnyModalOpen) {
      // 모달이 열릴 때 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 스크롤 허용
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트가 언마운트될 때 스크롤 허용
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className='flex'>
          {/* Desktop Navigation bar용 공간 */}
          <div className='flex-grow'>
            {/* 여기서 부터 */}
            <Routes>
              <Route path='/' element={<Main />}/>
              <Route path='/user/login' element={<Login/>}/>
              <Route path="/user/regist/*" element={<Regist/>}/>
              <Route path="/user/mypage/*" element={<MyPage/>}/>
              <Route path="/user/profile/edit" element={<ProfileEdit/>}/>
              <Route path='/transaction/*' element={<Transaction/> }/>
              <Route path='/camping' element={<CampingSearch/> }/>
              <Route path='/user/password/*' element={<FindPassword />}/>
            </Routes>
            {/* 여기까지 컨텐츠 */}
          </div> 
        </div>

        {/* 모달은 이 아래부터 */}
        <Write />
      </div>
    </BrowserRouter>
  );
}

export default App;