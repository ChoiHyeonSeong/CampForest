import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      className={`
        flex flex-col items-center justify-center h-screen
        bg-light-white
        dark:bg-dark-white
        transition-opacity duration-1000
        ${fadeIn ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="lg:-ms-[5rem] text-center">
        <h1
          className="
            text-2xl sm:text-3xl md:text-5xl mb-4
            text-light-text
            dark:text-dark-text
            font-bold
          "
        >
          404 ERROR
        </h1>

        <div
          className="
            mb-8
            text-light-text-secondary
            dark:text-dark-text-secondary
            text-sm sm:text-base md:text-lg font-medium
          "
        >
          <p>존재하지 않는 주소를 입력하셨거나,</p>
          <p>요청하신 페이지의 주소가 변경 삭제되어 찾을 수 없습니다.</p>
        </div>
        
        <Link
          to="/"
          className="
            px-4 py-2
            bg-light-signature text-white hover:bg-light-signature-hover
            dark:bg-dark-signature dark:hover:bg-dark-signature-hover
            rounded text-sm md:text-base transition duration-300
          "
        >
          홈으로 가기
        </Link>
      </div>   
    </div>
  );
}

export default PageNotFound;
