import '@styles/App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { setIsBoardWriteModal } from '@store/modalSlice';
import { useThemeEffect } from '@hooks/useThemeEffect';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 

import LogoFavicon from '@assets/logo/logo-small.png'

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
import ReviewPage from '@components/Product/WriteReview'
import Product from '@pages/Product';
import SearchPage from '@pages/SearchPage';
import LandingPage from '@pages/LandingPage';
import useSSE from '@hooks/useSSE';

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
  
  
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [hideBanner, setHideBanner] = useState(true);

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

  const handleCloseBanner = () => {
    setHideBanner(true);
  };

  const handleTransitionEnd = () => {
    if (hideBanner) {
      setShowBanner(false);
    }
  };

  useEffect(() => {
    if (showBanner) {
      setTimeout(() => {
        setHideBanner(false);
      }, 500);
    }
  }, [showBanner]);

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
      <div className="App h-screen overflow-hidden bg-light-background dark:bg-dark-background">

        {/* 이 아래가 PWA 설치 배너 */}
        {showBanner && (
          <div 
            className={`
              install-banner
              flex flex-all-center fixed top-0 left-1/2 transform -translate-x-1/2 z-[500] 
              w-screen lg:w-fit h-[5rem] ps-[2rem]
              bg-light-black text-light-white 
              dark:bg-dark-black dark:text-dark-white
              ${hideBanner ? 'translate-y-[-100%]' : 'translate-y-0'}
              transition-transform duration-500 lg:rounded-b-lg
            `}
            onTransitionEnd={handleTransitionEnd}
          >
            <p className='max-md:text-sm'>앱을 설치하여 더 나은 경험을 누려보세요!</p>
            <div className='ms-[1rem]'>
              <img onClick={handleInstallClick} src={LogoFavicon} alt="" className='w-[50%] cursor-pointer'/>
            </div>
            <CloseIcon 
              onClick={handleCloseBanner}
              className={`
                absolute top-2 right-2 md:size-[1.5rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
                cursor-pointer
              `}
            />
          </div>
        )} 

        <Navbar />

        <div className='flex h-full'>
          {/* padding은 Navigation bar용 공간 */}
          <div className='flex-grow w-screen md:w-[calc(100vh-28px)] lg:w-[calc(100vh-5rem-28px)] h-[100vh-6.4rem] md:h-[100vh-3.2rem] lg:h-screen mt-[3.2rem] lg:mt-0 mb-[3.2rem] md:mb-0 lg:ms-[5rem] overflow-y-auto' id='contentBox'>
            {/* 여기서 부터 */}
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
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
              <Route path='/review' element={<ReviewPage />} />
            </Routes>
            {/* 여기까지 컨텐츠 */}
          </div>
        </div>
        {/* 모달은 이 아래부터 */}
        {modals.isBoardWriteModal ? <BoardWrite /> : <></>}
        {modals.isLoading ? <LoadingModal /> : <></>}
      </div>
    </div>
  );
}

export default App;
