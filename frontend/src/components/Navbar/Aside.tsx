import React, { useState, useCallback, useEffect  } from 'react'

// icon import
import { ReactComponent as WriteIcon } from '@assets/icons/write.svg'
import { ReactComponent as TopBtnIcon } from '@assets/icons/top-btn.svg'
import { ReactComponent as DotIcon } from '@assets/icons/more-dots.svg'
import { ReactComponent as RentalIcon } from '@assets/icons/nav-rental.svg'
import { ReactComponent as CommunityIcon } from '@assets/icons/nav-community.svg'
import { useDispatch } from 'react-redux'
import { setIsBoardWriteModal } from '@store/modalSlice'
import { RootState } from '@store/store'
import { Link } from 'react-router-dom'

type Props = {
  user: RootState['userStore'];
}

const Aside = (props: Props) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = useCallback((): void => {
    setIsExpanded(prev => !prev);
  }, []);

  const scrollToTop = useCallback((): void => {
    const contentBox = document.getElementById('contentBox');
    contentBox?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isMobile) {
      e.currentTarget.classList.add('active-touch');
    }
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isMobile) {
      e.currentTarget.classList.remove('active-touch');
    }
  }, [isMobile]);

  const getButtonClassNames = (baseClasses: string) => `
    ${baseClasses}
    ${isMobile ? 'touch-action-manipulation' : 'hover:bg-light-signature dark:hover:bg-dark-signature'}
    transition-all duration-200
  `;

  return (
    <aside className={`fixed bottom-[4rem] md:bottom-[2rem] right-[1.25rem] md:right-[1.25rem] z-[10]`}>

      {/* Aside 글쓰기 (로그인 해야 보임) */}
      <div className={`${props.user.isLoggedIn ? 'flex' : 'hidden'} items-center relative mb-[0.5rem]`}>
        <div className={`flex absolute right-[0.5rem]`}>
        <Link 
            onClick={toggleExpand} 
            to='product/write' 
            className={getButtonClassNames(`
              ${isExpanded ? 'opacity-100 -translate-x-full' : 'opacity-0 -translate-x-0 pointer-events-none'}
              flex flex-all-center w-[2.75rem] h-[2.75rem] 
              bg-light-black dark:bg-dark-black 
              rounded-full transition-all duration-300 ease-in-out delay-100
              group
            `)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <RentalIcon 
              className={`
                size-[1.6rem]
                stroke-light-white 
                dark:stroke-dark-white
                cursor-pointer
                group-hover:hidden
              `}
            />
            <span
              className="
                hidden group-hover:block
                text-light-white
                dark:text-dark-white
                text-sm duration-150
              "
            >
              거래
            </span>
          </Link>
          <div 
            onClick={() => {
              dispatch(setIsBoardWriteModal(true))
              toggleExpand()
            }}
            className={getButtonClassNames(`
              ${isExpanded ? 'opacity-100 -translate-x-full' : 'opacity-0 -translate-x-0 pointer-events-none'}
              flex flex-all-center w-[2.75rem] h-[2.75rem] ml-[0.5rem]
              bg-light-black dark:bg-dark-black
              rounded-full transition-all duration-300 ease-in-out
              group
            `)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <CommunityIcon 
              className={`
                size-[1.6rem]
                stroke-light-white 
                dark:stroke-dark-white
                cursor-pointer group-hover:hidden
              `}
            />
            <span
              className="
                hidden group-hover:flex flex-col items-center justify-center
                text-light-white
                dark:text-dark-white
                text-xs leading-tight cursor-pointer duration-150
              "
            >
              <span>커뮤</span>
              <span>니티</span>
            </span>
          </div>
        </div>

        {/* 글쓰기 확장 토글 버튼 */}
        <div 
          onClick={toggleExpand}
          className={getButtonClassNames(`
            flex flex-all-center z-[10] w-[2.75rem] h-[2.75rem] 
            bg-light-black dark:bg-dark-black
            rounded-full
          `)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isExpanded ? (
            <DotIcon 
              className="
                fill-light-white dark:fill-dark-white
                rotate-90 cursor-pointer
              "
            /> 
          ) : (
            <WriteIcon 
              className="
                stroke-light-white dark:stroke-dark-white
                cursor-pointer
              "
            />
          )}
        </div>
      </div>

      {/* 최상단 이동 버튼 */}
      <div
        onClick={scrollToTop} 
        className={getButtonClassNames(`
          flex flex-all-center w-[2.75rem] h-[2.75rem] 
          bg-light-black dark:bg-dark-black
          rounded-full cursor-pointer
        `)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
          <TopBtnIcon className={`stroke-light-white dark:stroke-dark-white`}/>
      </div>
          
    </aside>
  )
}

export default Aside