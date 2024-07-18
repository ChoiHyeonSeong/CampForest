import React from 'react'

import EachCategory from './EachCategory';

import campfire from '@assets/images/campfire.png'

type Props = {
  selectedExtendMenu: string | null;
}

const NavbarLeftExtendMobile = (props: Props) => {
  let htmlContent = (<div></div>)

  if (props.selectedExtendMenu === 'rental') {
    htmlContent = (
      <div className="grid grid-cols-2 gap-4 m-3">
        <EachCategory title={"전체"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"텐트"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"의자"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"침낭/매트"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"테이블"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"랜턴"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"코펠/식기"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"안전용품"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"버너/화로"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
        <EachCategory title={"기타"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-[15vw] h-[15vw]'/>
      </div>
    )
  } else if (props.selectedExtendMenu === 'community') {
    htmlContent = (
      <div className='text-start p-4 ps-10'>
        <div className="pb-6">전체보기</div>
        <div className="pb-6">캠핑장 후기</div>
        <div className="pb-6">캠핑장비 후기</div>
        <div className="pb-6">레시피 추천</div>
        <div className="pb-6">캠핑장 양도</div>
        <div className="pb-6">자유게시판</div>
        <div className="pb-6">질문게시판</div>
      </div>
    )
  } else {
    htmlContent = (
      <div></div>
    )
  }

  return (
    <div>
      {htmlContent}
    </div>
  )
}

export default NavbarLeftExtendMobile