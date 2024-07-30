/* eslint-disable react-hooks/exhaustive-deps */

import '@styles/App.css';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from '@components/Navbar/Navbar';

import Login from '@pages/Login';
import Regist from '@pages/Regist';
import Main from '@pages/Main';
import MyPage from '@pages/MyPage';
import ProfileEdit from '@pages/ProfileEdit';
import CampingSearch from '@pages/CampingSearch';
import FindPassword from '@pages/FindPassword';

import Write from '@components/Board/Write';
import LoadingModal from '@components/LoadingModal'

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { setIsBoardWriteModal } from '@store/modalSlice';
import Product from '@pages/Product';
import BoardDetail from '@components/Board/BoardDetail';

function App() {
  const dispatch = useDispatch()
  const isAnyModalOpen = useSelector((state: RootState) => state.modalStore.isAnyModalOpen)
  const currentLoc = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setIsBoardWriteModal(false))
  }, [currentLoc]);

  useEffect(() => {
    const currentScrollY = window.scrollY;
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    
    if (isAnyModalOpen) {
      // 모달이 열릴 때 스크롤 방지
      contentBox.classList.add('no-scroll');
      contentBox.style.top = `-${currentScrollY}px`;
    } else {
      // 모달이 닫힐 때 스크롤 허용
      const scrollY = parseInt(contentBox.style.top || '0') * -1;
      contentBox.style.top = '';
      contentBox.classList.remove('no-scroll');
      window.scrollTo(0, scrollY || currentScrollY);
    }
  }, [isAnyModalOpen]);

  return (
    <div className="App">
      <Navbar />
      <div className='flex'>
        {/* Desktop Navigation bar용 공간 */}
        <div className='flex-grow pt-[3.2rem]' id='contentBox'>
          {/* 여기서 부터 */}
          <Routes>
            <Route path='/' element={<Main />}/>
            <Route path='/user/login' element={<Login/>}/>
            <Route path="/user/regist/*" element={<Regist/>}/>
            <Route path="/user/mypage/*" element={<MyPage/>}/>
            <Route path="/user/profile/edit" element={<ProfileEdit/>}/>
            <Route path='/product/*' element={<Product />}/>
            <Route path='/camping' element={<CampingSearch/> }/>
            <Route path='/user/password/*' element={<FindPassword />}/>
            <Route path='/board/detail' element={<BoardDetail />}/>
          </Routes>
          {/* 여기까지 컨텐츠 */}
        </div> 
      </div>
      {/* 모달은 이 아래부터 */}
      <Write />
      <LoadingModal />

    </div>
  );
}

export default App;