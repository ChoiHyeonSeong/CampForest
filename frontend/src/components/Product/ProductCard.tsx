import React, { useState } from 'react';

// icon
import { ReactComponent as EyeIcon } from '@assets/icons/eyes.svg'
import { ReactComponent as HeartOutlineIcon } from '@assets/icons/Heart-outline-fill.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'
import { ReactComponent as BlackHeartIcon } from '@assets/icons/heart-black.svg'
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
    <div className='cursor-pointer bg-white w-1/3 md:w-1/4 xl:w-1/5 pt-3 pb-6 px-3 rounded-md hover:shadow-md transition-all duration-300'>
      <Link to={`/product/detail/${props.product.productId}`}>
       {/* 상품사진 */}
       <div className='relative mb-3 w-full aspect-1 rounded-md overflow-hidden'>
        {/* 기본 이미지 - 상시 */}
        <div className='size-full  absolute z-1 overflow-hidden'>
          <img src={props.product.imageUrl} alt='ProductImg' className='size-full  hover:scale-[1.05] transition-all duration-300'/>
        </div>
        
        {/* 판매완료 - 완료상품에만 띄움(기본 hidden처리) */}
        <div className={`${props.product.sold ? '' : 'hidden'} absolute z-2 w-full h-full bg-[#00000099] flex justify-center items-center`}>
          <div className='w-1/3 aspect-1 border-2 border-white rounded-full flex justify-center items-center'>
            <div className='text-white text-center'>판매<br/>완료</div>
          </div>
        </div>

        {/* 찜 - 상시 */}
        <div onClick={toggleLike} className='absolute z-3 top-1 right-1 cursor-pointer'>
          {isLiked ? (
            <FillHeartIcon className='size-4 md:size-5' />
          ) : (
            <HeartOutlineIcon className='size-4 md:size-5' />
          )}
        </div>
       </div>

       {/* 상품설명 */}
       <div className='w-full overflow-hidden text-[#333] ps-2'>
        <h5 className='font-semibold truncate overflow-hidden whitespace-nowrap'>{props.product.productName}</h5>
        <p className='font-medium'>{priceComma(props.product.productPrice)}원<span className={`${props.product.productType === 'RENT' ? '' : 'hidden'} text-sm md:text-sm`}>/일</span></p>
        <p className='font-light text-xs md:text-sm text-gray-500 my-1'>{props.product.location}</p>
        <div className='flex'>
          <div className='flex me-3 items-center'>
            <EyeIcon className='size-3 md:size-4 me-1' />
            <span className='text-sm'>{props.product.hit}</span>
          </div>
          <div className='flex items-center'>
            <BlackHeartIcon className=' size-3 md:size-4 me-1 fill' />
            <span className='text-sm'>{props.product.interestHit}</span>
          </div>
        </div>
       </div>
       </Link>
    </div>
  )
}

export default ProductCard;