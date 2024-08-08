import React, { useEffect, useState } from 'react';
// import ReactFullpage from '';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import LogoWhite from '@assets/logo/logo-darkmode.svg'

type Props = {}

const LandingPage = (props: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const texts = [
    '잠자던 캠핑용품,새로운 시작이 되다',
    '캠핑장비로 아직도 고민중이신가요?',
    '집에만 두기 아까운 장비를 빌려주고 수익을 만들어보세요 !',
    '캠핑동선에 맞게 원하는 장소에서장비를 빌리고 반납하세요!'
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <></>
  //   <ReactFullpage
  //   scrollingSpeed={1000}
  //   onLeave={(origin, destination) => {
  //     setCurrentSlide(destination.index);
  //   }}
  //   render={({ state, fullpageApi }) => (
  //     <ReactFullpage.Wrapper>
  //       {texts.map((text, index) => (
  //         <div key={index} className="section">
  //           <div className='fixed flex justify-center pt-[15%] inset-0 w-screen h-screen z-[100] bg-landing-bg-lg bg-cover bg-center bg-no-repeat'>
  //             <div className='flex flex-col justify-between items-center h-[45%] text-white text-center'>
  //               <div className=''>
  //                 <img
  //                   alt='로고' 
  //                   src={LogoWhite}
  //                   className='w-[14rem]'  
  //                 />
  //               </div>
  //               <div 
  //                 className='text-[3.2rem] font-bold'
  //                 data-aos="fade-up"
  //                 data-aos-duration="1000"
  //               >
  //                 <p>{text}</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       ))}

  //       {/* 페이지네이션 */}
  //       <div className="fixed right-[2%] top-1/2 -translate-y-1/2 text-white">
  //         {texts.map((_, index) => (
  //           <div
  //             key={index}
  //             className={`w-2 h-2 rounded-full my-2 cursor-pointer ${
  //               currentSlide === index ? 'bg-white' : 'bg-gray-500'
  //             }`}
  //             onClick={() => fullpageApi.moveTo(index + 1)}
  //           />
  //         ))}
  //       </div>

  //       {/* 스크롤 표시 */}
  //       <div className='fixed bottom-[5%] left-1/2 -translate-x-1/2 text-white'>SCROLL</div>

  //       {/* 스킵버튼 */}
  //       <Link to="/" className='fixed right-[5%] bottom-[5%] bg-light-gray-1 px-[1rem] py-[0.25rem] rounded text-white'>
  //         SKIP
  //       </Link>
  //     </ReactFullpage.Wrapper>
  //   )}
  // />
);
};

export default LandingPage