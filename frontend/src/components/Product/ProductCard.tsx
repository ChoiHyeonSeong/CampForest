import React, { useState } from 'react';

// icon
import { ReactComponent as EyeIcon } from '@assets/icons/eyes.svg'
import { ReactComponent as HeartIcon } from '@assets/icons/heart.svg'
// import ProfileImgEX from '@assets/images/productExample.png'
import { Link } from 'react-router-dom';
import { priceComma } from '@utils/priceComma';

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
  sold: boolean;
  userId: number;
}

type Props = {
  product: ProductType;
}

const ProductCard = (props: Props) => {

  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className={`
        pt-[0.75rem] pb-[1.5rem] px-[0.75rem] 
        bg-light-white
        dark:bg-dark-white
        cursor-pointer rounded-md hover:shadow-md transition-all duration-30
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
            absolute z-[10] size-full
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
            flex justify-center items-center absolute z-[20] w-full h-full
            bg-light-black
            dark:bg-dark-black
            opacity-60
          `}
        >
          <div 
            className={`
              flex justify-center items-center w-1/3 
              border-light-white
              dark:border-light-white
              aspect-1 border-2 rounded-full
            `}
          >
            <div 
              className={`
                text-light-white 
                dark:text-dark-white
                text-center
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
            absolute z-3 top-[0.25rem] right-[0.25rem] 
            cursor-pointer
          `}
        >
          {isLiked ? 
            (<HeartIcon 
                className={`
                  size-[1rem] md:size-[1.25rem]
                  fill-light-heart stroke-light-heart
                dark:fill-dark-heart dark:stroke-dark-heart
                `} 
              />
            ) : 
            (<HeartIcon 
                className={`
                  size-[1rem] md:size-[1.25rem]
                  fill-none stroke-light-border-icon
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
          {props.product.location}
        </p>
        <div className={`flex`}>
          <div className={`flex items-center me-[0.75rem]`}>
            <EyeIcon className={`size-[0.75rem] md:size-[1rem] me-[0.25rem]`}/>
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