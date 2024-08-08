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

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { setIsBoardWriteModal } from '@store/modalSlice';
import Product from '@pages/Product';
import BoardDetail from '@components/Board/BoardDetail';
import { useThemeEffect } from '@hooks/useThemeEffect';
import SearchPage from '@pages/SearchPage';
import { WebSocketProvider } from 'Context/WebSocketContext'
import { communityChatList } from '@services/communityChatService';
import { store } from '@store/store';
import { setCommunityChatUserList, setTotalUnreadCount } from '@store/chatSlice';
import { ChatUserType } from '@components/Chat/ChatUser';
import LandingPage from '@pages/LandingPage';

function App() {
  const modals = useSelector((state: RootState) => state.modalStore);
  const dispatch = useDispatch()
  const currentLoc = useLocation();

  useThemeEffect();

  // 일반 채팅방 목록 가져오기
  const fetchCommunityChatList = async () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      const response = await communityChatList(Number(userId));
      let count = 0;
      response.map((chatUser: ChatUserType) => {
        count += chatUser.unreadCount;
      })
      store.dispatch(setTotalUnreadCount(count));
      store.dispatch(setCommunityChatUserList(response));
    }
  }
  
  useEffect(() => {
    fetchCommunityChatList();
  }, []);

  useEffect(() => {
    const bodyBox = document.querySelector('body') as HTMLElement;
    bodyBox.classList.add('bg-light-white');
    bodyBox.classList.add('dark:bg-dark-white');
    bodyBox.classList.add('text-light-black');
    bodyBox.classList.add('dark:text-dark-black');
  }, []);

  useEffect(() => {
    const contentBox = document.getElementById('contentBox');
    contentBox?.scrollTo({
      top: 0,
    });
    dispatch(setIsBoardWriteModal(false));
  }, [currentLoc]);

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
              <Route path="/landing" element={<LandingPage />} />
            </Routes>
            {/* 여기까지 컨텐츠 */}
          </div>
        </div>
        {/* 모달은 이 아래부터 */}
        {modals.isBoardWriteModal ? <BoardWrite /> : <></>}
        {modals.isLoading ? <LoadingModal /> : <></>}
      </div>
    </WebSocketProvider>
  );
}

export default App;
