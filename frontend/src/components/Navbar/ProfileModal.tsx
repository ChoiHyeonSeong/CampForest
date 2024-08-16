import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { logout } from '@services/authService';
import DefaultProfileImg from '@assets/images/basic_profile.png'
import { useNavigate } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = (props: Props) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userStore);
  
  const loggedout = async () => {
    await logout()
    navigate('/')
    window.location.reload();
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DefaultProfileImg;
  };
  
  useEffect(() => {
    window.addEventListener('resize', props.onClose);
  }, []);
  
  return (
    <div 
      className={`
        ${props.isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'}
        fixed right-[1rem] top-[4rem] lg:right-[1rem] lg:top-[3rem] z-[100] w-[16rem]
        bg-light-white
        dark:bg-dark-white
        rounded-lg shadow-lg transition-all duration-300 ease-out
      `}
    >
      <div className={`relative p-[1rem]`}>
        <button onClick={props.onClose} className={`absolute top-[0.5rem] right-[0.5rem]`}>
          ×
        </button>
        <div className={`flex flex-col items-center`}>
          {user.isLoggedIn ? (
              <>
                <div className={`w-[5rem] h-[5rem] mb-[1rem] bg-light-gray dark:bg-dark-gray rounded-full overflow-hidden`}>
                  <img 
                    src={`${user.profileImage ? user.profileImage : DefaultProfileImg}`} 
                    alt="" 
                    onError={handleImageError}
                    className='w-full h-full'
                  />
                </div>
                <div className={`mb-[0.5rem] text-lg`}>{user.nickname}</div>
                <Link 
                  to={`/user/${user.userId}`} 
                  onClick={props.onClose} 
                  className={`mb-[1rem] text-light-anchor dark:text-dark-anchor`}
                >
                  마이페이지 보기
                </Link>
                <button 
                  onClick={loggedout} 
                  className={`px-[1rem] py-[0.5rem] border-light-border dark:border-dark-border border rounded-lg`}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/user/login" 
                  onClick={props.onClose} 
                  className={`px-[1rem] py-[0.5rem] cursor-pointer`}
                >
                  로그인 하러가기
                </Link>
              </>
            )
          }
          
        </div>
      </div>

    </div>
  );
};

export default ProfileModal;
