import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  
  return (
    <div 
      className={`
        ${props.isOpen ? 'block' : 'hidden'}
        absolute right-0 top-[3rem] z-[100] w-[16rem]
        bg-light-white
        dark:bg-dark-white
        rounded-lg shadow-lg
      `}
    >
      <div className={`relative p-[1rem]`}>
        <button onClick={props.onClose} className={`absolute top-[0.5rem] right-[0.5rem]`}>
          ×
        </button>
        <div className={`flex flex-col items-center`}>
          {user.isLoggedIn ? (
              <>
                <div className={`w-[5rem] h-[5rem] mb-[1rem] bg-light-gray dark:bg-dark-gray rounded-full`}></div>
                <div className={`mb-[0.5rem] text-lg`}>사용자닉네임</div>
                <Link to="/my-page" className={`mb-[1rem] text-light-anchor dark:text-dark-anchor`}>마이페이지 보기</Link>
                <button onClick={props.onClose} className={`px-[1rem] py-[0.5rem] border-light-border dark:border-dark-border border rounded-lg`}>로그아웃</button>
              </>
            ) : (
              <>
                <div onClick={props.onClose} className={`px-[1rem] py-[0.5rem] cursor-pointer`}>로그인 하러가기</div>
              </>
            )
          }
          
        </div>
      </div>

    </div>
  );
};

export default ProfileModal;
