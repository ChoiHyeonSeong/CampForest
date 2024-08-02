import React, { FormEvent, useState } from 'react';
import Dropdown from '../Public/Dropdown';
import { ReactComponent as LocationIcon } from '@assets/icons/location.svg';
import { productWrite } from '@services/productService';
import MultiImageUpload from '@components/Public/MultiImageUpload';
import ProductMap from './ProductMap';
import { useNavigate } from 'react-router-dom';
import { setIsLoading } from '@store/modalSlice';
import { useDispatch } from 'react-redux';

type Option = {
  id: number;
  name: string;
};

type ProductRegistDto = {
  productName: string,
  productPrice: number | undefined,
  productContent: string,
  location: string,
  productType: string,
  category: string,
  deposit: number | undefined
}

const categories: Option[] = [
  { id: 1, name: '분류 전체' },
  { id: 2, name: '텐트' },
  { id: 3, name: '의자' },
  { id: 4, name: '침낭/매트' },
  { id: 5, name: '테이블' },
  { id: 6, name: '랜턴' },
  { id: 7, name: '코펠/식기' },
  { id: 8, name: '안전용품' },
  { id: 9, name: '버너/화로' },
  { id: 10, name: '기타' },
];

const ProductWrite = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option>(categories[0]);
  const [selectedButton, setSelectedButton] = useState<string>('대여');
  const [productImages, setProductImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loadMap, setLoadMap] = useState(false);
  const buttons = ['대여', '판매', '나눔'];

  const [formData, setFormData]= useState<ProductRegistDto>({
    productName: '',
    productPrice: undefined,
    productContent: '',
    location: '장소를 선택하세요.',
    productType: '',
    category: '',
    deposit: undefined,
  })

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCategorySelect = (option: Option) => {
    setSelectedCategory(option);
  };

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocation = (dongName: string) => {
    setFormData(prevData => ({
      ...prevData,
      location: dongName
    }));
  };

  const handleImagesChange = (images: File[]) => {
    setProductImages(images);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    const submitData = {
      ...formData,
      productType: selectedButton === '대여' ? 'RENT' : 'SALE',
      category: selectedCategory.name,
    };

    console.log(submitData);
    
    try { 
      dispatch(setIsLoading(true));
      await productWrite(submitData, productImages);
      dispatch(setIsLoading(false));
      navigate('/product/list');
    } catch (error) {
      console.error('Failed to Product Write: ', error);
      dispatch(setIsLoading(false));
    }
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.productName.trim()) {
      newErrors.productName = '제목을 입력해주세요.';
    }

    if (!formData.productContent.trim()) {
      newErrors.productContent = '상품 설명을 입력해주세요.';
    }

    if (formData.productPrice === undefined || formData.productPrice <= 0) {
      newErrors.productPrice = '올바른 금액을 입력해주세요.';
    }

    if (selectedCategory.id === 1) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (productImages.length === 0) {
      newErrors.productImages = '최소 1개의 상품 사진을 업로드해주세요.';
    }

    if (formData.location === '장소를 선택하세요.') {
      newErrors.location = '장소를 선택하세요.'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openMap = (value: boolean) => {
    setLoadMap(value);
  }

  return (
    <div className={`flex justify-center`}>
      <div className={`w-[40rem] md:mt-6 lg:mt-0 p-6 md:p-0`}>
        <h4
          className='text-2xl font-bold'
        >거래 글쓰기</h4>
        <form 
          className={`mt-[2rem]`} 
          onSubmit={handleSubmit}
        >
          {/* 제목, 카테고리 */}
          <div className={`flex flex-col`}>
            <div className={`flex`}>
              <input
                type='text'
                name='productName'
                value={formData.productName}
                onChange={handleInputChange}
                placeholder='제목을 입력하세요.'
                className={`
                  w-[31rem] me-[2rem] px-[0.5rem] py-[0.25rem]
                  bg-light-white border-light-border
                  dark:bg-dark-white dark:border-dark-border
                  border-b focus:outline-none
                `}
              />
              <div className={`w-[7rem]`}>
                <Dropdown
                  label='Write'
                  options={categories}
                  isOpen={openDropdown === 'categories'}
                  onToggle={() => handleToggle('categories')}
                  onSelect={handleCategorySelect}
                  selectedOption={selectedCategory}
                />
              </div>
            </div>
            <div className={`flex justify-between`}>
              {errors.productName && 
                <p className={`
                      mt-[0.25rem]
                      text-light-warning 
                      dark:text-dark-warning
                      text-xs 
                  `}
                >
                  {errors.productName}
                </p>
              }
              {errors.category && 
                <p className={`
                  mt-[0.25rem]
                  text-light-warning
                  dark:text-dark-warning
                  text-xs
                  `}
                >
                  {errors.category}
                </p>}
            </div>
          </div>
          
          {/* 상품 사진 */}
          <div className={`my-[1.5rem]`}>
            <div 
              className={`
                mb-[0.25rem] 
                font-medium
              `}
            >
              상품 사진
            </div>
            <MultiImageUpload onImagesChange={handleImagesChange} />
            {errors.productImages &&
              <p 
                className={`
                  mt-[0.25rem]
                  text-light-warning
                  dark:text-dark-warning
                  text-xs
                `}
              >
                {errors.productImages}
              </p>}
          </div>
          {/* 상품 설명 */}
          <div className={`mb-[1.5rem]`}>
            <div 
              className={`
                mb-[0.25rem]
                font-medium
              `}
            >
              상품 설명
            </div>
            <textarea
              name='productContent'
              value={formData.productContent}
              onChange={handleInputChange}
              className={`
                w-full min-h-[10rem] p-[1rem]
                bg-light-white border-light-border-3
                dark:bg-dark-white dark:border-dark-border-3
                resize-none border focus:outline-none
              `}
              placeholder='사기치면 손모가지 날아갑니다.&#13;&#10;귀찮은데잉'
            />
            {errors.productContent && 
              <p 
                className={`
                  mt-[0.25rem]
                  text-light-warning
                  dark:text-dark-warning
                  text-xs 
                `}
              >
                {errors.productContent}
              </p>}
          </div>
          {/* 거래 유형 */}
          <div className={`mb-[1.5rem]`}>
            <div 
              className={`
                my-[0.25rem] 
                font-medium
              `}
            >
              거래 유형
            </div>
            <div className={`flex`}>
              {buttons.map((button) => (
                <div 
                  key={button} 
                  className={`
                    ${selectedButton === button ? 'bg-light-signature dark:bg-dark-signature text-light-white dark:text-dark-white' : ''}
                    me-[1rem] px-[2rem] py-[0.15rem]
                    border-light-border
                    dark:border-dark-border
                    border cursor-pointer
                  `}
                  onClick={() => handleButtonClick(button)}>{button}</div>
              ))}
            </div>
          </div>
          {/* 금액, 보증금 */}
          <div 
            className={`
              ${selectedButton === '대여' ? 'grid-cols-2' : ''} 
              grid gap-[3rem] mb-[2rem]
            `}
          >
            <div>
              <div 
                className={`
                  my-[0.25rem] 
                  font-medium
                `}
              >
                금액
              </div>
              <div className={`flex flex-col`}>
                <div className={`flex`}>
                  <input
                    type='number'
                    name='productPrice'
                    value={formData.productPrice || ""}
                    onChange={handleInputChange}
                    className={`
                      w-[90%] me-[0.75rem] px-[0.5rem] 
                      bg-light-white border-light-border
                      dark:bg-dark-white dark:border-dark-border
                      text-end border-b focus:outline-none
                    `} 
                  />
                  <div>
                    원
                  </div>
                </div>
                {errors.productPrice && 
                  <p className={`
                      mt-[0.25rem]
                      text-light-warning
                      dark:text-dark-warning
                      text-xs
                    `}
                  >
                    {errors.productPrice}
                  </p>}
              </div>
            </div>
            <div className={`${selectedButton === '대여' ? '' : 'hidden'}`}>
              <div 
                className={`
                  my-[0.25rem]
                  font-medium
                `}
              >
                보증금
              </div>
              <div className={`flex`}>
                <input 
                  type='number'
                  name='deposit'
                  value={formData.deposit || ""}
                  onChange={handleInputChange}
                  className={`
                    w-[90%] me-[0.75rem] px-[0.5rem]
                    bg-light-white border-light-border
                    dark:bg-dark-white dark:border-dark-border
                    text-end border-b focus:outline-none
                  `}
                />
                <div>
                  원
                </div>
              </div>
            </div>
          </div>
          {/* 거래 희망 장소 */}
          <div className={`mb-[5em]`}>
            <div 
              className={`
                my-[0.25rem] 
                font-medium
              `}
            >
              거래 희망 장소
            </div>
            <div 
              onClick={() => openMap(true)} 
              className={`
                flex w-1/2 px-[0.5rem] py-[0.25rem] 
                border-light-border
                dark:border-dark-border
                border
              `}
            >
              <LocationIcon 
                fill='333333' 
                className={`me-[0.5rem]`}
              />
              <div className={`${formData.location === '장소를 선택하세요.' ? 'text-[#999999]' : 'text-black'}`}>
                {formData.location}
              </div>
            </div>
          {errors.location &&
            <p className={`
                mt-[0.25rem]
                text-light-warning
                dark:text-dark-warning
                text-xs
              `}
            >
              {errors.location}
            </p>}
          </div>
          <div className={`text-end`}>
            <button 
              type='submit' 
              className={`
                w-1/2 mb-[2rem] py-[0.35rem]
                bg-light-black text-light-white
                dark:bg-dark-black dark:text-dark-white
                text-center
              `}
            >
              작성 완료
            </button>
          </div>
        </form>
      </div>
      {loadMap && 
        <div 
          className={`
            fixed top-1/2 left-1/2
            -translate-y-1/2 -translate-x-1/2
          `}
        >
      <ProductMap 
        handleLocation={handleLocation} 
        openMap={openMap} />
      </div>}
    </div>
  )
}

export default ProductWrite;