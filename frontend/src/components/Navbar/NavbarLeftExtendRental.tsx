import React from 'react'

import EachCategory from './EachCategory';

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import campfire from '@assets/images/campfire.png'
import { useNavigate } from 'react-router-dom';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu:  (param:string) => void;
  closeMenu: () => void;
}

type RentalCategoryObj = {
  title: string;
  imgsrc: string;
  imgBgColor: string;
  imgWd: string;
  linkUrl: string;
}

const NavbarLeftExtendRental = (props: Props) => {
  const navigate = useNavigate();
  const handleCategoryClick = (linkUrl: string) => {
    props.closeMenu();
    navigate(linkUrl);
  }

  const rentalCategory: RentalCategoryObj[] = [
    {
      title: "전체",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "텐트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "의자",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "침낭/매트",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "테이블",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "랜턴",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "코펠/식기",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "안전용품",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "버너/화로",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "기타",
      imgsrc: campfire,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
  ]

  return (
    <div
      className={`
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'}
        fixed z-[35] w-[20rem] h-[100%] pt-[3.2rem] lg:pt-[0]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `}
    >
      <div className={`flex items-center h-[5rem] ps-[1rem]`}>
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('rental')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-black
            dark:fill-dark-black
            cursor-pointer
          `}
        />
        <p className={`text-2xl`}>판매 / 대여</p>
      </div>

      <div className={`h-[calc(100vh-5rem)] mx-[2.5rem] p-[0.5rem] overflow-y-auto scrollbar-hide`}>
        <div className={`grid grid-cols-2 gap-[1rem]`}>
          {rentalCategory.map((eachObj, index) => (
            <div key={index} className={`cursor-pointer`} onClick={() => handleCategoryClick(eachObj.linkUrl)} >
              <EachCategory
                title={eachObj.title} 
                imgsrc={eachObj.imgsrc} 
                imgBgColor={eachObj.imgBgColor} 
                imgWd={eachObj.imgWd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendRental