import React, { useEffect, useState } from 'react';

// icon
import { ReactComponent as EyeIcon } from '@assets/icons/eyes.svg'
import { ReactComponent as HeartIcon } from '@assets/icons/heart.svg'
import { Link, useNavigate } from 'react-router-dom';
import { priceComma } from '@utils/priceComma';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import { productLike, productDislike } from '@services/productService';

import Swal from 'sweetalert2'

export type ProductType = {
  category: string;
  deposit: number | null;
  hit: number;
  imageUrl: string;
  interestHit: number;
  location: string;
  productId: number;
  productName: string;
  productPrice: number;
  productType: string;
  saved: boolean;
  sold: boolean;
  userId: number;
  userImage: string;
}

type Props = {
  product: ProductType;
  likedTrigger?: (param: boolean) => void;
}

const ProductCard = (props: Props) => {
  const navigate = useNavigate()

  const [liked, setLiked] = useState(props.product.saved);
  const userStore = useSelector((state: RootState) => state.userStore);

  const popLoginAlert = () => {
    Swal.fire({
      icon: "error",
      title: "로그인 해주세요.",
      text: "로그인 후 사용가능합니다.",
      confirmButtonText: '확인'
    }).then(result => {
      if (result.isConfirmed) {
        navigate('/user/login')
      }
    });
  }

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (userStore.isLoggedIn) {
      try {
        if (liked) {
          const response = await productDislike(props.product.productId)
          console.log(response)
          setLiked(false)
          if (props.likedTrigger) {
            props.likedTrigger(false)
          }
        } else {
          const response = await productLike(props.product.productId)
          console.log(response)
          setLiked(true)
          if (props.likedTrigger) {
            props.likedTrigger(true)
          }
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      popLoginAlert()
    }
  };

  return (
    <div 
      className={`
        pt-[0.75rem] pb-[1.5rem] px-[0.75rem] 
        bg-light-white bg-opacity-60
        dark:bg-dark-white dark:bg-opacity-60
        rounded cursor-pointer hover:shadow-md transition-all duration-30
      `}
    >
      <Link to={`/product/detail/${props.product.productId}`}>
       {/* 상품사진 */}
      <div 
        className={`
          relative w-full mb-[0.75rem]
          aspect-1 rounded-md overflow-hidden
        `}
      >
        {/* 기본 이미지 - 상시 */}
        <div 
          className={`
            absolute z-[5] size-full
            overflow-hidden
          `}
        >
          <img 
            src={props.product.imageUrl} 
            alt='ProductImg' 
            className={`
              size-full hover:scale-[1.05] 
              transition-all duration-300
            `}
          />
        </div>
        {/* 판매완료 - 완료상품에만 띄움(기본 hidden처리) */}
        <div 
          className={`
            ${props.product.sold ? '' : 'hidden'}
            flex justify-center items-center absolute z-[6] w-full h-full
            bg-black bg-opacity-60
            
          `}
        >
          <div 
            className={`
              flex justify-center items-center shrink-0 size-1/3 md:size-1/3
              border-light-white
              dark:border-light-white
              aspect-1 border-2 rounded-full
            `}
          >
            <div 
              className={`
                text-white 
                text-center text-[0.72rem] md:text-[0.72rem]
              `}
            >
              판매<br/>완료
            </div>
          </div>
        </div>
        {/* 찜 - 상시 */}
        <div 
          onClick={toggleLike} 
          className={`
            absolute z-[7] top-[0.25rem] right-[0.25rem] 
            cursor-pointer
          `}
        >
          {liked ? 
            (<HeartIcon 
                className={`
                  size-[1.2rem] md:size-[1.4rem]
                  fill-light-heart stroke-light-heart
                  dark:fill-dark-heart dark:stroke-dark-heart
                  `} 
              />
            ) : 
            (<HeartIcon 
                className={`
                  size-[1.2rem] md:size-[1.4rem]
                  fill-white stroke-light-border-icon
                  dark:stroke-dark-border-icon
                `} 
              />
            )
          }
        </div>
       </div>
       {/* 상품설명 */}
       <div 
          className={`
            w-full ps-[0.5rem]
            text-light-black
            dark:text-dark-black
            overflow-hidden
          `}
        >
        <div className={`font-semibold truncate overflow-hidden whitespace-nowrap`}>
          {props.product.productName}
        </div>
        <p className={`font-medium`}>
          {priceComma(props.product.productPrice)}원
          <span 
            className={`
              ${props.product.productType === 'RENT' ? '' : 'hidden'} 
              text-sm md:text-sm
            `}
          >
            /일
          </span>
        </p>
        <p 
          className={`
            my-[0.25rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            font-light text-xs md:text-sm
          `}
        >
          {props.product.location ? props.product.location : '-'}
        </p>
        <div className={`flex`}>
          <div className={`flex items-center me-[0.75rem]`}>
            <EyeIcon
              className={`
                size-[0.75rem] md:size-[1rem] me-[0.25rem]
                stroke-light-border-icon
                dark:stroke-dark-black    
              `}
            />
            <span className={`text-sm`}>
              {props.product.hit}
            </span>
          </div>
          <div className={`flex items-center`}>
            <HeartIcon 
              className={`
                size-[0.75rem] md:size-[1rem] me-[0.25rem]
                fill-none stroke-light-black
                dark:stroke-dark-black
              `} />
            <span className={`text-sm`}>
              {props.product.interestHit}
            </span>
          </div>
        </div>
       </div>
       </Link>
    </div>
  )
}

export default ProductCard;