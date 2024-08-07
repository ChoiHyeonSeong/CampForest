import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  boardCount: number;
  productCount: number;
  reviewCount: number;
  selectedMenu: string | null;
}
  
const MenuBar = (props: Props) => {
  const navigate = useNavigate()

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
          onClick={() => navigate('')}
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
          onClick={() => navigate('product')}
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
          onClick={() => navigate('review')}
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