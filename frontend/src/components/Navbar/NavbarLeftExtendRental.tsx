import React from 'react'
import EachCategory from './EachCategory';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import { useNavigate } from 'react-router-dom';

// 카테고리 사진
import cateAll from '@assets/category/cate-all.png' // 전체
import cateTent from '@assets/category/cate-tent.png' // 텐트
import cateChair from '@assets/category/cate-chair.png' // 의자
import cateBed from '@assets/category/cate-bed.png' // 침낭매트
import cateTable from '@assets/category/cate-table.png' // 테이블
import cateLantern from '@assets/category/cate-lantern.png' // 랜턴
import cateCook from '@assets/category/cate-cooking.png' // 코펠식기
import cateSafety from '@assets/category/cate-safety.png' // 안전용품
import cateBurner from '@assets/category/cate-burner.png' // 버너화로
import cateEtc from '@assets/category/cate-etc.png' // 기타


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
      imgsrc: cateAll,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "텐트",
      imgsrc: cateTent,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "의자",
      imgsrc: cateChair,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "침낭/매트",
      imgsrc: cateBed,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "테이블",
      imgsrc: cateTable,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "랜턴",
      imgsrc: cateLantern,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "코펠/식기",
      imgsrc: cateCook,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "안전용품",
      imgsrc: cateSafety,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "버너/화로",
      imgsrc: cateBurner,
      imgBgColor: "bg-green-500",
      imgWd: 'size-[5rem]',
      linkUrl: 'product/list'
    },
    {
      title: "기타",
      imgsrc: cateEtc,
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

      <div className={`h-[calc(100vh-5rem)] mx-[2.5rem] mt-[2rem] p-[0.5rem] overflow-y-auto scrollbar-hide`}>
        <div className={`grid grid-cols-2 gap-[1rem]`}>
          {rentalCategory.map((eachObj, index) => (
            <div
              key={index}
              className={`
                hover:scale-105
                cursor-pointer transition-transform duration-300
              `}
              onClick={() => handleCategoryClick(eachObj.linkUrl)} >
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