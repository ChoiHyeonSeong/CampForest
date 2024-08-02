import React from 'react'
import { useState } from 'react';
import { ReactComponent as MoreDotIcon } from '@assets/icons/more-dots.svg'

type Props = {
  isUserPost: boolean;
  deleteFunction: (param:number) => void;
  deleteId: number;
  copyURL:string;
};

const MoreOptionsMenu = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl+props.copyURL);
    console.log(currentUrl+props.copyURL)
    alert('링크가 복사되었습니다!');
  };

  return (
    <div 
      className={`
        relative
        cursor-pointer
      `}
    >
      <div onClick={toggleMenu}>
        <MoreDotIcon className={`absolute top-0 right-0 size-[2rem]`}/>
      </div>
      {isMenuOpen && (
        <div 
          className={`
            toggle-menu
            flex flex-col absolute top-[1.5rem] right-[1.5rem] z-[10] w-[8rem] px-[0.25rem]
            bg-light-white border-light-border text-light-text-secondary
            dark:bg-dark-white dark:border-dark-border dark:text-dark-text-secondary
            font-medium text-left rounded-md border-[0.1rem]
          `}
        >
          <div 
            className={`
              w-full ps-[0.75rem]
              border-light-border
              dark:border-dark-border
              border-b
            `}
          >
            <button 
              className={`
                py-[0.75rem] 
                hover:text-light-signature
                dark:hover:text-dark-signature
                text-base
              `}
            >
              신고하기
            </button>
          </div>
          <div 
            className={`
              w-full ps-[0.75rem]
              border-light-border
              dark:border-dark-border
              border-b
            `}
          >
            <button 
              className={`
                py-[0.75rem]
                hover:text-light-signature
                dark:hover:text-dark-signature 
                text-base
              `}
              onClick={copyLink}>
                링크복사
              </button>
          </div>
          {props.isUserPost ? (
            <>
              <div 
                className={`
                  w-full ps-[0.75rem]
                  border-light-border
                  dark:border-dark-border
                  border-b 
                `}
              >
                <button 
                  className={`
                    py-[0.75rem]
                    hover:text-light-signature
                    dark:hover:text-dark-signature 
                    text-base 
                  `}
                >
                  수정하기
                </button>
              </div>
              <div 
                className={`
                  w-full ps-[0.75rem]
                  border-light-border
                  dark:border-dark-border
                  border-b
                `}
                onClick={() => props.deleteFunction(props.deleteId)}
              >
                <button 
                  className={`
                    py-[0.75rem]
                    hover:text-light-signature
                    dark:hover:text-dark-signature 
                    text-base
                  `}
                >
                  삭제하기
                </button>
              </div>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MoreOptionsMenu
