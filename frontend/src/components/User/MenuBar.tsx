import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  selectedMenu: string | null;
}

type MenuItemProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      ${isSelected ? 'font-bold' : ''}
      flex justify-center z-[10] w-1/3 py-[1rem]
      cursor-pointer
    `}
  >
    <p className='me-2'>{label}</p>
  </div>
)

const MenuBar: React.FC<Props> = (props) => {
  const navigate = useNavigate()

  return (
    <div>
      <div
        className={`
          flex text-center
          text-light-text border-light-border
          dark:text-dark-text dark:border-dark-border dark:bg-dark-white dark:bg-opacity-80
          border-b relative
        `}
      >
        {/* 게시물 */}
        <MenuItem 
          label="게시물"
          isSelected={props.selectedMenu === '게시물'}
          onClick={() => navigate('')}
        />

        {/* 판매/대여 */}
        <MenuItem 
          label="판매/대여"
          isSelected={props.selectedMenu === '판매/대여'}
          onClick={() => navigate('product')}
        />

        {/* 거래후기 */}
        <MenuItem 
          label="거래후기"
          isSelected={props.selectedMenu === '거래후기'}
          onClick={() => navigate('review')}
        />

        {/* 밑줄 효과 */}
        <div 
          className={`
            absolute bottom-0 h-[0.125rem] w-1/3
            bg-light-border-3 dark:bg-dark-border-3
            transition-all duration-300 ease-in-out
          `}
          style={{
            left: 
              props.selectedMenu === '게시물' ? '0' :
              props.selectedMenu === '판매/대여' ? '33.33%' :
              props.selectedMenu === '거래후기' ? '66.66%' : '0'
          }}
        />
      </div>
    </div>
  )
}

export default MenuBar;