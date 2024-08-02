import React from 'react';
import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

type Props = {
  boardCount: number;
  productCount: number;
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
          <p>12</p>
        </div>
      </div>

      {/* 탭 아래에 표시되는 곳 -> 조건문 */}
      <div>
        <div
          className={`
            ${props.selectedMenu === '거래후기'?
              'hidden' :
              ''
            }
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div className='flex items-center'>
            <ArticleIcon className='size-[1rem]'/>
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              작성글
            </span>
          </div>

          {/* 북마크 */}
          <div className='flex items-center ms-[2.5rem]'>
            <BookMarkIcon className='size-[1.25rem]'/>
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              저장됨
            </span>
          </div>

        {/* 필터 */}
        <div className='flex justify-end absolute right-0'>
          <div className='flex items-center ms-auto px-[0.5rem] text-sm'>
            <div
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              필터
            </div>
            <FilterIcon
              className={`
                size-[1.25rem] ms-[0.5rem] 
                fill-light-border-icon 
                dark:fill-dark-border-icon
              `}  
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default MenuBar;