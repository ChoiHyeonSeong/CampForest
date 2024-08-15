import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ReactComponent as ArrowDown } from '@assets/icons/aorrow-down.svg';
import LogoWhite from '@assets/logo/logo-darkmode.svg';

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(35);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: false,
      mirror: true,
    });

    const handleScroll = () => {
      if (isAnimating) return;

      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const maxScroll = window.innerHeight * 2;
        const scrollTop = scrollContainer.scrollTop;
        const opacity = 35 + ((scrollTop / maxScroll) * 15);
        setScrollPosition(Math.min(opacity, 50));

        const newPage = Math.round(scrollTop / window.innerHeight);
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
          triggerAnimation();
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
  }, [currentPage, isAnimating]);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const handleScrollClick = () => {
    if (isAnimating) return;

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const nextPage = currentPage + 1;
      scrollContainer.scrollTo({
        top: nextPage * window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSkipClick = () => {
    navigate('/');
    localStorage.setItem('isLandingSee', 'true')
  };

  return (
    <div className='fixed inset-0 w-screen h-screen z-[200] bg-landing-bg bg-cover bg-center bg-no-repeat overflow-hidden'>
      {/* 어두운 배경 */}
      <div
        className='fixed inset-0'
        style={{
          backgroundColor: `rgba(66, 66, 66, ${scrollPosition / 100})`,
          transition: 'background-color 0.5s ease',
        }}
      ></div>

      {/* 로고 */}
      <div className='w-[8rem] lg:w-[12rem] fixed top-5 lg:top-8 left-6 lg:left-10 z-10'>
        <img src={LogoWhite} alt="로고이미지" />
      </div>

      {/* 스크롤 가능한 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className='absolute inset-0 overflow-y-auto scrollbar-hide-mo snap-y snap-mandatory'
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* page 1 */}
        <div className='flex flex-col flex-all-center w-full h-screen text-white snap-start'>
          <div
            className='text-sm md:text-xl mb-[1.8rem] md:mb-[2.5rem] font-medium border-b-2 border-light-signature'
            data-aos='fade-up'
          >
            캠핑인을 위한 커뮤니티 서비스
          </div>
          <div
            className='text-2xl md:text-4xl lg:text-5xl text-center font-bold'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            <p className='mb-[0.75rem]'>잠자던 캠핑용품,</p>
            <p>새로운 시작이 되다.</p>
          </div>
        </div>

        {/* page 2 */}
        <div className='flex flex-col flex-all-center w-full h-screen text-white snap-start'>
          <div
            className='flex items-center text-lg md:text-2xl font-medium text-center'
            data-aos='fade-up'
            data-aos-delay='500'
          >
            캠핑장비로 <br /> 아직도 고민중이신가요?
          </div>
          <div
            className='flex items-center text-lg md:text-2xl font-medium text-center my-[2rem]'
            data-aos='fade-up'
            data-aos-delay='1000'
          >
            집에만 두기 아까운 장비를 빌려주고, <br /> 수익을 만들어보세요
          </div>
          <div
            className='flex items-center text-lg md:text-2xl font-medium text-center'
            data-aos='fade-up'
            data-aos-delay='1500'
          >
            원하는 지역에서 장비를 대여하고
            <br /> 거래해보세요
          </div>
        </div>

        {/* page 3 */}
        <div className='flex flex-col flex-all-center w-screen h-screen text-white snap-start'>
          <div className='flex flex-all-center w-full h-[20%] lg:h-[35%]'>
            <p className='text-2xl lg:text-4xl mt-[2rem] lg:mt-[4rem] font-semibold'>주요 기능</p>
          </div>
          <div className='flex flex-col flex-all-center w-full h-[80%] lg:h-[65%] bg-white bg-opacity-60 lg:px-[2rem] xl:px-[3.5rem] lg:pb-[8rem]'>
            {/* 기능소개 */}
            <div className='h-[70%] justify-between flex flex-col lg:flex-row flex-all-center w-full mb-[2rem] max-lg:py-[0.75rem] lg:h-[70%] text-black'>
              <div 
                className='w-full lg:w-1/3 text-center lg:border-r-[0.1rem] border-[#666] mb-6 lg:mb-0'
                data-aos='fade-in'
                data-aos-delay='500'
                data-aos-duration='2000'
              >
                <p className='font-bold text-2xl md:text-3xl mb-[1rem] lg:mb-[1.5rem] text-[#ff7f50]'>01</p>
                <div>
                  <p className='font-bold text-base sm:text-[1.2rem] md:text-[1.5rem] xl:text-[1.7rem] mb-[0.5rem] lg:mb-[1rem]'>캠핑장비 대여·판매</p>
                  <p className='font-semibold text-sm sm:text-[1rem] lg:text-[1.05rem] xl:text-lg'>원하는 지역을 설정 후, <br/> 장비를 대여 및 판매해보세요.</p>
                </div>
              </div>
              <div 
                className='w-full lg:w-1/3 text-center lg:border-r-[0.1rem] border-[#666] mb-6 lg:mb-0'
                data-aos='fade-in'
                data-aos-delay='1000'
                data-aos-duration='2000'
              >
                <p className='font-bold text-2xl lg:text-3xl mb-[1rem] lg:mb-[1.5rem] text-[#ff7f50]'>02</p>
                <div>
                  <p className='font-bold text-base sm:text-[1.2rem] md:text-[1.5rem] xl:text-[1.7rem] mb-[0.5rem] lg:mb-[1rem]'>캠핑인들의 커뮤니티</p>
                  <p className='font-semibold text-sm sm:text-[1rem] lg:text-[1.05rem] xl:text-lg'>캠핑일상을 공유해보고,<br/>취향이 맞는 유저를 찾아보세요.</p>
                </div>
              </div>
              <div 
                className='w-full lg:w-1/3 text-center'
                data-aos='fade-in'
                data-aos-delay='1500'
                data-aos-duration='2000'
              >
                <p className='font-bold text-2xl lg:text-3xl mb-[1rem] lg:mb-[1.5rem] text-[#ff7f50]'>03</p>
                <div>
                  <p className='font-bold text-base sm:text-[1.2rem] md:text-[1.5rem] xl:text-[1.7rem] mb-[0.5rem] lg:mb-[1rem]'>원하는 캠핑장 찾기</p>
                  <p className='font-semibold text-sm sm:text-[1rem] lg:text-[1.05rem] xl:text-lg'>원하는 조건에 맞는 캠핑장을 찾고, <br/>후기를 확인해보세요.</p>
                </div>
              </div>
            </div>
            {/* 버튼 */}
            <div className='flex justify-center w-full mt-[2.5rem] lg:mt-[3rem] font-medium '>
              {/* 시작하기 */}
              <button 
                onClick={handleSkipClick}
                className='w-[60%] lg:w-[25%] py-[0.25rem] lg:py-[0.5rem] border-2 border-[#ff7f50] text-white bg-[#ff7f50] relative overflow-hidden group'
              >
                <span className='relative z-10 group-hover:text-[#ff7f50] transition-colors duration-300'>시작하기</span>
                <div className='absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0'></div>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* 스크롤 표시 */}
      {currentPage < 2 && (
        <div
          onClick={handleScrollClick}
          className='flex flex-col justify-center fixed bottom-[2rem] left-1/2 -translate-x-1/2 w-[3rem] md:w-[4rem] h-fit z-20 cursor-pointer'
        >
          <div className='flex flex-all-center rounded-full w-full h-10 border-2 border-light-border-1 mb-[0.5rem]'>
            <ArrowDown className='size-[1.3rem] animate-bounce' />
          </div>
          <p className='text-center text-white text-sm'>SCROLL</p>
        </div>
      )}

      {/* skip */}
      {currentPage < 2 && (
        <div
          onClick={handleSkipClick} 
          className='fixed bottom-4 right-6 md:bottom-10 md:right-12 border-[#eee] text-white bg-black bg-opacity-50 w-[3.8rem] md:w-[4.5rem] h-[2.2rem] cursor-pointer border flex flex-all-center z-20 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-opacity-70'
        >
          SKIP
        </div>
      )}
    </div>
  );
};

export default LandingPage;