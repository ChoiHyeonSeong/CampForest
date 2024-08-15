import React, { FormEvent, useEffect, useState } from 'react';
import Dropdown from '../Public/Dropdown';
import { ReactComponent as LocationIcon } from '@assets/icons/location.svg';
import { productDetail, productModifyImageUpload, productModify } from '@services/productService';
import MultiImageUpload from '@components/Public/MultiImageUpload';
import ProductMap from './ProductMap';
import { useNavigate, useParams } from 'react-router-dom';
import { setIsLoading } from '@store/modalSlice';
import { useDispatch } from 'react-redux';

type Option = {
  id: number;
  name: string;
};

type ProductRegistDto = {
  productId: number;
  productName: string,
  productPrice: number | undefined,
  productContent: string,
  location: string,
  category: string,
  productImageUrl?: string[],
  deposit: number | undefined,
  latitude: number,
  longitude: number
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

const categoriesData: Option[] = [
  { id: 1, name: '분류 전체' },
  { id: 2, name: '텐트' },
  { id: 3, name: '의자' },
  { id: 4, name: '침낭' },
  { id: 5, name: '테이블' },
  { id: 6, name: '랜턴' },
  { id: 7, name: '코펠' },
  { id: 8, name: '안전용품' },
  { id: 9, name: '버너' },
  { id: 10, name: '기타' },
];


const ProductModify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productId = Number(useParams().productId);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option>(categories[0]);
  const [selectedButton, setSelectedButton] = useState<string>('대여');

  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loadMap, setLoadMap] = useState(false);
  const buttons = ['대여', '판매'];

  const [formData, setFormData]= useState<ProductRegistDto>({
    productId: 0,
    productName: '',
    productPrice: undefined,
    productContent: '',
    location: '장소를 선택하세요.',
    category: '',
    deposit: undefined,
    latitude: 0,
    longitude: 0
  })

  const fetchOriginalData = async () => {
    try {
      const response = await productDetail(productId)

      console.log(response)

      setFormData({
        productId: response.productId,
        productName: response.productName,
        productPrice: response.productPrice,
        productContent: response.productContent,
        location: response.location,
        category: response.category,
        deposit: response.deposit,
        latitude: response.latitude,
        longitude: response.longitude
      })

      const category = categoriesData.find(category => category.name === response.category)
      if (category) {
        setSelectedCategory(category)
      }
      
      if (response.productType === "SALE") {
        setSelectedButton('판매')
      } else {
        setSelectedButton('대여')
      }

      setOriginalImages(response.imageUrls)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchOriginalData()
  }, [])

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCategorySelect = (option: Option) => {
    console.log(option)
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

  const handleLocation = (dongName: string, latitude: number, longitude: number) => {
    setFormData(prevData => ({
      ...prevData,
      location: dongName,
      latitude: latitude,
      longitude: longitude
    }));
  };

  const handleImagesChange = (images: File[]) => {
    setProductImages(images);
  };

  const handleOriginalImages = (urls: string[]) => {
    setOriginalImages(urls)
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); 

    if (!validateForm()) {
      return;
    }

    let category: string;

    if (selectedCategory.name === '침낭/매트') {
      category = '침낭'
    } else if (selectedCategory.name === '코펠/식기') {
      category = '코펠'
    } else if (selectedCategory.name === '버너/화로') {
      category = '버너'
    } else {
      category = selectedCategory.name
    }

    const newImages = productImages.filter(file => file.name !== 'tempImage');

    try {
      dispatch(setIsLoading(true));
      const response1 = await productModifyImageUpload(newImages);
      console.log(response1)
      const newImagesUrls = [...originalImages, ...response1.data]
      const submitData = {
        ...formData,
        category: category,
        productImageUrl: newImagesUrls
      };
      const response2 = await productModify(submitData)
      console.log(response2)
      dispatch(setIsLoading(false));
      navigate('/product/list/all');
    } catch (error) {
      console.log(error)
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
    <div className={`flex justify-center min-h-screen`}>
      <div
        className={`
          w-full md:w-[40rem] md:my-[1.5rem] p-[1.5rem]
          bg-light-white bg-opacity-80
          dark:bg-dark-white dark:bg-opacity-80
          rounded
        `}
      >
        <form
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
                  bg-light-white border-light-border placeholder:text-light-text-secondary
                  dark:bg-dark-white dark:border-dark-border dark:placeholder:text-dark-text-secondary
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
            <MultiImageUpload onImagesChange={handleImagesChange} prevImages={originalImages} handleOriginalImages={handleOriginalImages}/>
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
                bg-light-white placeholder:text-light-text-secondary
                dark:bg-dark-white dark:placeholder:text-dark-text-secondary
                resize-none  focus:outline-none
              `}
              placeholder='상품에 대한 설명을 작성해주세요. &#13;&#10;상세한 설명과 사진은 판매 및 대여에 도움이 됩니다.'
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
                my-[0.5rem] 
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
                    ${selectedButton === button ? 'bg-light-signature dark:bg-dark-signature text-white' : 'hidden'}
                    me-[1rem] px-[2rem] py-[0.15rem]
                    border-light-border-2 
                    dark:border-dark-border-2
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
                <div className={`flex items-center`}>
                  <input
                    type='number'
                    name='productPrice'
                    value={formData.productPrice || ""}
                    onChange={handleInputChange}
                    className={`
                      w-[90%] me-[0.75rem] px-[0.5rem] py-[0.2rem]
                      bg-light-white border-light-border
                      dark:bg-dark-white dark:border-dark-border
                      text-end border-b focus:outline-none
                    `} 
                  />
                  <div className='text-lg'>
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
                    w-[90%] me-[0.75rem] px-[0.5rem] py-[0.2rem]
                    bg-light-white border-light-border placeholder:text-light-text-secondary
                    dark:bg-dark-white dark:border-dark-border dark:placeholder:text-dark-text-secondary
                    text-end border-b focus:outline-none
                  `}
                />
                <div className='text-lg'>
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
                bg-light-white
                dark:bg-dark-white
                cursor-pointer
              `}
            >
              <LocationIcon
                className={`
                  size-[1.25rem] me-[0.5rem]
                  fill-light-border-icon
                  dark:fill-dark-border-icon
                `}
              />
              <div className={`${formData.location === '장소를 선택하세요.' ? 'text-light-text-secondary dark:text-dark-text-secondary' : 'text-light-text-secondary dark:text-dark-text-secondary'} cursor-pointer`}>
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
          <div className={`text-center`}>
            <button 
              type='submit' 
              className={`
                w-full md:w-1/2 mb-[2rem] py-[0.35rem]
                bg-light-black text-light-white hover:bg-light-signature
                dark:bg-dark-black dark:text-dark-white hover:dark:bg-dark-signature
                transition-all duration-150
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
        situation={'productWrite'}
        isPersonal={false}
        handleLocation={handleLocation} 
        openMap={openMap} />
      </div>}
    </div>
  )
}

export default ProductModify;