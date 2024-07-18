import React from 'react'

import EachCategory from './EachCategory';

import campfire from '@assets/images/campfire.png'

type Props = {
  selectedExtendMenu: string | null;
}

type RentalCategoryObj = {
  title: string;
  imgsrc: string;
  imgBgColor: string;
  imgWd: string;
}

type CommunityCategoryObj = {
  title: string;
}

const NavbarLeftExtendMobile = (props: Props) => {
  const rentalCategory: RentalCategoryObj[] = [
    {
      title: "전체",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "텐트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "의자",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "침낭/매트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "테이블",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "랜턴",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "코펠/식기",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "안전용품",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "버너/화로",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
    {
      title: "기타",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[15vw] h-[15vw]'
    },
  ]

  const communityCategory: CommunityCategoryObj[] = [
    {
      title: '전체보기'
    },
    {
      title: '캠핑장 후기'
    },
    {
      title: '캠핑장비 후기'
    },
    {
      title: '레시피 추천'
    },
    {
      title: '캠핑장 양도'
    },
    {
      title: '자유게시판'
    },
    {
      title: '질문게시판'
    },
  ]

  let htmlContent: JSX.Element = (<div></div>)

  if (props.selectedExtendMenu === 'rental') {
    htmlContent = (
      <div className="grid grid-cols-2 gap-4 m-3">
        {rentalCategory.map((eachObj, index) => (
          <EachCategory title={eachObj.title} imgsrc={eachObj.imgsrc} imgBgColor={eachObj.imgBgColor} imgWd={eachObj.imgWd}/>
        ))}
      </div>
    )
  } else if (props.selectedExtendMenu === 'community') {
    htmlContent = (
      <div className='text-start p-4 ps-10'>
        {communityCategory.map((eachObj, index) => (
          <div className="pb-6">{eachObj.title}</div>
        ))}
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