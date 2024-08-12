import { productDetail } from '@services/productService';
import { RootState } from '@store/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

type ProductType = {
  imageUrl: string,
  productName: string,
  deposit?: number,
  productPrice: number,
  productType: string
}

type Props = {
}

const ProductInfoChat = ({ }: Props) => {
  const [product, setProduct] = useState<ProductType>()
  const productId = useSelector((state: RootState) => state.chatStore.productId);

  async function fetchProduct () {
    if(productId !== 0) {
      const result = await productDetail(productId);

      setProduct({
        imageUrl: result.imageUrls[0],
        productName: result.productName,
        deposit: result.deposit,
        productPrice: result.productPrice,
        productType: result.productType
      });
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [productId])

  return (
    <div 
      className='
        flex justify-between items-center w-full p-[0.8rem] 
        bg-light-bgbasic border-light-border
        dark:bg-dark-bgbasic dark-border-dark-border
        border-y'>
      {/* 상품정보 */}
      <div 
        className='flex items-center'
      >
        {/* 상품이미지 */}
        <div
          className='
            shrink-0 size-[3.5rem] me-[1rem]
            bg-gray-300
            overflow-hidden
          '
        >
          <img src={product?.imageUrl} alt='상품이미지'></img> {/* 이미지 들어갈 곳 */}
        </div>

        {/* 상품상세 */}
        <div>
          {/* 상품 이름 */}
          <div className='text-[1.1rem] font-semibold'>{product?.productName}</div>

          {/* 상품 가격 */}
          <div className='flex mt-[0.2rem] text-light-text-secondary dark:text-dark-text-secondary text-[0.97rem] font-medium'>
            <div className={`${product?.deposit ? '' : 'hidden'} me-[0.5rem]`}>보증금{product?.deposit}원</div>
            <div className=''>
              {product?.productPrice}원
              <span className={`${product?.deposit ? '' : 'hidden'}`}>
                /일
              </span>
            </div>
          </div>
        </div>
      </div>
 
      {/* 거래 상태표시 */}
      <div
        className='
          px-[0.7rem] py-[0.4rem]
          bg-light-heart 
          dark:bg-dark-heart
          text-white rounded cursor-pointer
        '
        onClick={() => {

        }}
      >
        거래요청
      </div>
    </div>
  )
}

export default ProductInfoChat