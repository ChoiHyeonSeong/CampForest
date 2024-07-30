import React from 'react'
import { useState } from 'react';
import { ReactComponent as MoreDotIcon } from '@assets/icons/more-dots.svg'

type Props = {
  isUserPost: boolean;
};

const MoreOptionsMenu = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    console.log(props.isUserPost)
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className="relative cursor-pointer">
      <div onClick={toggleMenu}>
        <MoreDotIcon className="absolute top-0 right-0 size-8" />
      </div>
      {isMenuOpen && (
        <div className="toggle-menu font-medium text-left flex flex-col px-1 absolute z-10 top-6 right-6 w-32 rounded-md border-[0.1rem] border-[#eee] bg-[#fff]">
          {props.isUserPost ? (
            <>
              <div className='w-full border-b ps-3'>
              <button className="py-3 text-base hover:text-[#FF7F50]">수정하기</button>
              </div>
              <div className='w-full border-b ps-3'>
              <button className="py-3 text-base hover:text-[#FF7F50]">삭제하기</button>
              </div>
            </>
          ) : (
            <>
              <div className='w-full border-b ps-3'>
              <button className="py-3 text-base hover:text-[#FF7F50]">신고하기</button>
              </div>
              <div className='w-full border-b ps-3'>
              <button className="py-3 text-base hover:text-[#FF7F50]" onClick={copyLink}>링크복사</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MoreOptionsMenu
