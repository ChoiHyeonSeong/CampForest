import React from 'react'
import { useNavigate } from 'react-router-dom';

import EachCategory from './EachCategory';

import campfire from '@assets/images/campfire.png'

type Props = {
  selectedExtendMenu: string | null;
  closeMenu: () => void;
}

type RentalCategoryObj = {
  title: string;
  imgsrc: string;
  imgBgColor: string;
  imgWd: string;
  linkTo: string;
}

type CommunityCategoryObj = {
  title: string;
  linkTo: string;
}

const NavbarLeftExtendMobile = (props: Props) => {
  const navigate = useNavigate(); 
  const handleClick = (linkUrl: string) => {
    props.closeMenu();
    navigate(linkUrl);
  }
  const rentalCategory: RentalCategoryObj[] = [
    {
      title: "전체",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/all'
    },
    {
      title: "텐트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/tent'
    },
    {
      title: "의자",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/chair'
    },
    {
      title: "침낭/매트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/sleeping'
    },
    {
      title: "테이블",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/table'
    },
    {
      title: "랜턴",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/lantern'
    },
    {
      title: "코펠/식기",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/cookware'
    },
    {
      title: "안전용품",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/safety'
    },
    {
      title: "버너/화로",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/burner'
    },
    {
      title: "기타",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'w-[10vw] h-[10vw]',
      linkTo: 'product/list/etc'
    },
  ]

  const communityCategory: CommunityCategoryObj[] = [
    {
      title: '전체보기',
      linkTo: 'community/all',
    },
    {
      title: '캠핑장비 후기',
      linkTo: 'community/equipment',
    },
    {
      title: '레시피 추천',
      linkTo: 'community/recipe',
    },
    {
      title: '캠핑장 양도',
      linkTo: 'community/assign',
    },
    {
      title: '자유게시판',
      linkTo: 'community/free',
    },
    {
      title: '질문게시판',
      linkTo: 'community/question',
    },
  ]

  let htmlContent: JSX.Element = (<div></div>)

  if (props.selectedExtendMenu === 'rental') {
    htmlContent = (
      <div className={`grid grid-cols-2 gap-[0.5rem] m-[0.75rem]`}>
        {rentalCategory.map((eachObj, index) => (
          <div key={index} className='cursor-pointer' onClick={() => {handleClick(eachObj.linkTo)}}>
            <EachCategory key={index} title={eachObj.title} imgsrc={eachObj.imgsrc} imgBgColor={eachObj.imgBgColor} imgWd={eachObj.imgWd}/>
          </div>
        ))}
      </div>
    )
  } else if (props.selectedExtendMenu === 'community') {
    htmlContent = (
      <div className={`p-[1rem] ps-[2.5rem] text-start`}>
        {communityCategory.map((eachObj, index) => (
          <div key={index} className='pb-[1.5rem] cursor-pointer' onClick={() => {handleClick(eachObj.linkTo)}}>{eachObj.title}</div>
        ))}
      </div>
    )
  } else {
    htmlContent = (
      <div></div>
    )
  }

  return (
    <div className={`z-[30]`}>
      {htmlContent}
    </div>
  )
}

export default NavbarLeftExtendMobile