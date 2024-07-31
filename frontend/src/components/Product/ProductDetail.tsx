import React, { useEffect, useState } from 'react';
import FireGif from '@assets/images/fire.gif';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import { Navigation, Pagination } from 'swiper/modules';
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu';
import ProductCard from '@components/Product/ProductCard';
import { productDetail } from '@services/productService';
import { useParams } from 'react-router-dom';
import { priceComma } from '@utils/priceComma';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ProductDetailType = {
  category: string;
  deposit: number | null;
  hit: number;
  imageUrls: string[];
  interestHit: number;
  location: string;
  productContent: string;
  productId: number;
  productName: string;
  productPrice: number;
  productType: string;
  usreId: string;
};

function Detail() {
  const isUserPost = false; // 예시로 사용자 게시물 여부를 나타내는 값
  const productId = Number(useParams().productId);
  const [product, setProduct] = useState<ProductDetailType>({
    category: '',
    deposit: 0,
    hit: 0,
    imageUrls: [],
    interestHit: 0,
    location: '',
    productContent: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    productType: '',
    usreId: '',
  });
  const fetchProduct = async () => {
    try {
      const result = await productDetail(productId);
      console.log(result);
      setProduct(result);
    } catch (error) {
      console.error('판매 상세 페이지 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="flex justify-center mb-20">
      <div className="p-6 w-full lg:w-[60rem] xl:w-[66rem] lg:p-0 lg:pt-6">
        {/* 상단 */}
        <div className="flex relative lg:flex-row flex-col w-full mb-[2rem] bg-white overflow-hidden">
          {/* 이미지 */}
          <Swiper
            className="rounded-lg overflow-hidden w-full lg:w-2/5 aspect-1 flex-shrink-0 "
            modules={[Navigation, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            navigation={{ nextEl: '.my-next-button', prevEl: '.my-prev-button' }}
            pagination={{ clickable: true }}
            onSwiper={(swiper: any) => console.log(swiper)}
          >
            {product.imageUrls.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageUrl}
                  alt="ProductImg"
                  className="w-full h-full object-contain rounded-lg"
                ></img>
              </SwiperSlide>
            ))}
            <button className="my-next-button absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-2 rounded-full">
              <RightArrowIcon />
            </button>
            <button className="my-prev-button absolute top-1/2 left-2 transform -translate-y-1/2 z-10 p-2 rounded-full">
              <LeftArrowIcon />
            </button>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                .swiper-pagination-bullet {
                  background-color: #888 !important;
                  opacity: 0.5 !important;
                }
                .swiper-pagination-bullet-active {
                  background-color: #555 !important;
                  opacity: 1 !important;
                }
              `,
              }}
            />
          </Swiper>
          {/* 내용 */}
          <div className="md:ps-6 w-full lg:w-3/5">
            <div className="flex justify-between text-sm mt-[1rem] mb-[0.5rem] text-[#555555]">
              <div className="flex">
                <div className="me-6">
                  캠핑 장비 {'>'} {product.category}
                </div>
                <div className="text-[#FF7F50] font-semibold">
                  {product.productType === 'SALE' ? '판매' : '대여'}
                </div>
              </div>
              <MoreOptionsMenu
                isUserPost={isUserPost}
                deleteId={0}
                deleteFunction={() => {
                  console.log('test');
                }}
                copyURL=""
              />
            </div>
            <div className="text-2xl font-medium">{product.productName}</div>
            <div className="mt-[1.5rem] text-sm border-b border-[#EEEEEE] relative">
              <div className="w-full break-all min-h-[7rem]">{product.productContent}</div>
              <div className="flex my-6">
                <div>조회</div>
                <div className="ms-1 me-2">{product.hit}</div>
                <div>관심</div>
                <div className="ms-1 me-2">{product.interestHit}</div>
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <div>
                <div className="text-[#555555] font-medium">픽업 | 반납 장소</div>
                <div className="p-2 text-sm ">
                  <div>{product.location}</div>
                </div>
              </div>
              {/* 가격 */}
              <div className="mt-4">
                <div className="flex justify-between text-lg md:text-xl mb-2">
                  <div className="me-5 font-semibold">가격</div>
                  <div className="font-bold">
                    {priceComma(product.productPrice)} 원
                    <span className={`${product.productType === 'SALE' ? 'hidden' : ''}`}>/일</span>
                  </div>
                </div>
                <div
                  className={`${product.productType === 'SALE' ? 'hidden' : ''} flex justify-between text-base text-gray-500 md:text-lg`}
                >
                  <div className="me-5 font-semibold 0">보증금</div>
                  <div className="font-bold">{product.deposit} 원</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 판매자 정보 및 거래버튼 */}
        <div className="flex lg:flex-row flex-col justify-between rounded-sm mt-10 mb-14 bg-[#eee] px-4 py-6">
          {/* 판매자 정보 */}
          <div className="w-full lg:w-[calc(100%-24.5rem)] flex flex-col mb-8 lg:mb-0">
            <div className="mb-3 w-full">
              <span className="font-medium">사용자1 </span>의 제품
            </div>
            <div className="flex w-full">
              <div className="rounded-full bg-black size-12 me-4 shrink-0"></div>
              <div className="flex flex-col w-full">
                <div className="flex mb-2">
                  <div className="font-medium me-3">거래 불꽃 온도</div>
                  <div className="font-medium text-[#FF0000]">573°C</div>
                </div>
                <div className="w-full lg:w-4/5 h-4 bg-gray-200 rounded-full">
                  <div className="h-full rounded-full w-1/2 bg-gradient-to-r from-red-500 to-orange-400 relative">
                    <img
                      src={FireGif}
                      alt="불꽃"
                      className="absolute -right-16 -top-[3.5rem] size-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 거래버튼 */}
          <div className="flex items-center md:justify-center">
            <button className="w-1/2 md:max-w-80 lg:w-48 h-10 py-2 rounded-md border border-[#FF7F50] text-[#FF7F50] font-medium bg-white me-2 flex flex-all-center">
              찜하기
            </button>
            <button className="w-1/2 md:max-w-80 lg:w-48 h-10 py-2 rounded-md bg-[#FF7F50] text-white flex flex-all-center">
              채팅하기
            </button>
          </div>
        </div>

        {/* 판매자의 추가거래 상품 받아오기 */}
        <div>
          <div className="mb-3 text-lg">
            <span className="font-medium">사용자1</span>의 다른 거래 상품 구경하기
          </div>
          <div className="w-full flex flex-wrap"></div>
          {/* <Swiper
            spaceBetween={2}
            slidesPerView={1}
            freeMode={true}
          >
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
          </Swiper> */}
        </div>
      </div>
    </div>
  );
}

export default Detail;
