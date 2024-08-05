import '@styles/App.css';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from '@components/Navbar/Navbar';
import Login from '@pages/Login';
import Regist from '@pages/Regist';
import Main from '@pages/Main';
import UserPage from '@pages/UserPage';
import ProfileEdit from '@pages/ProfileEdit';
import CampingSearch from '@pages/CampingSearch';
import FindPassword from '@pages/FindPassword';
import Community from '@pages/Community';
import BoardWrite from '@components/Board/BoardWrite';
import LoadingModal from '@components/Public/LoadingModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { setIsBoardWriteModal } from '@store/modalSlice';
import Product from '@pages/Product';
import BoardDetail from '@components/Board/BoardDetail';
import { useThemeEffect } from '@hooks/useThemeEffect';
import SearchPage from '@pages/SearchPage';
import { WebSocketProvider } from 'Context/WebSocketContext'

function App() {
  const dispatch = useDispatch();
  const isAnyModalOpen = useSelector((state: RootState) => state.modalStore.isAnyModalOpen);
  const currentLoc = useLocation();

  useThemeEffect();

  useEffect(() => {
    // 네이버 API 호출
    const naverMapApiKey = process.env.REACT_APP_NAVERMAP_API_KEY;
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapApiKey}`;
    document.head.appendChild(script);

    const bodyBox = document.querySelector('body') as HTMLElement;
    bodyBox.classList.add('bg-light-white');
    bodyBox.classList.add('dark:bg-dark-white');
    bodyBox.classList.add('text-light-black');
    bodyBox.classList.add('dark:text-dark-black');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setIsBoardWriteModal(false));
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
    <WebSocketProvider>
      <div className="App h-screen overflow-hidden">
        <Navbar />
        <div className='flex h-full'>
          {/* padding은 Navigation bar용 공간 */}
          <div className='flex-grow h-[100vh-5.95rem] md:h-[100vh-3.2rem] lg:h-screen mt-[3.2rem] lg:mt-0 mb-[2.75rem] md:mb-0 lg:ps-[5rem] overflow-y-auto' id='contentBox'>
            {/* 여기서 부터 */}
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/user/login' element={<Login />} />
              <Route path="/user/regist/*" element={<Regist />} />
              <Route path="/user/:userId/*" element={<UserPage />} />
              <Route path="/user/profile/edit" element={<ProfileEdit />} />
              <Route path='/product/*' element={<Product />} />
              <Route path='/camping' element={<CampingSearch />} />
              <Route path='/user/password/*' element={<FindPassword />} />
              <Route path="/community/:category" element={<Community />} />
              <Route path="/board/detail/:boardId" element={<BoardDetail />} />
              <Route path="/search/*" element={<SearchPage />} />
            </Routes>
            {/* 여기까지 컨텐츠 */}
          </div>
        </div>
        {/* 모달은 이 아래부터 */}
        <BoardWrite />
        <LoadingModal />
      </div>
    </WebSocketProvider>
  );
}

export default App;
