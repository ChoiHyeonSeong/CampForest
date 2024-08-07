import React from 'react';
import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

type Props = {
  boardCount: number;
  productCount: number;
  reviewCount: number;
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}
  
const MenuBar = (props: Props) => {
  const handleMenuClick = (menu: string) => {
    props.setSelectedMenu(menu);
  }

  return (
    <div>
      <div
        className={`
          flex text-center
          text-light-text 
          dark:text-dark-text
          border-b
        `}
      >

        {/* 게시물 */}
        <div 
          onClick={() => handleMenuClick('게시물')}
          className={`
            ${props.selectedMenu === '게시물' ?
              `
              border-light-border-3 text-light-text
              dark:border-dark-border-3 dark:text-dark-text
              border-b-[0.125rem] font-bold
              ` :
              ''
            }
              flex justify-center z-[10] w-1/3 py-[1rem]
              cursor-pointer
              `
            }
          >
          <p className='me-2'>게시물</p>
          <p>{props.boardCount}</p>
        </div>

        {/* 판매/대여 */}
        <div 
          onClick={() => handleMenuClick('판매/대여')}
          className={`
            ${props.selectedMenu === '판매/대여' ?
              `
              border-light-border-3 text-light-text
              dark:border-dark-border-3 dark:text-dark-text
              border-b-[0.125rem] font-bold
              ` :
              ''
            }
              flex justify-center z-[10] w-1/3 py-[1rem]
              cursor-pointer
              `
            }
          >
          <p className='me-2'>판매/대여</p>
          <p>{props.productCount}</p>
        </div>

        {/* 거래후기 */}
        <div 
          onClick={() => handleMenuClick('거래후기')}
          className={`
            ${props.selectedMenu === '거래후기' ?
              `
              border-light-border-3 text-light-text
              dark:border-dark-border-3 dark:text-dark-text
              border-b-[0.125rem] font-bold
              ` :
              ''
            }
              flex justify-center z-[10] w-1/3 py-[1rem]
              cursor-pointer
              `
            }
          >
          <p className='me-2'>거래후기</p>
          <p>{props.reviewCount}</p>
        </div>
      </div>

    </div>
  )
}

export default MenuBar;