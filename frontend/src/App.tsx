import '@styles/App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { setIsBoardWriteModal } from '@store/modalSlice';
import { useThemeEffect } from '@hooks/useThemeEffect';

import Navbar from '@components/Navbar/Navbar';
import Login from '@pages/Login';
import Regist from '@pages/Regist';
import Main from '@pages/Main';
import UserPage from '@pages/UserPage';
import ProfileEdit from '@pages/ProfileEdit';
import UserDelete from '@pages/UserDelete';
import CampingSearch from '@pages/CampingSearch';
import FindPassword from '@pages/FindPassword';
import Community from '@pages/Community';
import BoardWrite from '@components/Board/BoardWrite';
import LoadingModal from '@components/Public/LoadingModal';
import StarLight from '@components/Public/StarLight';
import ReviewPage from '@components/Product/WriteReview'
import Product from '@pages/Product';
import SearchPage from '@pages/SearchPage';
import LandingPage from '@pages/LandingPage';
import LightMode from '@components/Public/LightMode';
import ForestBg from '@components/Public/ForestBg'
import useSSE from '@hooks/useSSE';
import DuckForest from '@components/Public/DuckForest';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

function App() {
  const modals = useSelector((state: RootState) => state.modalStore);
  const dispatch = useDispatch()
  const currentLoc = useLocation();
  const isDark = useSelector((state: RootState) => state.themeStore.isDark);
  
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // 브라우저 기본 설치 프롬프트 방지
      e.preventDefault();
      // 이벤트 저장
      setInstallPrompt(e);
      // 배너 표시
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    // 설치 프롬프트 표시
    installPrompt.prompt();
    // 사용자의 응답 대기
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 앱 설치를 수락했습니다');
      } else {
        console.log('사용자가 앱 설치를 거부했습니다');
      }
      // 프롬프트 사용 후 초기화
      setInstallPrompt(null);
    });
    // 배너 숨기기
    setShowBanner(false);
  };

  useThemeEffect();
  
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

  useSSE();

  return (
    <div>
      <div className="App h-screen overflow-hidden">
        
        {/* 이 아래가 PWA 설치 배너 */}
        {/*
        {showBanner && (
          <div className="install-banner flex flex-all-center z-[500] fixed top-0 w-screen bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white">
            <p>앱을 설치하여 더 나은 경험을 누려보세요!</p>
            <button onClick={handleInstallClick}>설치하기</button>
          </div>
        )} 
        */}


        <Navbar />
        <div className='flex h-full'>
          {/* padding은 Navigation bar용 공간 */}
          <div className='flex-grow w-screen md:w-[calc(100vh-28px)] lg:w-[calc(100vh-5rem-28px)] h-[100vh-6.4rem] md:h-[100vh-3.2rem] lg:h-screen mt-[3.2rem] lg:mt-0 mb-[3.2rem] md:mb-0 lg:ms-[5rem] overflow-y-auto' id='contentBox'>
            {/* 여기서 부터 */}
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/user/login' element={<Login />} />
              <Route path="/user/regist/*" element={<Regist />} />
              <Route path="/user/:userId/*" element={<UserPage />} />
              <Route path="/user/profile/edit" element={<ProfileEdit />} />
              <Route path="/user/delete" element={<UserDelete />} />
              <Route path='/product/*' element={<Product />} /> 
              <Route path='/camping' element={<CampingSearch />} />
              <Route path='/user/password/*' element={<FindPassword />} />
              <Route path="/community/:category" element={<Community />} />
              <Route path="/search/*" element={<SearchPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path='/review' element={<ReviewPage />} />
            </Routes>
            {/* 여기까지 컨텐츠 */}
          </div>
        </div>
        {/* 모달은 이 아래부터 */}
        {modals.isBoardWriteModal ? <BoardWrite /> : <></>}
        {modals.isLoading ? <LoadingModal /> : <></>}


        {/* 라이트 모드 배경 후보 1  */}
        {/* {!isDark && <LightMode />} */}
        {/* 라이트 모드 배경 후보 2  */}
        {/* {!isDark && <ForestBg />} */}
        {/* 라이트 모드 배경 후보 3  */}
        {!isDark && <DuckForest />}
        {/* 배경 스타라이트 - 다크모드일 때만 렌더링 */}
        {isDark && <StarLight />}
        
      </div>
    </div>
  );
}

export default App;
