import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ReactComponent as ArrowDown } from '@assets/icons/aorrow-down.svg';
import LogoWhite from '@assets/logo/logo-darkmode.svg';

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(35);
  const [showSecondPage, setShowSecondPage] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: false,
    });

    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const maxScroll = window.innerHeight;
        const scrollTop = scrollContainer.scrollTop;
        const opacity = 35 + ((scrollTop / maxScroll) * 15);
        setScrollPosition(Math.min(opacity, 50));

        if (scrollTop >= maxScroll && !showSecondPage) {
          setShowSecondPage(true);
        }

        AOS.refresh();
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [showSecondPage]);

  const handleScrollClick = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSkipClick = () => {
    navigate('/');
  };

  return (
    <div className='fixed inset-0 w-screen h-screen z-[200] bg-landing-bg-sm md:bg-landing-bg bg-cover bg-center bg-no-repeat overflow-hidden'>
      {/* 어두운 배경 */}
      <div
        className='fixed inset-0'
        style={{
          backgroundColor: `rgba(66, 66, 66, ${scrollPosition / 100})`, // 초기 opacity 35로 시작, 스크롤에 따라 50으로 증가
          transition: 'background-color 0.5s ease',
        }}
      ></div>

      {/* 로고 */}
      <div className='w-[12rem] fixed top-8 left-10 z-10'>
        <img src={LogoWhite} alt="로고이미지" />
      </div>

      {/* 스크롤 가능한 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className='absolute inset-0 overflow-y-auto scrollbar-hide snap-y snap-mandatory'
      >
        {/* page1 */}
        <div className='flex flex-col flex-all-center w-full h-screen text-white snap-start'>
          <div
            className='text-xl mb-[2.5rem] font-medium border-b-2 border-light-signature'
            data-aos='fade-up'
          >
            캠핑인을 위한 커뮤니티 서비스
          </div>
          <div
            className='text-5xl text-center font-bold'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            <p className='mb-[0.75rem]'>잠자던 캠핑용품,</p>
            <p>새로운 시작이 되다.</p>
          </div>
        </div>

        {/* page2 */}
        <div className='flex flex-col flex-all-center w-full h-screen text-white snap-start'>
          <div
            className={`flex items-center text-2xl font-medium text-center ${showSecondPage ? 'aos-init aos-animate' : ''}`}
            data-aos='fade-up'
            data-aos-delay='500'
          >
            캠핑장비로 <br /> 아직도 고민중이신가요?
          </div>
          <div
            className={`flex items-center text-2xl font-medium text-center my-[2rem] ${showSecondPage ? 'aos-init aos-animate' : ''}`}
            data-aos='fade-up'
            data-aos-delay='1500'
          >
            집에만 두기 아까운 장비를 빌려주고, <br /> 수익을 만들어보세요
          </div>
          <div
            className={`flex items-center text-2xl font-medium text-center ${showSecondPage ? 'aos-init aos-animate' : ''}`}
            data-aos='fade-up'
            data-aos-delay='2500'
          >
            원하는 지역에서 장비를 대여하고
            <br /> 거래해보세요
          </div>
        </div>
      </div>

      {/* 스크롤 표시 */}
      <div
        onClick={handleScrollClick}
        className='flex flex-col justify-center fixed bottom-8 left-1/2 -translate-x-1/2 w-[4rem] h-fit z-20 cursor-pointer'
      >
        <div className='flex flex-all-center rounded-full w-full h-10 border-2 border-light-border-1 mb-[0.5rem]'>
          <ArrowDown className='size-[1.3rem] animate-bounce-slow' />
        </div>
        <p className='text-center text-white text-sm'>SCROLL</p>
      </div>

      {/* skip */}
      <div
        onClick={handleSkipClick} 
        className='fixed bottom-10 right-12 border-[#eee] text-white bg-black bg-opacity-50 w-[4.5rem] h-[2.2rem] cursor-pointer border flex flex-all-center z-20 transform transition-transform duration-300 hover:scale-120'>
        SKIP
      </div>
    </div>
  );
};

export default LandingPage;
