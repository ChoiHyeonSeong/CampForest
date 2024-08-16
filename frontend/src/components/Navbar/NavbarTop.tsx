import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import ProfileModal from './ProfileModal';
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg'
import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'
import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'

import ProfileImage from '@assets/images/basic_profile.png'
import NavTopPushModal from './NavTopPushModal';
import { readNotification } from '@services/notificationService';
import { updateNotificationList } from '@store/notificationSlice';


const routeMapping = [
  { path: '/', text: '메인' },
  { path: '/user/login', text: '로그인' },
  { path: '/user/regist/*', text: '회원가입' },
  { path: '/user/:userId/*', text: '회원정보' },
  { path: '/user/profile/edit', text: '회원정보 수정' },
  { path: '/user/delete', text: '회원탈퇴' },
  { path: '/product/*', text: '판매/대여' },
  { path: '/camping', text: '캠핑장 찾기' },
  { path: '/user/password/*', text: '비밀번호 찾기' },
  { path: '/community/:category', text: '커뮤니티' },
  { path: '/search/*', text: '검색' },
  { path: '/search', text: '검색' },
  { path: '/landing', text: '설명' },
  { path: '/review', text: '리뷰' }
];

type Props = {
  toggleMenu: () => void;
  closeMenu: () => void;
  customLocText?: string;
}

const NavbarTop = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userStore);
  const [locPath, setLocPath] = useState<string | null>(null);
  const [locText, setlocText] = useState<string | null>(null);
  const currentLoc = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  const readAllNotifications = async () => {
    try {
      await readNotification()
      dispatch(updateNotificationList());
    } catch (error) {
      console.error('읽음 처리 실패: ', error);
    }
  }

  useEffect(() => {
    if (locPath !== null) {
      setlocText(props.customLocText || getLocationText(locPath))
    }
  }, [locPath, props.customLocText])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isPushModalOpen) {
        readAllNotifications();
      }
    };

    if (isPushModalOpen) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPushModalOpen]);

  const togglePushModal = () => {
    setIsPushModalOpen(!isPushModalOpen);
    if (!isPushModalOpen) {
      setIsProfileModalOpen(false);
    }
  };

  const closePushModal = () => {
    if(isPushModalOpen) {
      readAllNotifications();
    }
    setIsPushModalOpen(false);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
    if (!isProfileModalOpen) {
      setIsPushModalOpen(false);
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  useEffect(() => {
    setLocPath(currentLoc.pathname)
  }, [currentLoc]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = ProfileImage;
  };

  const getLocationText = (pathname: string) => {
    const route = routeMapping.find(route => {
      // 패턴이 * 또는 :param으로 끝나는 경우 정규식 처리
      const regexPath = route.path
        .replace(/\*/g, '.*')            // 와일드카드 처리
        .replace(/\/:[^\/]+/g, '/[^/]+'); // 파라미터 처리 (예: /community/:category)
      
      const regex = new RegExp(`^${regexPath}$`);
      return regex.test(pathname);
    });
  
    return route ? route.text : '';
  };

  useEffect(() => {
    if (locPath !== null) {
      setlocText(getLocationText(locPath))
    }
  }, [locPath])

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div 
      className={`
        flex justify-between fixed lg:top-0 md:right-0 z-[20] lg:z-[30] w-[100%] lg:w-[1.75rem] h-[3.2rem] py-[0.25rem] ps-[0.5rem] md:ps-0 lg:mx-[1rem] 
        bg-light-white
        dark:bg-dark-white
        lg:bg-inherit border-light-border-1
        dark:lg:bg-inherit dark:border-dark-border-1
        max-lg:border-b
      `}  
    >
      <div>
        <div
          onClick={props.toggleMenu}
          className={`hidden md:flex lg:hidden flex-all-center w-[2.75rem] h-[100%] me-[1rem] cursor-pointer`}
        >
          <HamMenuIcon 
            className={`
              size-[2rem]
              stroke-light-black
              dark:stroke-dark-black
            `}
          />
        </div>

        <div className={`flex md:hidden items-center w-[8rem] h-[100%]`}>
          { locPath === '/' ?
            <BigLogoIcon className={`w-[8rem] fill-light-black dark:fill-dark-black`}/> :
            <div className='flex items-center'>
              <ArrowLeftIcon
                onClick={handleBackNavigation}
                className='fill-light-black dark:fill-dark-black size-[1.4rem] me-[0.25rem] cursor-pointer'
              />

              <div className={`text-xl`}>
                {locText}
              </div>
            </div>
            
          }
        </div>
      </div>

      <div className={`max-md:hidden lg:hidden`}>
        <Link to='/' onClick={props.closeMenu}>
          <BigLogoIcon className={`w-[10rem] fill-light-black dark:fill-dark-black`}/>
        </Link>
      </div>

      {/* 알림 */}
      <div className={`flex items-center justify-end w-[6rem] lg:w-[1.75rem] lg:ms-auto me-[0.75rem] lg:me-0`}>
        <div className='relative'>
          <PushIcon
            onClick={togglePushModal}
            className={`
              block lg:hidden size-[1.45rem] 
              stroke-light-black
              dark:stroke-dark-black
              cursor-pointer
            `}
          />
          <NavTopPushModal
            isOpen={isPushModalOpen}
            onClose={closePushModal}
          />
        </div>
        
        {/* 마이프로필 */}
        <div className={`relative`}>
          <div 
            onClick={toggleProfileModal}
            className={`
              hidden md:block size-[1.85rem] ms-[0] md:ms-[0.75rem] lg:ms-0
              overflow-hidden rounded-full cursor-pointer hover:scale-105 transition-transform duration-300
            `}
          >
            <img 
              src={user.profileImage ? user.profileImage : ProfileImage} 
              alt="NOIMG" 
              onError={handleImageError}  
              className='w-full h-full'
            />
          </div>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={closeProfileModal}
          />
        </div>
      </div>
    </div>
  )
}

export default NavbarTop