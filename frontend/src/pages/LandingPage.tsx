import React, { useState, useEffect, useRef  } from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

import LogoWhite from '@assets/logo/logo-darkmode.svg'

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState('down')
  const textRef = useRef(null)

  const texts = [
    '잠자던 캠핑용품,<br/>새로운 시작이 되다',
    '캠핑장비로 아직도<br/>고민중이신가요?',
    '집에만 두기 아까운 장비를<br/>빌려주고 수익을 만들어보세요!',
    '캠핑동선에 맞게 원하는 장소에서<br/>장비를 빌리고 반납하세요!'
  ]

  useEffect(() => {
    const handleScroll = (e: { deltaY: number }) => {
      if (e.deltaY > 0 && currentPage < texts.length - 1) {
        setCurrentPage(prev => prev + 1)
        setDirection('down')
      } else if (e.deltaY < 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1)
        setDirection('up')
      }
    }

    window.addEventListener('wheel', handleScroll)

    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentPage, texts.length])


  return (
    <div className='fixed inset-0 w-screen h-screen z-[100] pt-[10%] bg-landing-bg-lg bg-cover bg-center bg-no-repeat overflow-hidden'>
      <div className='flex flex-col justify-between items-center h-[50%] text-white text-center'>
        <div>
          <img
            alt='로고' 
            src={LogoWhite}
            className='w-[14rem]'  
          />
        </div>
        <div className='h-[200px] overflow-hidden'> {/* 텍스트 컨테이너 높이 지정 */}
          {texts.map((text, index) => (
            <div
              key={index}
              className='text-[3.2rem] font-bold transition-transform duration-500 absolute left-0 right-0'
              style={{
                transform: `translateY(${(index - currentPage) * 100}%)`,
                opacity: index === currentPage ? 1 : 0,
                transition: 'transform 1.5s ease, opacity 0.3s ease',
              }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="fixed right-[2%] top-1/2 transform -translate-y-1/2 text-white">
        {texts.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 my-2 rounded-full cursor-pointer ${currentPage === index ? 'bg-white' : 'bg-gray-500'}`}
            onClick={() => {
              setDirection(index > currentPage ? 'down' : 'up')
              setCurrentPage(index)
            }}
          />
        ))}
      </div>

      {/* 스크롤 표시 */}
      <div className='fixed bottom-[5%] left-1/2 -translate-x-1/2 text-white'>SCROLL</div>

      {/* 스킵버튼 */}
      <Link to="/" className='fixed right-[5%] bottom-[5%] bg-light-gray-1 px-[1rem] py-[0.25rem] rounded text-black'>
        SKIP
      </Link>
    </div>
  )
}

export default LandingPage